# Phase 5: Tesseract MVP

*   **Detailed Description:** This phase introduces the Tesseract (4D Visualization) service MVP. The initial goal is to ingest *pre-processed* Gaussian Splatting data representing a 3D scene, store references to this data, display a static version in a dedicated frontend viewer, and critically, display the 2D geographic footprint of this 3D scene on the `Shared Map Component`. This involves creating the Tesseract backend service, defining schemas for scene metadata, implementing ingestion logic (metadata/footprint to Neo4j, scene data files to MinIO), integrating a basic 3D viewer library (like Three.js) into the frontend, and extending the API Gateway and map component to display the `Tesseract Footprint`. Real-time reconstruction is out of scope for the MVP. The Tesseract router must be integrated into the main FastAPI app.
*   **Checklist:**
    *   [ ] Create Tesseract service module structure (`backend/app/tesseract/`).
    *   [ ] Add 3D/Gaussian Splatting related library dependencies if needed (or define data formats) to backend (`backend/pyproject.toml`).
    *   [ ] Define API schemas (`schemas.py`) for Tesseract scene ingestion (metadata, footprint) and retrieval within Tesseract module.
    *   [ ] Implement Tesseract scene ingestion endpoint in Tesseract service (`router.py`):
        *   [ ] Accepts scene metadata (e.g., timestamp, description, *Tesseract Footprint geometry*).
        *   [ ] Accepts pre-processed scene data file uploads (e.g., `.splat` files).
        *   [ ] Stores scene data file(s) in MinIO.
        *   [ ] Creates Tesseract scene node in Neo4j.
        *   [ ] Stores metadata and *Tesseract Footprint* (e.g., as GeoJSON Polygon/WKT) as properties on the node.
        *   [ ] Links scene node to its data file location(s) in Neo4j.
    *   [ ] Create API endpoint in Tesseract service (`router.py`) to retrieve scene metadata (including footprint) and data file location(s).
    *   [ ] Integrate Tesseract router into the main FastAPI application (`backend/app/main.py`).
    *   [ ] Update API Gateway to route requests to Tesseract and potentially aggregate Tesseract footprint data for the map.
    *   [ ] Integrate a basic 3D viewer library (e.g., Three.js or a dedicated splat viewer) into the frontend.
    *   [ ] Create a dedicated `TesseractViewer` component/page in the frontend (`frontend/components/tesseract/TesseractViewer.tsx` or similar).
    *   [ ] Implement frontend logic to fetch scene data (via API GW -> Tesseract service) and load/display it in the `TesseractViewer`.
    *   [ ] Update `SharedMapComponent` in frontend to:
        *   [ ] Fetch `Tesseract Footprint` geometry data from the API Gateway.
        *   [ ] Display footprints as polygons on the map (e.g., using `L.Polygon`).
        *   [ ] *Optional:* Implement interaction where clicking a footprint on the map links to/opens the corresponding `TesseractViewer`.
    *   [ ] Update frontend UI (or create admin interface) to allow Tesseract scene submission.