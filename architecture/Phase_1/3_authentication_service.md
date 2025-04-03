# Phase 1: Authentication Service (MVP)

## 1. Introduction

This document outlines the implementation plan for the Minimum Viable Product (MVP) of the Authentication Service for the Selkie backend API during Phase 1. The primary goal is to enable secure user registration and login functionality, issuing JSON Web Tokens (JWT) for authenticating subsequent API requests. This service is foundational for securing access to other Selkie features.

## 2. Data Model (Neo4j)

*   **Node Label**: `:User`
*   **Properties**:
    *   `username`: String (Unique identifier for login, potentially email)
    *   `email`: String (User's email address, potentially unique)
    *   `hashed_password`: String (Securely hashed password using bcrypt)
    *   *(Optional future properties: `user_id` (UUID), `full_name`, `created_at`, `is_active`, `is_superuser`)*

## 3. API Endpoints (`app/api/v1/endpoints/auth.py`)

An `APIRouter` will be defined for authentication endpoints, typically mounted under the `/auth` prefix.

*   **User Registration**:
    *   **Endpoint**: `POST /register`
    *   **Request Body**: `schemas.UserCreate` (containing username, email, password)
    *   **Response Body**: `schemas.User` (containing username, email - excluding password)
    *   **Logic**: Validates input, checks if username/email already exists, hashes the password, creates the `:User` node in Neo4j, returns the created user data. Handles potential database errors (e.g., uniqueness constraint violation).
*   **User Login (Token Generation)**:
    *   **Endpoint**: `POST /login` (or `/token`)
    *   **Request Body**: `OAuth2PasswordRequestForm` (standard FastAPI form data for username/password) or a custom `schemas.UserLogin` Pydantic model. Using the standard form is often preferred for compatibility with OpenAPI docs UI.
    *   **Response Body**: `schemas.Token` (containing `access_token` and `token_type`)
    *   **Logic**: Authenticates the user (finds user by username, verifies password hash), generates a JWT access token upon successful authentication, returns the token. Handles invalid credentials errors.

## 4. Schemas (`app/schemas/`)

The following Pydantic models will be defined, likely within `app/schemas/user.py` and `app/schemas/token.py`:

*   `UserBase`: Base schema with common user fields (e.g., email).
*   `UserCreate(UserBase)`: Schema for user registration request (includes password).
*   `UserLogin`: Schema for user login request (if not using `OAuth2PasswordRequestForm`).
*   `User(UserBase)`: Schema for representing user data returned by the API (excludes sensitive info like password).
*   `UserInDB(User)`: Schema representing user data including the hashed password, for internal use.
*   `Token`: Schema for the access token response (`access_token`, `token_type`).
*   `TokenData`: Schema for data encoded within the JWT (e.g., `username` or `user_id` as the subject `sub`).

## 5. Core Logic (`app/crud/user.py` or `app/services/auth_service.py`)

Functions responsible for the core authentication operations:

*   `get_user_by_username(tx: AsyncManagedTransaction, username: str)`: Retrieves a user from Neo4j by username.
*   `get_user_by_email(tx: AsyncManagedTransaction, email: str)`: Retrieves a user from Neo4j by email.
*   `create_user(tx: AsyncManagedTransaction, user: schemas.UserCreate)`: Hashes the password using `get_password_hash`, checks for existing user by username/email, creates the `:User` node in Neo4j, returns the created user data.
*   `authenticate_user(tx: AsyncManagedTransaction, username: str, password: str)`: Retrieves the user by username, verifies the provided plain password against the stored hash using `verify_password`. Returns the user object if valid, otherwise returns `None` or raises an exception.

## 6. Security Implementation (`app/core/security.py`)

*   **Password Hashing**:
    *   Library: `passlib` with `bcrypt` context (`passlib[bcrypt]`).
    *   Functions:
        *   `verify_password(plain_password: str, hashed_password: str) -> bool`: Verifies a plain password against a stored hash.
        *   `get_password_hash(password: str) -> str`: Generates a bcrypt hash for a given password.
*   **JSON Web Tokens (JWT)**:
    *   Library: `python-jose` with cryptography extras (`python-jose[cryptography]`).
    *   Configuration: `SECRET_KEY` (a strong, random string), `ALGORITHM` (e.g., "HS256"), `ACCESS_TOKEN_EXPIRE_MINUTES` will be defined in `app/core/config.py` and loaded from environment variables.
    *   Functions:
        *   `create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str`: Creates a JWT containing the provided data (e.g., `{"sub": username}`), an expiration time (`exp`), and signs it using the `SECRET_KEY` and `ALGORITHM`.
        *   `decode_access_token(token: str) -> Optional[dict]`: Decodes and validates a JWT, checking signature and expiration. Returns the payload if valid, otherwise raises an exception or returns `None`.

## 7. Dependencies (`pyproject.toml`)

The following dependencies must be added to `pyproject.toml`:

*   `passlib[bcrypt]`
*   `python-jose[cryptography]`

## 8. Protected Route Dependency

*   A basic dependency function (e.g., `get_current_user`) will be created, likely using FastAPI's `OAuth2PasswordBearer`.
*   This dependency will:
    1.  Take the token from the `Authorization: Bearer <token>` header.
    2.  Use `decode_access_token` to validate the token and extract the subject (e.g., username).
    3.  Optionally, retrieve the full user object from the database based on the subject.
    4.  Raise an `HTTPException` (e.g., 401 Unauthorized) if the token is invalid, expired, or the user doesn't exist.
*   API endpoints requiring authentication will include this dependency (`user: schemas.User = Depends(get_current_user)`).