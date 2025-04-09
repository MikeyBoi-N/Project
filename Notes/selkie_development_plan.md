# Selkie Application - Detailed Development Plan (Based on Codebase Re-examination)

**Version:** 1.0
**Date:** 2025-04-09

**Objective:** This document outlines a detailed development plan to address findings from the recent codebase re-examination of the Selkie application. The focus is on resolving technical debt, completing placeholder implementations, improving robustness, and establishing best practices across the backend and frontend components.

**Target Audience:** Development Team, Project Management

**Methodology:** This plan is derived directly from the specific findings documented in "Selkie Codebase Re-examination Findings". Each work item references the corresponding finding. Priorities are assigned based on criticality: P0 (Critical/Blocking), P1 (High/Core Functionality), P2 (Medium/Improvement), P3 (Low/Nice-to-have).

---

## Table of Contents

1.  [Dependency Management (Frontend)](#1-dependency-management-frontend)
2.  [Configuration Management](#2-configuration-management)
3.  [Security Enhancements](#3-security-enhancements)
4.  [Core Backend Infrastructure: Storage Utility](#4-core-backend-infrastructure-storage-utility)
5.  [Error Handling & Robustness](#5-error-handling--robustness)
6.  [Feature Completion: Backend CRUD Implementation](#6-feature-completion-backend-crud-implementation)
7.  [Technical Debt Reduction: Backend `TODO` Resolution](#7-technical-debt-reduction-backend-todo-resolution)
8.  [Technical Debt Reduction: Frontend `TODO` Resolution](#8-technical-debt-reduction-frontend-todo-resolution)
9.  [Code Organization (Frontend)](#9-code-organization-frontend)
10. [Testing Strategy & Implementation](#10-testing-strategy--implementation)
11. [Documentation & Logging Enhancements](#11-documentation--logging-enhancements)
12. [Suggested Roadmap / Phasing](#12-suggested-roadmap--phasing)

---

## 1. Dependency Management (Frontend)

**Theme:** Ensure stable and predictable builds by pinning frontend dependencies. Using `"latest"` can introduce breaking changes unexpectedly during development or deployment.

*   **Work Item 1.1 (P0): Pin `react` Dependency**
    *   **Finding:** `frontend/package.json` (Line 23) specifies `"react": "latest"`.
    *   **Task:** Replace `"latest"` with a specific, stable version (e.g., `"^18.2.0"` or the current known working version). Verify compatibility with other dependencies.
    *   **Rationale:** Prevents unexpected breaking changes from minor or major React updates. Ensures build reproducibility.
*   **Work Item 1.2 (P0): Pin `react-dom` Dependency**
    *   **Finding:** `frontend/package.json` (Line 24) specifies `"react-dom": "latest"`.
    *   **Task:** Replace `"latest"` with a specific, stable version compatible with the chosen React version (e.g., `"^18.2.0"`).
    *   **Rationale:** Ensures compatibility with React and prevents unexpected rendering issues.
*   **Work Item 1.3 (P0): Pin `@types/node` Dev Dependency**
    *   **Finding:** `frontend/package.json` (Line 32) specifies `"@types/node": "latest"`.
    *   **Task:** Replace `"latest"` with a specific, stable version (e.g., `"^18.11.18"` or align with the project's Node.js version).
    *   **Rationale:** Prevents build failures or incorrect type checking due to incompatible Node.js type definitions.
*   **Work Item 1.4 (P0): Pin `@types/react` Dev Dependency**
    *   **Finding:** `frontend/package.json` (Line 33) specifies `"@types/react": "latest"`.
    *   **Task:** Replace `"latest"` with a specific, stable version compatible with the chosen React version (e.g., `"^18.2.0"`).
    *   **Rationale:** Ensures accurate type checking for React components and hooks.
*   **Work Item 1.5 (P0): Pin `@types/react-dom` Dev Dependency**
    *   **Finding:** `frontend/package.json` (Line 34) specifies `"@types/react-dom": "latest"`.
    *   **Task:** Replace `"latest"` with a specific, stable version compatible with the chosen React DOM version (e.g., `"^18.2.0"`).
    *   **Rationale:** Ensures accurate type checking for React DOM related functionalities.
*   **Work Item 1.6 (P0): Pin `eslint` Dev Dependency**
    *   **Finding:** `frontend/package.json` (Line 35) specifies `"eslint": "latest"`.
    *   **Task:** Replace `"latest"` with a specific, stable version (e.g., `"^8.50.0"`). Ensure compatibility with ESLint plugins and configurations.
    *   **Rationale:** Prevents inconsistent linting results or errors caused by ESLint updates.
*   **Work Item 1.7 (P0): Pin `eslint-config-next` Dev Dependency**
    *   **Finding:** `frontend/package.json` (Line 36) specifies `"eslint-config-next": "latest"`.
    *   **Task:** Replace `"latest"` with a specific, stable version compatible with the project's Next.js version.
    *   **Rationale:** Ensures linting rules align with the Next.js version being used.
*   **Work Item 1.8 (P0): Pin `typescript` Dev Dependency**
    *   **Finding:** `frontend/package.json` (Line 37) specifies `"typescript": "latest"`.
    *   **Task:** Replace `"latest"` with a specific, stable version (e.g., `"^5.2.2"`). Verify compatibility with the codebase and other type dependencies.
    *   **Rationale:** Prevents build failures or unexpected type errors due to TypeScript language or compiler changes.

## 2. Configuration Management

**Theme:** Improve maintainability and deployment flexibility by externalizing configuration values instead of hardcoding them.

*   **Work Item 2.1 (P2): Externalize Backend Auth Redirect URLs**
    *   **Finding:** Hardcoded frontend URLs in `backend/app/auth/router.py`:
        *   Line 170: `frontend_url = "/"` (Success redirect) - Marked with `TODO: Define frontend URL in settings?`
        *   Line 188: `error_url = "/login?error=oauth_failed"` (Error redirect) - Marked with `TODO: Define frontend error URL?`
    *   **Task:**
        1.  Define environment variables (e.g., `FRONTEND_OAUTH_SUCCESS_URL`, `FRONTEND_OAUTH_ERROR_URL`) in `.env`.
        2.  Load these variables into the application settings (e.g., using Pydantic's `BaseSettings`).
        3.  Replace the hardcoded strings in `backend/app/auth/router.py` with references to these settings.
    *   **Rationale:** Allows easy configuration of frontend endpoints for different deployment environments (development, staging, production) without code changes. Addresses explicit `TODO`s.
*   **Work Item 2.2 (P2): Implement Centralized Frontend API Base URL Configuration**
    *   **Finding:** API paths are hardcoded as relative paths in frontend components (e.g., `'/api/mapdata'`, `'/api/tesseract/scenes/upload'`, `'/api/kappa/documents/upload'`). No central configuration mechanism observed.
    *   **Task:**
        1.  Define a public environment variable in `frontend/.env.local` (and other environment files) for the API base URL (e.g., `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api` or `/api` for same-origin).
        2.  Create a utility function or configure `axios` globally to prepend this base URL to all API requests.
        3.  Update all `axios` calls (or equivalent fetch calls) in components like `TesseractSceneUploadForm.tsx`, `SharedMapComponent.tsx`, `DocumentUploadForm.tsx`, etc., to use the centralized configuration.
    *   **Rationale:** Simplifies pointing the frontend to different backend instances (local, staging, production). Improves maintainability by having a single source for the API endpoint.

## 3. Security Enhancements

**Theme:** Address security placeholders, particularly regarding authentication tokens in frontend requests.

*   **Work Item 3.1 (P1): Implement Authentication Token Handling in Tesseract Upload**
    *   **Finding:** `frontend/components/tesseract/TesseractSceneUploadForm.tsx` (Line 95) has `// TODO: Add authentication token`. The `axios.post` call currently lacks an `Authorization` header.
    *   **Task:**
        1.  Retrieve the authentication token (presumably JWT) from the application's state management or context (e.g., `AuthContext`).
        2.  Include the token in the `Authorization: Bearer <token>` header for the `/api/tesseract/scenes/upload` request.
        3.  Ensure appropriate error handling if the token is missing or invalid.
    *   **Rationale:** Secures the Tesseract scene upload endpoint, ensuring only authenticated users can upload data. Addresses a critical security `TODO`.
*   **Work Item 3.2 (P1): Implement Authentication Token Handling in Kappa Upload**
    *   **Finding:** `frontend/components/kappa/DocumentUploadForm.tsx` (Line 42) has `// TODO: Add authentication token (e.g., from context/state management)`. The `axios.post` call currently lacks an `Authorization` header.
    *   **Task:**
        1.  Retrieve the authentication token from the application's state management or context.
        2.  Include the token in the `Authorization: Bearer <token>` header for the `/api/kappa/documents/upload` request.
        3.  Ensure appropriate error handling if the token is missing or invalid.
    *   **Rationale:** Secures the Kappa document upload endpoint. Addresses a critical security `TODO`.
*   **Work Item 3.3 (P2): Implement Permission Check Before Djinn Detection**
    *   **Finding:** `backend/app/djinn/router.py` (Line 109) has `# TODO: First, optionally check if the image exists and if the user has permission`. The `/images/{image_id}/detect` endpoint currently retrieves the image directly without explicit permission checks.
    *   **Task:**
        1.  Modify the `run_detection_on_image` endpoint logic.
        2.  Before fetching the image via `crud.get_image`, implement a check:
            *   Verify the image with `image_id` exists.
            *   Verify the `current_user` has permission to access/process this image (requires defining ownership or access control logic, potentially linking images to users).
        3.  Return appropriate HTTP errors (e.g., 404 Not Found, 403 Forbidden) if checks fail.
    *   **Rationale:** Enhances security by preventing unauthorized users from triggering potentially resource-intensive object detection on arbitrary images.

## 4. Core Backend Infrastructure: Storage Utility

**Theme:** Implement the planned central storage utility for handling file uploads and potentially downloads, replacing placeholder logic.

*   **Work Item 4.1 (P0): Create Core Storage Module (`storage.py`)**
    *   **Finding:** The file `backend/app/core/storage.py` does not exist, despite being referenced in multiple `TODO` comments.
    *   **Task:**
        1.  Create the file `backend/app/core/storage.py`.
        2.  Define the core interface/functions for storage operations (e.g., `upload_to_storage`, `delete_from_storage`, potentially `get_storage_url`).
        3.  Implement the chosen storage backend logic (e.g., MinIO client interaction, local file system storage for development). Use environment variables for configuration (bucket names, endpoint URLs, credentials).
    *   **Rationale:** Establishes the foundation for consistent file handling across the application. Addresses a fundamental missing piece of infrastructure.
*   **Work Item 4.2 (P1): Integrate Storage Utility in Tesseract Router**
    *   **Finding:**
        *   `backend/app/tesseract/router.py` (Line 14): Commented import `# from ..core.storage import upload_to_storage # TODO: Import storage utility when created`.
        *   `backend/app/tesseract/router.py` (Line 49): `# TODO: Implement file upload logic using a storage utility`. Current logic generates a placeholder URI.
    *   **Task:**
        1.  Uncomment the import statement (Line 14).
        2.  Replace the placeholder file handling logic (Lines 49-53) with a call to the `upload_to_storage` function from `core.storage`.
        3.  Ensure the actual storage URI/path returned by the utility is used when creating the `TesseractSceneCreate` object.
    *   **Rationale:** Implements actual file persistence for Tesseract scenes, replacing placeholder logic.
*   **Work Item 4.3 (P1): Integrate Storage Utility in Kappa Router**
    *   **Finding:**
        *   `backend/app/kappa/router.py` (Line 17): Commented import `# from ..core.storage import upload_to_storage # TODO: Import storage utility when created`.
        *   `backend/app/kappa/router.py` (Line 43): `# TODO: Implement file upload logic using a storage utility`. Current logic generates a placeholder URI.
    *   **Task:**
        1.  Uncomment the import statement (Line 17).
        2.  Replace the placeholder file handling logic (Lines 43-47) with a call to the `upload_to_storage` function.
        3.  Use the actual storage URI/path when creating the `DocumentCreate` object.
    *   **Rationale:** Implements actual file persistence for Kappa documents.
*   **Work Item 4.4 (P1): Integrate Storage Utility in Ghost Router**
    *   **Finding:**
        *   `backend/app/ghost/router.py` (Line 14): Commented import `# from ..core.storage import upload_to_storage # TODO: Import storage utility when created`.
        *   `backend/app/ghost/router.py` (Line 46): `# TODO: Implement file upload logic using a storage utility`. Current logic generates a placeholder URI.
    *   **Task:**
        1.  Uncomment the import statement (Line 14).
        2.  Replace the placeholder file handling logic (Lines 46-50) with a call to the `upload_to_storage` function.
        3.  Use the actual storage URI/path when creating the `SignalEventCreate` object.
    *   **Rationale:** Implements actual file persistence for Ghost signal recordings.
*   **Work Item 4.5 (P1): Integrate Storage Utility in Djinn Router**
    *   **Finding:**
        *   `backend/app/djinn/router.py` (Line 14): Commented import `# from ..core.storage import upload_to_storage # TODO: Import storage utility when created`.
        *   `backend/app/djinn/router.py` (Line 43): `# TODO: Implement file upload logic using a storage utility`. Current logic generates a placeholder URI.
    *   **Task:**
        1.  Uncomment the import statement (Line 14).
        2.  Replace the placeholder file handling logic (Lines 43-47) with a call to the `upload_to_storage` function.
        3.  Use the actual storage URI/path when creating the `ImageCreate` object.
    *   **Rationale:** Implements actual file persistence for Djinn images.

## 5. Error Handling & Robustness

**Theme:** Implement crucial error handling cleanup logic, particularly ensuring atomicity between file storage and database operations.

*   **Work Item 5.1 (P0): Implement Storage Cleanup on DB Error (Tesseract)**
    *   **Finding:** `backend/app/tesseract/router.py` (Line 74): `# TODO: Add cleanup logic (delete scene file from storage if DB fails)` within the `except` block of the upload endpoint.
    *   **Task:**
        1.  Ensure the `storage_uri` is captured before the `try` block for database insertion.
        2.  In the `except` block (after catching a DB error), add a call to a `delete_from_storage(storage_uri)` function (to be implemented in `core.storage`).
        3.  Handle potential errors during the deletion attempt itself (e.g., log warnings).
    *   **Rationale:** Prevents orphaned files in storage if the corresponding database record creation fails, ensuring data consistency. Critical for resource management.
*   **Work Item 5.2 (P0): Implement Storage Cleanup on DB Error (Kappa)**
    *   **Finding:** `backend/app/kappa/router.py` (Line 77): `# TODO: Add cleanup logic here - e.g., delete the file from storage if DB operation fails` within the `except` block.
    *   **Task:** Similar to 5.1, implement `delete_from_storage(storage_uri)` call within the `except` block for the Kappa document upload endpoint.
    *   **Rationale:** Prevents orphaned Kappa documents in storage. Critical for data consistency.
*   **Work Item 5.3 (P0): Implement Storage Cleanup on DB Error (Ghost)**
    *   **Finding:** `backend/app/ghost/router.py` (Line 83): `# TODO: Add cleanup logic (delete recording from storage if DB fails)` within the `except` block.
    *   **Task:** Similar to 5.1, implement `delete_from_storage(storage_uri)` call within the `except` block for the Ghost signal upload endpoint.
    *   **Rationale:** Prevents orphaned Ghost recordings in storage. Critical for data consistency.
*   **Work Item 5.4 (P0): Implement Storage Cleanup on DB Error (Djinn)**
    *   **Finding:** `backend/app/djinn/router.py` (Line 91): `# TODO: Add cleanup logic (delete from storage)` within the `except` block.
    *   **Task:** Similar to 5.1, implement `delete_from_storage(storage_uri)` call within the `except` block for the Djinn image upload endpoint.
    *   **Rationale:** Prevents orphaned Djinn images in storage. Critical for data consistency.

## 6. Feature Completion: Backend CRUD Implementation

**Theme:** Implement the placeholder CRUD (Create, Read, Update, Delete) operations defined in various `crud.py` files, replacing placeholder logic and warnings with actual Neo4j database interactions.

*   **Work Item 6.1 (P1): Implement Tesseract CRUD Operations**
    *   **Finding:** `backend/app/tesseract/crud.py` contains placeholder functions:
        *   `create_tesseract_scene`: Logs warning, returns placeholder, `TODO` for Neo4j query.
        *   `get_tesseract_scene`: Logs warning, returns `None`, `TODO` for Neo4j query.
        *   `get_all_tesseract_scenes`: Logs warning, returns `[]`, `TODO` for Neo4j query.
        *   `TODO` comments for update, delete, and query functions.
    *   **Task:**
        1.  Implement the actual Cypher query in `create_tesseract_scene` to create a `TesseractScene` node with properties from the input schema. Return the created node data.
        2.  Implement the Cypher query in `get_tesseract_scene` to retrieve a scene by its ID. Handle not found cases.
        3.  Implement the Cypher query in `get_all_tesseract_scenes` to retrieve all scenes, potentially adding basic pagination/sorting later.
        4.  (Optional - P2) Implement `update_tesseract_scene`, `delete_tesseract_scene`, and specific query functions (e.g., by location) as needed based on feature requirements.
    *   **Rationale:** Enables persistence and retrieval of Tesseract scene data, a core function of the module.
*   **Work Item 6.2 (P1): Implement Ghost CRUD Operations**
    *   **Finding:** `backend/app/ghost/crud.py` contains placeholder functions:
        *   `create_signal_event`: Logs warning, returns placeholder, `TODO` for Neo4j query.
        *   `get_signal_events`: Logs warning, returns `[]`, `TODO` for Neo4j query.
        *   `TODO` comments for get by ID, update, delete, and query functions.
    *   **Task:**
        1.  Implement the Cypher query in `create_signal_event` to create a `SignalEvent` node. Return the created node data.
        2.  Implement the Cypher query in `get_signal_events` to retrieve events. Consider adding filtering/sorting parameters based on router `TODO` (Work Item 7.11).
        3.  (Optional - P2) Implement `get_signal_event_by_id`, `update_signal_event`, `delete_signal_event`, and specific query functions (time, location, frequency) as needed.
    *   **Rationale:** Enables persistence and retrieval of Ghost signal event data.
*   **Work Item 6.3 (P1): Implement Djinn DetectedObject CRUD Operations**
    *   **Finding:** `backend/app/djinn/crud.py` contains placeholder functions:
        *   `create_detected_object`: Logs warning, returns placeholder, `TODO` for Neo4j query.
        *   `get_detected_objects_for_image`: Logs warning, returns `[]`, `TODO` for Neo4j query.
        *   `TODO` comment for Image get by ID, update, delete functions.
    *   **Task:**
        1.  Implement the Cypher query in `create_detected_object` to create a `DetectedObject` node and link it (e.g., via `DETECTED_IN` relationship) to the corresponding `Image` node. Return the created object data.
        2.  Implement the Cypher query in `get_detected_objects_for_image` to find all `DetectedObject` nodes linked to a given `image_id`.
        3.  (Optional - P2) Implement `get_image_by_id`, `update_image`, `delete_image` functions if required.
    *   **Rationale:** Enables persistence and retrieval of object detection results, a core function of the Djinn module.
*   **Work Item 6.4 (P2): Implement Kappa Count for Pagination**
    *   **Finding:**
        *   `backend/app/kappa/crud.py` (Line 139): `# TODO: Implement count_search_results function for pagination metadata`.
        *   `backend/app/kappa/router.py` (Line 104): `# TODO: Implement and call crud.count_search_results for accurate total_count`.
    *   **Task:**
        1.  Implement the `count_search_results` function in `backend/app/kappa/crud.py`. This function should take the same search criteria as `search_documents` and return the total number of matching documents using an efficient Cypher count query.
        2.  Modify the `/documents/search` endpoint in `backend/app/kappa/router.py` to call `crud.count_search_results` and include the result in the `SearchResponse`'s `total_count` field.
    *   **Rationale:** Provides necessary metadata for implementing accurate frontend pagination for search results.
*   **Work Item 6.5 (P2): Consider Additional Kappa CRUD**
    *   **Finding:** `backend/app/kappa/crud.py` (Line 140): `# TODO: Consider adding functions to get a single document by ID, update, delete etc.`
    *   **Task:** Evaluate the need for `get_document_by_id`, `update_document`, and `delete_document` functions based on application requirements. Implement if necessary.
    *   **Rationale:** Provides standard CRUD capabilities for Kappa documents if required by frontend features or administrative tasks.

## 7. Technical Debt Reduction: Backend `TODO` Resolution

**Theme:** Address the remaining specific `TODO` comments identified in the backend codebase, representing planned features, enhancements, or fixes.

*   **Work Item 7.1 (P2): Add Tesseract Dependencies**
    *   **Finding:** `backend/pyproject.toml` (Line 27): `# TODO: Add Tesseract dependencies (e.g., Gaussian Splatting libraries, 3D processing) when needed`.
    *   **Task:** Identify the specific Python libraries required for Tesseract scene processing (Gaussian Splatting, 3D libraries). Add them to the `[tool.poetry.dependencies]` section of `pyproject.toml`. Run `poetry lock` and `poetry install`.
    *   **Rationale:** Incorporates necessary libraries for the Tesseract module's core functionality. Deferred until Tesseract processing logic is actively developed.
*   **Work Item 7.2 (P1): Implement Tesseract Scene List Endpoint**
    *   **Finding:** `backend/app/tesseract/router.py` (Line 108): `# TODO: Add endpoint to get list of scenes? (/scenes/) - Calls crud.get_all_tesseract_scenes`.
    *   **Task:** Create a new GET endpoint (e.g., `/scenes/`) in `tesseract/router.py` that calls the (now implemented) `crud.get_all_tesseract_scenes` function and returns a list of scene metadata. Define a suitable response model.
    *   **Rationale:** Provides a way for the frontend or other services to retrieve available Tesseract scenes. Depends on Work Item 6.1.
*   **Work Item 7.3 (P1): Implement `/mapdata` Aggregation Logic**
    *   **Finding:** `backend/app/main.py` (Line 65): `# TODO: Replace with actual data fetching and aggregation logic` within the `/mapdata` endpoint. Currently returns dummy data.
    *   **Task:** Define the structure of the required map data. Implement logic to fetch data from relevant sources (e.g., Neo4j via CRUD functions for Djinn objects, Ghost signals, Tesseract scene locations) and aggregate it into the defined structure.
    *   **Rationale:** Provides the core data needed for the frontend map visualization. Requires defining the specific data needs of the map.
*   **Work Item 7.4 (P2): Link Kappa Document to User**
    *   **Finding:**
        *   `backend/app/kappa/router.py` (Line 62): `# owner_id=current_user.id # TODO: Link to user if needed`.
        *   `backend/app/kappa/router.py` (Line 71): `# TODO: Pass owner_id=current_user.id if linking users`.
    *   **Task:**
        1.  Modify the `DocumentCreate` schema and the `Document` node model in Neo4j to include an `owner_id` (or similar relationship to a `User` node).
        2.  Uncomment the relevant lines in `kappa/router.py` to pass the `current_user.id` to `crud.create_document`.
        3.  Update `crud.create_document` to store the owner information.
        4.  Consider implications for search and retrieval (e.g., filtering documents by owner).
    *   **Rationale:** Adds ownership information to documents, enabling features like user-specific document lists or access control.
*   **Work Item 7.5 (P2): Implement Kappa Search Pagination Parameters**
    *   **Finding:** `backend/app/kappa/router.py` (Line 99): `# TODO: Add limit/skip parameters to SearchQuery schema and pass them here for pagination`.
    *   **Task:**
        1.  Add optional `limit: int | None = None` and `skip: int | None = 0` fields to the `SearchQuery` schema used in the `/documents/search` endpoint.
        2.  Update the `crud.search_documents` function to accept `limit` and `skip` parameters and incorporate them into the Cypher query (using `SKIP` and `LIMIT` clauses).
        3.  Pass the `limit` and `skip` values from the request query parameters to the `crud.search_documents` call in the router.
    *   **Rationale:** Enables pagination for Kappa search results, improving performance and usability for large datasets.
*   **Work Item 7.6 (P2): Add Ghost Query Parameters for Filtering**
    *   **Finding:** `backend/app/ghost/router.py` (Line 92): `# TODO: Add query parameters for filtering (e.g., time range, location, frequency)` for the GET `/signal-events/` endpoint.
    *   **Task:**
        1.  Define optional query parameters in the GET `/signal-events/` endpoint function signature (e.g., `start_time: datetime | None = None`, `end_time: datetime | None = None`, `bbox: str | None = None`, `min_freq: float | None = None`, `max_freq: float | None = None`). Use FastAPI's `Query` for validation.
        2.  Update the `crud.get_signal_events` function (Work Item 6.2) to accept these filtering parameters.
        3.  Implement the logic within `crud.get_signal_events` to add appropriate `WHERE` clauses to the Cypher query based on the provided parameters.
    *   **Rationale:** Allows clients to retrieve specific subsets of signal events based on various criteria.
*   **Work Item 7.7 (P2): Add Djinn Geospatial Data Handling (Upload)**
    *   **Finding:**
        *   `backend/app/djinn/router.py` (Line 29): `# TODO: Add optional Form fields for source location (lat, lon) if available during upload`.
        *   `backend/app/djinn/router.py` (Line 60): `# TODO: Add source_location if provided in request`.
    *   **Task:**
        1.  Add optional `source_latitude: float = Form(None)` and `source_longitude: float = Form(None)` parameters to the `/images/upload` endpoint function.
        2.  If provided, package these into a `source_location` dictionary or object.
        3.  Pass the `source_location` to the `crud.create_image` function.
    *   **Rationale:** Allows associating uploaded images with a geographical location at the time of upload.
*   **Work Item 7.8 (P1): Add Djinn Geospatial Data Handling (CRUD)**
    *   **Finding:**
        *   `backend/app/djinn/crud.py` (Line 41): `// TODO: Add source_location property if provided` (Cypher query comment).
        *   `backend/app/djinn/crud.py` (Line 55): `# TODO: Add source_location parameter if provided`.
    *   **Task:**
        1.  Modify the `ImageCreate` schema (if not already done) and the `Image` node model to store location data (e.g., using Neo4j's Point type).
        2.  Update the `create_image` function signature in `crud.py` to accept an optional `source_location` parameter.
        3.  Modify the Cypher query within `create_image` to set the location property on the `Image` node if `source_location` is provided.
    *   **Rationale:** Enables persistence of geospatial information for Djinn images in the database. Prerequisite for geospatial querying.
*   **Work Item 7.9 (P3): Add Protected Endpoint Example**
    *   **Finding:** `backend/app/auth/router.py` (Line 208): `# TODO: Add protected endpoint example`.
    *   **Task:** Create a simple example endpoint (e.g., GET `/protected-data`) that uses the `get_current_active_user` dependency to ensure only authenticated users can access it. Return some basic user-specific data or a success message.
    *   **Rationale:** Provides a clear example for developers on how to secure new endpoints using the existing authentication mechanism.
*   **Work Item 7.10 (P3): Add Tesseract Dependencies Placeholder**
    *   **Finding:** `backend/pyproject.toml` (Line 27): `# TODO: Add Tesseract dependencies...`
    *   **Task:** Re-evaluate if specific dependencies are known now. If so, add them (see 7.1). If not, refine the TODO to be more specific about *what kind* of processing is intended, or remove if Tesseract plans have changed.
    *   **Rationale:** Cleans up or clarifies the dependency placeholder.

*Note: Several `TODO`s related to router integration (`Integrate ... router into main.py`) and implementing specific logic (`Implement object detection logic`, `Implement endpoint to get detection results`, `Implement CRUD operations`) appear to be at least partially completed based on the findings document. These are omitted here but should be verified during implementation.*

## 8. Technical Debt Reduction: Frontend `TODO` Resolution

**Theme:** Address specific `TODO` comments identified in the frontend codebase.

*   **Work Item 8.1 (P1): Fetch Tesseract Scene Metadata**
    *   **Finding:** `frontend/pages/tesseract.tsx` (Line 12): `// TODO: Fetch scene metadata (including sceneDataUri) based on sceneId`.
    *   **Task:** Implement data fetching logic (e.g., using `useEffect` and `axios`) to call a backend endpoint (potentially the one created in Work Item 7.2 or a specific `/scenes/{sceneId}` endpoint if created in 6.1) to retrieve the metadata for the scene specified by `sceneId`. Store this data in component state. Use the `sceneDataUri` for the viewer component.
    *   **Rationale:** Enables the Tesseract page to load and display specific scene data based on routing or selection.
*   **Work Item 8.2 (P3): Refine Map Cursor Styles**
    *   **Finding:** `frontend/components/map/SharedMapComponent.tsx`:
        *   Line 308: `// TODO: Reset map cursor style` (after measurement).
        *   Line 350: `// TODO: Change map cursor style` (during measurement).
    *   **Task:** Implement the logic to change the map container's CSS `cursor` style (e.g., to `crosshair` or `grabbing`) when measurement tools are active, and reset it to the default (`grab` or `pointer`) when they are deactivated or the measurement is complete.
    *   **Rationale:** Improves user experience by providing visual feedback during map interactions like measurement. Minor UI refinement.
*   **Work Item 8.3 (P2): Implement Isochrone Logic Placeholder**
    *   **Finding:** `frontend/components/map/SharedMapComponent.tsx` (Line 371): `// TODO: Implement isochrone logic (Phase 4 - Placeholder)`.
    *   **Task:** Plan and implement the isochrone feature. This likely involves:
        1.  Adding UI elements to trigger isochrone calculation (e.g., button, context menu).
        2.  Calling a backend endpoint (needs to be created) or a third-party service (e.g., Mapbox Isochrone API, Valhalla) with parameters like location, travel mode, and time/distance contours.
        3.  Parsing the response (likely GeoJSON polygons).
        4.  Displaying the isochrone polygons on the map using MapLibre GL JS layers.
    *   **Rationale:** Implements a planned map feature. Marked as Phase 4, indicating lower initial priority but requires significant effort.
*   **Work Item 8.4 (P3): Handle Djinn Filter Side Effects**
    *   **Finding:** `frontend/pages/djinn.tsx`:
        *   Line 706: `// TODO: Trigger side effects based on the finalState if needed`.
        *   Line 719: `// TODO: Trigger side effects (filtering) based on 'id' and new 'value'`.
    *   **Task:** Analyze the `useReducer` logic for filters. Determine what side effects are needed when filter state changes (e.g., re-fetching data from the backend with updated filter parameters, updating map markers). Implement these side effects, likely within a `useEffect` hook that depends on the filter state.
    *   **Rationale:** Ensures that changes in the filter UI actually trigger data updates or map view changes.

## 9. Code Organization (Frontend)

**Theme:** Improve code structure and maintainability by organizing shared types.

*   **Work Item 9.1 (P2): Centralize Shared Map Component Types**
    *   **Finding:** `frontend/components/map/SharedMapComponent.tsx` (Line 44) has `// TODO: Move these interfaces to a shared types file (e.g., frontend/types/map.ts)`. Interfaces `Detection` (Lines 45-51) and `VisOptions` (Lines 53-56) are defined inline.
    *   **Task:**
        1.  Create a new file `frontend/types/map.ts` (or similar appropriate location).
        2.  Move the `Detection` and `VisOptions` interface definitions from `SharedMapComponent.tsx` to `map.ts`.
        3.  Export the interfaces from `map.ts`.
        4.  Import the interfaces into `SharedMapComponent.tsx` from `frontend/types/map.ts`.
    *   **Rationale:** Improves code organization, promotes reusability of types, and makes `SharedMapComponent.tsx` shorter and more focused on component logic.

## 10. Testing Strategy & Implementation

**Theme:** Establish a testing foundation for both backend and frontend to improve code quality and prevent regressions.

*   **Work Item 10.1 (P2): Set Up Backend Test Structure and Initial Tests**
    *   **Finding:** No `tests/` directory or test files found in `backend/`. Testing dependencies (`pytest`, `httpx`) are present in `pyproject.toml`.
    *   **Task:**
        1.  Create a `backend/tests/` directory.
        2.  Configure `pytest` (e.g., via `pyproject.toml` or `pytest.ini`) if needed.
        3.  Write initial integration tests for core API endpoints using `httpx` and `TestClient` from FastAPI. Focus on testing the implemented CRUD operations (after completion of Section 6) and authentication endpoints.
        4.  Write unit tests for critical utility functions (e.g., in `core.storage` once implemented).
    *   **Rationale:** Establishes a testing framework and provides initial test coverage for critical backend functionality.
*   **Work Item 10.2 (P2): Set Up Frontend Test Structure and Initial Tests**
    *   **Finding:** No test files (`*.test.tsx`) found in `frontend/`. Standard testing libraries (`@testing-library/react`, `jest`) are not listed in `package.json` (though `eslint` and `typescript` are).
    *   **Task:**
        1.  Add necessary testing dependencies (`jest`, `@testing-library/react`, `@testing-library/jest-dom`, etc.) to `frontend/package.json`.
        2.  Configure Jest (e.g., via `jest.config.js`) for a Next.js project.
        3.  Create `__tests__` directories within component/page folders or a top-level `tests/` directory.
        4.  Write initial unit/integration tests for key components (e.g., `SharedMapComponent`, `AuthContext`, upload forms) using React Testing Library. Mock API calls using `jest.mock`.
    *   **Rationale:** Establishes a testing framework for the frontend, enabling component testing and reducing the risk of UI regressions.

## 11. Documentation & Logging Enhancements

**Theme:** Improve code understanding and maintainability through better documentation and potentially more structured logging.

*   **Work Item 11.1 (P3): Review and Enhance Backend Docstrings**
    *   **Finding:** Docstrings exist but are sometimes placeholder descriptions in `djinn`, `ghost`, and `tesseract` CRUD modules.
    *   **Task:** Review all functions in backend modules (`crud.py`, `router.py`, `services`, `core`). Ensure docstrings accurately reflect the implemented logic (especially after Section 6 is complete), explain parameters, return values, and any raised exceptions. Follow a consistent docstring format (e.g., Google style, reStructuredText).
    *   **Rationale:** Improves code readability and maintainability, making it easier for developers to understand function purposes.
*   **Work Item 11.2 (P3): Standardize Frontend Logging**
    *   **Finding:** `console.log/error/warn` used directly, sometimes wrapped in a simple `logger` object.
    *   **Task:** Evaluate the need for a more robust frontend logging solution (e.g., a dedicated logging library like `pino` or `loglevel`) or standardize the usage of the simple `logger` wrapper. Ensure consistent log levels are used (debug, info, warn, error). Consider removing excessive debug logs before production builds.
    *   **Rationale:** Improves consistency and control over frontend logging, potentially allowing easier filtering or forwarding of logs in production.

## 12. Suggested Roadmap / Phasing

This roadmap suggests a logical sequence for tackling the work items, prioritizing stability, core functionality, and then enhancements.

**Phase 0: Stabilize & Secure (P0 Focus)**

*   **Goal:** Address critical risks and immediate blockers.
*   **Items:**
    *   Section 1: Dependency Management (Frontend) - All Items (1.1 - 1.8)
    *   Section 5: Error Handling & Robustness - All Items (5.1 - 5.4) - *Requires Storage Utility Delete Function*
    *   Section 4: Core Backend Infrastructure: Storage Utility - Item 4.1 (Create `storage.py`, implement `delete_from_storage`)

**Phase 1: Core Backend Infrastructure Completion (P0/P1 Focus)**

*   **Goal:** Implement the essential storage utility and integrate it.
*   **Items:**
    *   Section 4: Core Backend Infrastructure: Storage Utility - Items 4.2 - 4.5 (Integrate `upload_to_storage`)
    *   Section 3: Security Enhancements - Items 3.1, 3.2 (Implement Auth Tokens in Frontend Uploads)

**Phase 2: Core Feature Implementation - Backend CRUD (P1 Focus)**

*   **Goal:** Implement the core database logic for all modules.
*   **Items:**
    *   Section 6: Feature Completion: Backend CRUD Implementation - Items 6.1, 6.2, 6.3 (Implement Tesseract, Ghost, Djinn CRUD)
    *   Section 7: Technical Debt Reduction: Backend `TODO` Resolution - Item 7.8 (Add Djinn Geospatial CRUD) - *Do concurrently with 6.3*
    *   Section 7: Technical Debt Reduction: Backend `TODO` Resolution - Item 7.2 (Implement Tesseract Scene List Endpoint) - *Depends on 6.1*

**Phase 3: Feature Refinement & Frontend Integration (P1/P2 Focus)**

*   **Goal:** Connect frontend features, implement remaining core backend logic, and address key enhancements.
*   **Items:**
    *   Section 8: Technical Debt Reduction: Frontend `TODO` Resolution - Item 8.1 (Fetch Tesseract Scene Metadata) - *Depends on 7.2*
    *   Section 7: Technical Debt Reduction: Backend `TODO` Resolution - Item 7.3 (Implement `/mapdata` Aggregation Logic)
    *   Section 6: Feature Completion: Backend CRUD Implementation - Items 6.4, 6.5 (Kappa Count & Optional CRUD)
    *   Section 7: Technical Debt Reduction: Backend `TODO` Resolution - Items 7.4, 7.5, 7.6, 7.7 (Kappa User Link, Kappa Pagination, Ghost Filtering, Djinn Upload Location)
    *   Section 3: Security Enhancements - Item 3.3 (Djinn Permission Check)
    *   Section 2: Configuration Management - Items 2.1, 2.2 (Externalize Config)
    *   Section 9: Code Organization (Frontend) - Item 9.1 (Centralize Map Types)

**Phase 4: Testing, Documentation & Lower Priority Tasks (P2/P3 Focus)**

*   **Goal:** Establish testing practices, improve documentation, and address remaining lower-priority items.
*   **Items:**
    *   Section 10: Testing Strategy & Implementation - Items 10.1, 10.2 (Setup Backend & Frontend Testing)
    *   Section 11: Documentation & Logging Enhancements - Items 11.1, 11.2 (Review Docstrings, Standardize Logging)
    *   Section 8: Technical Debt Reduction: Frontend `TODO` Resolution - Items 8.2, 8.3, 8.4 (Map Cursor, Isochrone Placeholder, Djinn Filter Side Effects)
    *   Section 7: Technical Debt Reduction: Backend `TODO` Resolution - Items 7.1, 7.9, 7.10 (Tesseract Deps, Protected Endpoint Example, Dep Placeholder Cleanup)

---
**End of Plan**