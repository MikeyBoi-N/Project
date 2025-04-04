import os
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import Request, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer # Although not directly used for cookie, good to have context
from typing import Annotated

from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import EmailStr
from app.core.config import settings # Import centralized settings
from . import crud, schemas # Import crud and schemas
from app.db.session import get_db_transaction # Import db transaction dependency
from neo4j import AsyncManagedTransaction # Import transaction type hint

# Configuration (Ideally load from environment variables)
# TODO: Move these to environment variables (.env file) and load them
# SECRET_KEY = os.getenv("SECRET_KEY", "a_very_secret_key_that_should_be_changed") # Now in settings
# ALGORITHM = os.getenv("ALGORITHM", "HS256")
 # Now in settings
# ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
 # Now in settings

# Password Hashing Context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against a hashed password."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hashes a plain password."""
    return pwd_context.hash(password)

# --- JWT Handling Functions (to be added next) ---

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Creates a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    # Ensure the subject ('sub') is present in the data
    if "sub" not in to_encode:
        raise ValueError("Subject ('sub') key missing from token data")
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    """
    Decodes a JWT access token.
    Returns the payload dictionary if valid, None otherwise.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        # Optionally add more validation here (e.g., check 'iss', 'aud')
        # Check if token has expired (though jwt.decode usually handles this)
        if "exp" in payload and datetime.fromtimestamp(payload["exp"], tz=timezone.utc) < datetime.now(timezone.utc):
             return None # Explicitly check expiration
        return payload
    except JWTError:
        # Covers invalid signature, expired token (if not caught above), malformed token, etc.)
         return None

# --- Dependency for getting current user from JWT Cookie ---

async def get_current_user_from_cookie(
    request: Request,
    tx: Annotated[AsyncManagedTransaction, Depends(get_db_transaction)]
) -> schemas.User:
    """
    Dependency function to extract JWT from cookie, validate it,
    and return the current user.
    Raises HTTPException 401 if token is invalid, missing, or user not found.
    """
    token = request.cookies.get("access_token")

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}, # Indicate Bearer scheme expected conceptually
    )

    if token is None:
        raise credentials_exception

    # Handle potential 'Bearer ' prefix if included in cookie value
    if token.startswith("Bearer "):
        token = token.split("Bearer ")[1]

    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    # Extract user identifier (e.g., email or user_id) from payload
    email: Optional[str] = payload.get("sub")
    user_id: Optional[str] = payload.get("user_id") # Assuming user_id is in payload

    if email is None and user_id is None:
        # If neither identifier is present, we cannot find the user
        raise credentials_exception

    user: Optional[schemas.UserInDB] = None
    # Prioritize lookup by user_id if available, otherwise use email
    # Note: Requires get_user_by_id to be implemented in crud.py if used
    # if user_id:
    #     user = await crud.get_user_by_id(tx, user_id=user_id)
    if email:
        user = await crud.get_user_by_email(tx, email=email)
    # Add elif user_id: block here if get_user_by_id is implemented

    if user is None:
        raise credentials_exception

    # Return the user schema (adjust if UserInDB needs conversion to User)
    # Assuming User schema is compatible or UserInDB can be returned directly
    # If User schema is different, map fields: return schemas.User(**user.dict())
    return user # Return the fetched user object (ensure it matches return type hint)
