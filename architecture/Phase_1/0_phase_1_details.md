# Selkie Project - Phase 1 Detailed Plan

## Goal

The primary goal of Phase 1 is to establish the foundational architecture and core services of the Selkie application, and deliver a Minimum Viable Product (MVP) for the **Kappa** tool focused on text document ingestion, storage, and basic keyword search. This phase proves the core technology stack integration and provides a tangible starting point for users.

## Key Steps & Tasks

1.  **Foundation & Setup (Environment)**
    *   Initialize Git repository.
    *   Set up Python backend project using Poetry (`pyproject.toml`).
    *   Set up Next.js frontend project (`package.json`).
    *   Create `docker-compose.yml` defining services for:
        *   `backend` (FastAPI application)
        *   `frontend` (Next.js application)
        *   `graphdb` (Neo4j instance)
        *   `objectstore` (MinIO instance)
    *   Configure basic networking between Docker services.
    *   Establish CI/CD pipeline basics (optional but recommended, e.g., GitHub Actions for linting/testing).

2.  **Backend Development (FastAPI)**
    *   **Core API Structure**:
        *   Set up main FastAPI application instance.
        *   Organize project structure (e.g., routers, models, services, database connectors).
        *   Implement basic health check endpoint (`/health`).
    *   **Database/Storage Integration**:
        *   Implement connection logic for Neo4j (using official Python driver).
        *   Implement connection logic for MinIO (using `minio-py`).
        *   Define core Pydantic models for API requests/responses.
    *   **Authentication Service (MVP)**:
        *   Define User node structure in Neo4j (`(:User {username, hashed_password, email})`).
        *   Create API endpoints for user registration (`/auth/register`).
        *   Create API endpoints for user login (`/auth/login`) returning a simple token (e.g., JWT - implement basic JWT handling).
        *   Implement basic dependency for protected endpoints (verifying token).
    *   **Kappa Service (Text MVP)**:
        *   Define Document node structure in Neo4j (`(:Document {doc_id, filename, content_type, upload_timestamp, object_store_key})`).
        *   Define relationship between User and Document (`(:User)-[:UPLOADED]->(:Document)`).
        *   Create API endpoint for document upload (`/kappa/documents/upload`):
            *   Accepts file upload.
            *   Stores file in MinIO.
            *   Creates Document node in Neo4j with metadata and link to MinIO object.
            *   Creates UPLOADED relationship from authenticated user.
        *   Create API endpoint for basic keyword search (`/kappa/documents/search?q=keyword`):
            *   Queries Neo4j for Document nodes (initially simple property search on filename or potentially indexed content later).
            *   Returns list of matching document metadata.
        *   Create API endpoint to retrieve document details/content (`/kappa/documents/{doc_id}`):
            *   Retrieves metadata from Neo4j.
            *   Retrieves file content from MinIO using the stored key.
            *   Returns metadata and content.

3.  **Frontend Development (Next.js)**
    *   **Core Setup**:
        *   Set up basic project structure (pages, components, styles, API client).
        *   Implement basic layout component (e.g., header, sidebar, main content area).
        *   Set up routing using Next.js router.
        *   Implement an API client utility to interact with the backend FastAPI service.
    *   **Authentication Pages**:
        *   Create Login page (`/login`) with form to call backend `/auth/login`. Store token (e.g., in localStorage or context).
        *   Create Registration page (`/register`) with form to call backend `/auth/register`.
        *   Implement logic to redirect based on authentication status (protected routes).
    *   **Kappa MVP Pages**:
        *   Create Dashboard/Home page (`/`) - Simple landing page after login.
        *   Create Document Upload page (`/upload`) with a file input form calling backend `/kappa/documents/upload`.
        *   Create Search page (`/search`) with an input field calling backend `/kappa/documents/search` and displaying results (list of document filenames/metadata).
        *   Create Document View page (`/documents/[doc_id]`) calling backend `/kappa/documents/{doc_id}` and displaying document metadata and content.

## Initial Web Application Pages (Phase 1)

The following pages are essential for the Phase 1 MVP:

1.  `/login`: User Authentication.
2.  `/register`: New User Registration.
3.  `/` (or `/dashboard`): Main landing page post-login. Provides access to other features.
4.  `/upload`: Interface for uploading text documents.
5.  `/search`: Interface for keyword search and displaying results.
6.  `/documents/[doc_id]`: Dynamic route to display details and content of a specific document.

## Implementation Approach & Strategy

*   **Iterative Development**: Build features incrementally, starting with the core setup and authentication, then moving to Kappa MVP features.
*   **API-First**: Define clear API contracts (using Pydantic models and FastAPI's OpenAPI documentation) between the frontend and backend early on.
*   **Backend First (Core)**: Focus on getting the Docker environment, database connections, and basic Auth service working reliably before building extensive features.
*   **Component-Based Frontend**: Build reusable UI components in Next.js for forms, lists, navigation, etc.
*   **Testing**: Implement basic unit/integration tests for backend API endpoints (using `pytest` and FastAPI's `TestClient`). Basic frontend component tests can be added if time permits.
*   **Simplicity**: Focus on core functionality. Avoid premature optimization or overly complex UI elements in this initial phase. The goal is a working, integrated foundation.
*   **Version Control**: Use Git diligently with meaningful commit messages and potentially feature branches.