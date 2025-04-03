# Phase 1: Database and Object Storage Integration

## 1. Introduction

This document details the plan for integrating the chosen data persistence layers, Neo4j (graph database) and MinIO (object storage), into the Selkie backend API during Phase 1. This integration is crucial for storing both structured metadata/relationships and large binary files, forming the core of Selkie's data management strategy as outlined in `selkie_architecture.md`.

## 2. Neo4j Integration (`app/db/session.py`)

*   **Driver**: The official asynchronous `neo4j` Python driver (version specified in `pyproject.toml`) will be used for all interactions with the Neo4j database.
*   **Configuration**: Connection details (URI, username, password) will be sourced from the application `Settings` object (`app/core/config.py`), which loads them from environment variables.
*   **Lifecycle Management**:
    *   The Neo4j async driver instance will be managed globally within the application's lifecycle.
    *   `app/db/session.py` will contain `get_driver()` and `close_driver()` async functions.
    *   `get_driver()` will initialize the driver using configured settings upon application startup (called from `app/main.py`'s `lifespan` context manager).
    *   `close_driver()` will gracefully close the driver connection pool during application shutdown (also called from `lifespan`).
*   **Transaction Management**:
    *   A FastAPI dependency, `get_db_transaction()`, will be defined in `app/db/session.py`.
    *   This dependency will yield an `AsyncManagedTransaction` object, ensuring that database operations within API endpoints are executed within a managed transaction (handling begin, commit, rollback automatically).
    *   API endpoint functions requiring database access will depend on this function (e.g., `tx: AsyncManagedTransaction = Depends(get_db_transaction)`).

## 3. MinIO Integration

*   **Client Library**: The official `minio` Python client library will be used for interacting with the MinIO object storage service.
*   **Configuration**: Connection details (endpoint URL, access key, secret key, secure connection flag) will be sourced from the application `Settings` object (`app/core/config.py`).
*   **Client Initialization**:
    *   A MinIO client instance will be initialized using the configured settings.
    *   Consideration will be given to managing the client instance (e.g., as a singleton created on startup or managed via a dependency) to avoid repeated initializations. A utility function or class within `app/core` or a dedicated `app/storage` module could handle this.
*   **Bucket Management**:
    *   A primary bucket name (e.g., `selkie-data`) will be defined in the configuration.
    *   Application startup logic (potentially within `lifespan` or a dedicated initialization function) should ensure this bucket exists, creating it if necessary using `client.make_bucket()`. Error handling for bucket existence checks and creation will be included.
*   **Operations**: Wrapper functions or service methods will be created to abstract common MinIO operations like uploading objects (`put_object`), downloading objects (`get_object`), and potentially deleting objects (`remove_object`), including necessary error handling (e.g., for connection issues, object not found).

## 4. Hybrid Data Modeling Approach

*   **Core Principle**: The integration follows the hybrid model defined in `selkie_architecture.md`.
*   **Neo4j Role**: Stores structured data: nodes representing entities (users, documents, images, etc.) and relationships connecting them. Node properties will include metadata (timestamps, filenames, content types, analysis results, confidence scores) and, crucially, a unique identifier (e.g., a UUID generated during upload) that serves as the key for the corresponding binary file in MinIO. Geospatial data (coordinates, footprints) will also be stored as properties or potentially using Neo4j's spatial capabilities later.
*   **MinIO Role**: Stores the raw binary data (documents, images, audio files, serialized model data, Tesseract scene files). Objects will be named using the unique identifier stored in the corresponding Neo4j node.
*   **Linking**: The unique identifier stored in a Neo4j node property (e.g., `object_store_key`) provides the link to retrieve the associated binary file from MinIO.

## 5. Core Schemas (`app/schemas/`)

*   **Pydantic**: Pydantic models defined in the `app/schemas/` directory will serve as the data contracts for API requests and responses.
*   **Validation**: These schemas ensure that data passed to service functions for database/storage interaction is valid and has the expected structure.
*   **Database Mapping**: While not direct ORM models, these schemas will often mirror the structure of data intended for storage in Neo4j node properties, facilitating clear mapping between API data and database storage. Schemas for data retrieved from the database will also be defined.

## 6. Dependencies (`pyproject.toml`)

*   The `pyproject.toml` file must include the `neo4j` and `minio` libraries as project dependencies. Specific versions should align with compatibility requirements (e.g., Neo4j driver version matching the database server version).