# Phase 1: Core Backend API Structure

## 1. Introduction

This document outlines the implementation plan for establishing the core structure of the Selkie backend API using FastAPI during Phase 1. The goal is to create a robust, modular, and maintainable foundation upon which subsequent services (Kappa, Djinn, Ghost, Tesseract) can be built. This aligns with the overall architecture defined in `selkie_architecture.md` and the tasks outlined in `0_phase_1_details.md`.

## 2. Main Application Setup (`app/main.py`)

*   **Initialization**: The main FastAPI application instance will be created in `app/main.py`. It will be configured with essential metadata such as title ("Selkie Backend API"), description, and version.
*   **Lifespan Management**: A `lifespan` asynchronous context manager will be implemented within `app/main.py`. This manager will handle application startup and shutdown events.
    *   *Startup*: Initialize and establish the connection pool for the Neo4j driver (`app.db.session.get_driver`). Potentially initialize other global resources if needed later.
    *   *Shutdown*: Gracefully close the Neo4j driver connection pool (`app.db.session.close_driver`) and release any other acquired resources.
*   **Health Check Endpoint**: A simple `/health` GET endpoint will be implemented directly in `main.py` to provide a basic status check, confirming the API service is running.

## 3. Project Directory Structure

A modular directory structure will be established within the `backend/app/` directory to promote separation of concerns and maintainability:

*   `api/`: Contains API routing logic. Subdirectories like `v1/` can be used for versioning.
    *   `endpoints/`: Holds individual endpoint files (e.g., `auth.py`, `kappa.py`). Each file will typically define an `APIRouter`.
*   `core/`: Holds core application logic and configuration.
    *   `config.py`: Defines application settings using Pydantic Settings.
*   `db/`: Contains database connection logic and session management.
    *   `session.py`: Manages Neo4j driver lifecycle and provides transaction/session dependencies.
*   `models/`: (Optional/If needed beyond Neo4j nodes) Contains internal data models or representations if distinct from schemas.
*   `schemas/`: Defines Pydantic models for API request/response validation and serialization, as well as data shapes used internally. Grouped by feature (e.g., `user.py`, `document.py`).
*   `services/`: Contains business logic functions or classes, interacting with the database and performing core operations. Grouped by feature (e.g., `auth_service.py`, `kappa_service.py`).
*   `crud/`: (Alternative/Complement to services) Contains Create, Read, Update, Delete operations specific to database interactions, often separated by model/node type.
*   `tests/`: Contains unit and integration tests, mirroring the application structure.

## 4. Configuration Management (`app/core/config.py`)

*   **Pydantic Settings**: The `pydantic-settings` library will be used to manage application configuration. A `Settings` class inheriting from `BaseSettings` will be defined in `app/core/config.py`.
*   **Environment Variables**: Configuration values (database URLs, secrets, API keys, etc.) will be loaded primarily from environment variables.
*   **.env File**: A `.env` file (listed in `.gitignore`) will be used during local development to store environment variables, loaded via `python-dotenv` (implicitly handled by Pydantic Settings or explicitly if needed). Docker Compose will manage environment variables in containerized deployments.

## 5. Dependency Management (`pyproject.toml`)

*   **Poetry**: Project dependencies (FastAPI, Uvicorn, Neo4j driver, MinIO client, Pydantic, etc.) will be managed using Poetry, as defined in `backend/pyproject.toml`. This ensures reproducible builds and dependency resolution.
*   **Key Libraries**: The `pyproject.toml` file will list core dependencies required for the API framework, database interaction, authentication, and configuration. Development dependencies (pytest, httpx, ruff, mypy) will also be managed here.

## 6. API Routing (`app/api/`)

*   **Modularity**: FastAPI's `APIRouter` will be used extensively to create modular API endpoints. Each feature or resource group (e.g., authentication, kappa documents) will have its own router defined in a separate file within `app/api/v1/endpoints/`.
*   **Inclusion**: Routers defined for specific features (starting with Authentication in Phase 1) will be imported and included in the main FastAPI application instance in `app/main.py` using `app.include_router()`. This keeps `main.py` clean and focused on application setup and global concerns.
*   **Prefixes and Tags**: Routers will use path prefixes (e.g., `/auth`, `/kappa`) and tags (e.g., "Authentication", "Kappa") for organization and clear OpenAPI documentation generation.

## 7. Basic Logging and Error Handling

*   **Logging**: Python's built-in `logging` module will be configured in `app/main.py` for basic application logging (e.g., startup/shutdown events, errors). Standard formatting and output to console will be sufficient for Phase 1. More advanced logging (e.g., structured logging, file output) can be added later.
*   **Error Handling**: FastAPI's default exception handling will be used initially. Custom exception handlers can be added later to provide standardized error responses across the API if needed. Pydantic validation errors will be automatically handled by FastAPI, returning informative 422 responses.

## 8. Integration

*   **Docker**: The API structure will be designed to run within the Docker container defined in `backend/Dockerfile` and orchestrated by `docker-compose.yml`.
*   **Future Modules**: The modular structure using routers ensures that future services (Djinn, Ghost, Tesseract) can be easily integrated by creating their respective routers, schemas, services, etc., and including the routers in `main.py`.