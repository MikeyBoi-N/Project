# Phase 3: Djinn MVP

*   **Detailed Description:** This phase introduces the Djinn (Computer Vision) service MVP. The focus is on ingesting images, performing basic object detection using a pre-trained model, storing the results, and visualizing these results on the `Shared Map Component`. This involves creating the Djinn backend service, integrating CV libraries (like OpenCV, PyTorch/TensorFlow), implementing image ingestion (storing binaries in MinIO, metadata in Neo4j), running object detection, storing detected object metadata (class, bounding box, confidence) and *location* in Neo4j (linked to the source image), and crucially, extending the API Gateway and frontend map component to display these detected object locations. The Djinn router must be integrated into the main FastAPI app.
*   **Checklist:**
    *   [ ] Create Djinn service module structure (`backend/app/djinn/`).
    *   [ ] Add CV library dependencies (OpenCV, PyTorch/TensorFlow, Pillow) to backend (`backend/pyproject.toml`).
    *   [ ] Define API schemas (`schemas.py`) for image ingestion and object detection results within Djinn module.
    *   [ ] Implement image ingestion endpoint in Djinn service (`router.py`):
        *   [ ] Accepts image uploads.
        *   [ ] Stores image binary in MinIO.
        *   [ ] Extracts/receives metadata (filename, timestamp, *source location if available*).
        *   [ ] Creates image node and metadata properties in Neo4j.
        *   [ ] Links image node to its binary location in Neo4j.
    *   [ ] Implement object detection logic within Djinn service:
        *   [ ] Load a pre-trained object detection model.
        *   [ ] Process ingested images using the model.
        *   [ ] Extract results (object class, bounding box, confidence score).
        *   [ ] *Crucial:* Determine/associate a geospatial location for each detected object (this might come from image metadata or be inferred).
    *   [ ] Implement logic to store detection results in Neo4j:
        *   [ ] Create nodes for detected objects.
        *   [ ] Store object metadata (class, confidence, bounding box) as properties.
        *   [ ] Store object *geospatial location* as property (e.g., Point).
        *   [ ] Create relationships linking detected objects back to the source image node.
    *   [ ] Create API endpoint in Djinn service (`router.py`) to retrieve detected object data (including locations).
    *   [ ] Integrate Djinn router into the main FastAPI application (`backend/app/main.py`).
    *   [ ] Update API Gateway to route requests to Djinn and potentially aggregate Djinn map data.
    *   [ ] Update `SharedMapComponent` in frontend to:
        *   [ ] Fetch detected object location data from the API Gateway.
        *   [ ] Display detected objects as markers/icons on the map, potentially filterable or styled by class.
    *   [ ] Update frontend UI to allow image upload to the Djinn service.