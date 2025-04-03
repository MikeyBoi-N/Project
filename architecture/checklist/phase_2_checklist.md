# Phase 2: Kappa MVP

*   **Detailed Description:** This phase focuses on implementing the Minimum Viable Product (MVP) for the Kappa (NLP) service. The goal is to enable the ingestion of text documents, store them appropriately, perform basic keyword searches, and display results in the frontend. This involves creating the Kappa backend service module, defining its API endpoints, implementing logic to store document binaries in MinIO and metadata/relationships in Neo4j, creating a basic keyword search capability leveraging Neo4j, and updating the frontend to interact with these new endpoints via the API Gateway. Crucially, the Kappa service router needs to be integrated into the main FastAPI application. Basic identity management features (linking documents/metadata to users or concepts) should also be considered.
*   **Checklist:**
    *   [ ] Create Kappa service module structure (`backend/app/kappa/`).
    *   [ ] Define API schemas (`schemas.py`) for document ingestion and search results within Kappa module.
    *   [ ] Implement document ingestion endpoint in Kappa service (`router.py`):
        *   [ ] Accepts document uploads.
        *   [ ] Stores document binary in MinIO Object Storage.
        *   [ ] Extracts/receives basic metadata (e.g., filename, timestamp, potentially geospatial info if available).
        *   [ ] Creates document node and metadata properties in Neo4j.
        *   [ ] Creates relationship in Neo4j linking document node to its binary location (e.g., MinIO URI/ID).
        *   [ ] *Optional:* Implement basic identity linking (e.g., associating document with uploading user).
    *   [ ] Implement basic keyword search endpoint in Kappa service (`router.py`):
        *   [ ] Accepts search query.
        *   [ ] Performs keyword search against document metadata/content index in Neo4j.
        *   [ ] Returns list of matching documents (metadata).
    *   [ ] Implement basic CRUD operations (`crud.py`) for Kappa entities (documents) in Neo4j.
    *   [ ] Integrate Kappa router into the main FastAPI application (`backend/app/main.py`).
    *   [ ] Update API Gateway logic (if necessary) to route requests to the Kappa service.
    *   [ ] Create frontend component(s) for:
        *   [ ] Document upload interface.
        *   [ ] Search input interface.
        *   [ ] Displaying search results (list of documents).
    *   [ ] Connect frontend components to Kappa API endpoints via the API Gateway.