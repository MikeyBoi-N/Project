# Phase 4: Ghost MVP

*   **Detailed Description:** This phase introduces the Ghost (Signal Processing) service MVP. The initial focus is *not* on complex signal processing but on ingesting signal *metadata* and potentially associated recordings, storing this information, and visualizing relevant geospatial aspects (like estimated source locations) on the `Shared Map Component`. This involves creating the Ghost backend service, defining schemas for signal metadata, implementing ingestion logic (metadata to Neo4j, optional recordings to MinIO), and extending the API Gateway and frontend map to display signal-related information. Real-time processing or deep SDR integration is deferred. The Ghost router must be integrated into the main FastAPI app.
*   **Checklist:**
    *   [ ] Create Ghost service module structure (`backend/app/ghost/`).
    *   [ ] Add basic DSP/numerical library dependencies if needed (SciPy, NumPy) to backend (`backend/pyproject.toml`).
    *   [ ] Define API schemas (`schemas.py`) for signal metadata ingestion and retrieval within Ghost module.
    *   [ ] Implement signal metadata ingestion endpoint in Ghost service (`router.py`):
        *   [ ] Accepts signal metadata (e.g., timestamp, frequency, bandwidth, *estimated source location*, recording filename).
        *   [ ] *Optional:* Accepts signal recording uploads.
        *   [ ] *Optional:* Stores recording binary in MinIO.
        *   [ ] Creates signal event node and metadata properties (including *location*) in Neo4j.
        *   [ ] *Optional:* Links signal node to its recording location in Neo4j.
    *   [ ] Implement basic CRUD operations (`crud.py`) for Ghost entities (signal events) in Neo4j.
    *   [ ] Create API endpoint in Ghost service (`router.py`) to retrieve signal event data (including locations).
    *   [ ] Integrate Ghost router into the main FastAPI application (`backend/app/main.py`).
    *   [ ] Update API Gateway to route requests to Ghost and potentially aggregate Ghost map data.
    *   [ ] Update `SharedMapComponent` in frontend to:
        *   [ ] Fetch signal event location data from the API Gateway.
        *   [ ] Display signal events/sources as markers/icons on the map, potentially styled by type or frequency.
    *   [ ] Update frontend UI (or create admin interface) to allow signal metadata submission (and optional recording upload).