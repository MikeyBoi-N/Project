# Phase 1: Kappa Service (Text Document MVP)

## 1. Introduction

This document outlines the implementation plan for the Minimum Viable Product (MVP) of the Kappa Service during Phase 1. The focus for this initial phase is on core text document handling: enabling authenticated users to upload text-based documents, storing them appropriately, and providing basic search and retrieval capabilities. This establishes the foundation for more advanced NLP features planned for Kappa in later phases.

## 2. Data Model (Neo4j & MinIO)

*   **Neo4j Node**: `:Document`
    *   **Properties**:
        *   `doc_id`: String (Unique identifier, e.g., UUID generated during upload)
        *   `filename`: String (Original filename provided during upload)
        *   `content_type`: String (MIME type of the uploaded file, e.g., `text/plain`, `application/pdf`)
        *   `size`: Integer (File size in bytes)
        *   `upload_timestamp`: Datetime (Timestamp of when the document was uploaded)
        *   `object_store_key`: String (The unique key used to store the file in MinIO, typically same as `doc_id`)
        *   *(Optional future properties: `extracted_text_preview`, `language`, `geospatial_data`)*
*   **Neo4j Relationship**: `(:User)-[:UPLOADED]->(:Document)`
    *   Connects the authenticated user who uploaded the document to the corresponding `:Document` node.
    *   Can store properties like the timestamp of the upload action if needed separately from the node's timestamp.
*   **MinIO Object**:
    *   Stored in the configured bucket (e.g., `selkie-data`).
    *   Object name/key will be the `object_store_key` (e.g., the UUID `doc_id`) from the Neo4j `:Document` node.
    *   Stores the raw binary content of the uploaded document.

## 3. API Endpoints (`app/api/v1/endpoints/kappa.py`)

An `APIRouter` will be defined for Kappa endpoints, mounted under the `/kappa` prefix. All endpoints will require authentication (using the dependency defined in the Auth service plan).

*   **Document Upload**:
    *   **Endpoint**: `POST /documents/upload`
    *   **Request**: Takes `file: UploadFile = File(...)` as input. Requires authenticated user context (`Depends(get_current_user)`).
    *   **Response**: `schemas.DocumentMetadata` (containing metadata of the uploaded document).
    *   **Logic**:
        1.  Generate a unique ID (`doc_id`/`object_store_key`).
        2.  Upload the file content (`file.read()`) to MinIO using the generated key.
        3.  Create the `:Document` node in Neo4j with extracted metadata (filename, content_type, size, timestamp, object_store_key).
        4.  Create the `[:UPLOADED]` relationship between the authenticated user and the new `:Document` node.
        5.  Return the metadata of the created document.
*   **Document Search (Basic)**:
    *   **Endpoint**: `GET /documents/search`
    *   **Request**: Takes query parameter `q: str`. Requires authenticated user context.
    *   **Response**: `List[schemas.DocumentMetadata]`
    *   **Logic**: Performs a basic search query against Neo4j `:Document` nodes accessible by the user (MVP might just search all documents). The initial search will likely target the `filename` property using a `CONTAINS` clause in Cypher. Returns a list of matching document metadata.
*   **Document Retrieval**:
    *   **Endpoint**: `GET /documents/{doc_id}`
    *   **Request**: Takes path parameter `doc_id: str`. Requires authenticated user context.
    *   **Response**: `schemas.Document` (including metadata and content) or potentially stream the file content directly (`StreamingResponse`). Returning a schema with content is simpler for MVP.
    *   **Logic**:
        1.  Retrieve the `:Document` node metadata from Neo4j using `doc_id`. Handle "Not Found" errors.
        2.  Verify user has permission to access this document (if ownership/permissions are implemented beyond basic auth).
        3.  Fetch the corresponding file content from MinIO using the `object_store_key`.
        4.  Return the document metadata along with its content.

## 4. Schemas (`app/schemas/document.py`)

*   `DocumentBase`: Base schema with common document properties.
*   `DocumentMetadata(DocumentBase)`: Schema representing document metadata, used for search results and upload responses (excludes raw content). Includes fields like `doc_id`, `filename`, `content_type`, `size`, `upload_timestamp`.
*   `Document(DocumentMetadata)`: Schema representing a full document, including its content (e.g., `content: bytes` or `content: str` depending on how it's handled). Used for the retrieval endpoint response.

## 5. Core Logic (`app/crud/document.py` or `app/services/kappa_service.py`)

Functions implementing the business logic for document operations:

*   `upload_document(tx: AsyncManagedTransaction, minio_client, user: schemas.User, file: UploadFile)`: Handles the logic described for the upload endpoint (generating ID, MinIO upload, Neo4j node/relationship creation).
*   `search_documents(tx: AsyncManagedTransaction, user: schemas.User, query: str)`: Executes the basic Cypher search query against Neo4j and returns a list of metadata dictionaries or schema objects.
*   `get_document_by_id(tx: AsyncManagedTransaction, minio_client, user: schemas.User, doc_id: str)`: Retrieves metadata from Neo4j, fetches content from MinIO, performs permission checks (if applicable), and returns the combined data.

## 6. Integration Points

*   **Authentication**: All Kappa endpoints will depend on the `get_current_user` dependency to ensure only authenticated users can interact with documents.
*   **Database**: Core logic functions will require the `AsyncManagedTransaction` provided by the `get_db_transaction` dependency.
*   **Object Storage**: Core logic functions will need access to the initialized MinIO client instance.
*   **API Router**: The Kappa `APIRouter` needs to be included in the main FastAPI application (`app/main.py`).

## 7. Future Enhancements (Post-MVP)

*   Implement full-text search indexing in Neo4j for more powerful content searching.
*   Integrate NLP libraries (spaCy, Transformers) for text extraction (from PDFs, DOCX), entity recognition, summarization.
*   Integrate with Google Gemini for advanced Q&A and analysis.
*   Add support for storing and querying geospatial metadata associated with documents.
*   Implement more granular access control/permissions.
*   Support for other document types and sources (web pages, etc.).