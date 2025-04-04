# YOLO Object Detection Implementation Summary (Djinn Service)

**Date:** 2025-04-04

## 1. Goal

The primary goal of this task was to implement core object detection functionality within the Selkie platform's Djinn service. Specifically, the objective was to allow users to trigger YOLO-based object detection on the imagery currently visible within the map view (when satellite imagery is displayed) and visualize the results as markers on the map, including class labels and confidence scores.

## 2. Research & Design Decisions

### 2.1. Initial Research
*   **YOLO Outputs:** Research confirmed standard YOLOv8 outputs (post-NMS) include bounding boxes (e.g., `[x1, y1, x2, y2]` pixel coordinates), a combined confidence score (objectness * class probability), and a class label/ID.
*   **Segment Anything Model (SAM):** Explored the potential synergy of using SAM (prompted by YOLO bounding boxes) to generate precise pixel-level segmentation masks. While powerful for detailed analysis, it was decided to implement core YOLO detection first due to the added complexity and computational cost of SAM. SAM integration remains a potential future enhancement.

### 2.2. Implementation Approach: Map View Detection
The requirement to detect objects *within the current map view* presented a challenge in getting the relevant image pixels to the backend Djinn service. Two approaches were considered:

*   **Option A (Frontend Snapshot - Chosen):** The frontend captures the current Leaflet map container as a PNG image using the `leaflet-image` library. This image data (base64 encoded) and the corresponding geographic bounds are sent to the backend API.
    *   *Pros:* Simpler initial backend implementation.
    *   *Cons:* Requires frontend library, network overhead for image transfer, potential resolution limits based on screen capture.
*   **Option B (Backend Tile Fetching):** The frontend sends only geographic bounds and zoom level. The backend calculates required map tiles, fetches them, stitches them, and performs detection.
    *   *Pros:* No large image upload, potentially higher resolution.
    *   *Cons:* Significantly more complex backend logic (tile math, fetching, stitching), dependency on tile server specifics.

**Decision:** Option A (Frontend Snapshot) was chosen for this initial implementation due to its relative simplicity.

### 2.3. Coordinate Conversion
A crucial step is converting the pixel coordinates of detected bounding boxes (relative to the captured image) back into geographic coordinates (Latitude, Longitude) for map display. A linear interpolation approach was adopted based on the image dimensions and the known geographic bounds of the captured view.

## 3. Backend Implementation (`Djinn_Service`)

### 3.1. Dependencies & Structure
*   **Dependencies Added (`backend/pyproject.toml`):**
    *   `ultralytics`: The official library for running YOLO models (v8+).
    *   `opencv-python-headless`: For image processing (decoding, manipulation) without GUI dependencies.
    *   `python-multipart`: Standard FastAPI requirement for potential future file handling.
*   **Folder Structure (`backend/app/services/djinn/`):**
    *   `inference/`: Created to hold core model inference logic.
    *   `utils/`: Created to hold helper functions.
*   **Docker:** Verified `backend/Dockerfile` includes `poetry install` to install new dependencies.

### 3.2. Core Inference Logic (`inference/detection.py`)
*   **Model Loading:** Loads a pre-trained YOLO model (`yolov8n.pt`) once when the module is imported to optimize performance. Includes error handling.
*   **`run_yolo_detection` Function:**
    *   Input: NumPy array (BGR image).
    *   Process: Runs `model.predict()` on the image.
    *   Output: Returns a list of dictionaries, each containing raw detection results: `{ 'bbox_pixels': [x1, y1, x2, y2], 'confidence': float, 'class_id': int, 'class_name': str }`.

### 3.3. Utility Functions (`utils/image_processing.py`)
*   **`decode_base64_image` Function:**
    *   Input: Base64 image string (handles data URI prefix).
    *   Process: Decodes base64, uses `cv2.imdecode` to create a NumPy array.
    *   Output: NumPy array (BGR) or `None` on error.
*   **`convert_pixel_to_geo` Function:**
    *   Input: Pixel coordinates (`px`, `py`), image dimensions (`img_width`, `img_height`), geographic bounds dictionary (`bounds`).
    *   Process: Extracts corner coordinates from bounds, performs linear interpolation.
    *   Output: `(latitude, longitude)` tuple.

### 3.4. API Endpoint (`api/routes/djinn.py`)
*   **Route:** `POST /api/djinn/detect_map_view` defined.
*   **Request Model (`schemas/djinn.py`):** `DjinnMapViewRequest` expects `image_data: str` and `bounds: Dict`.
*   **Response Model (`schemas/djinn.py`):** `DjinnDetectionResponse` returns a list of `DjinnDetectionResult` objects (`{ id: str, class_name: str, confidence: float, location: GeoLocation }`).
*   **Logic (`detect_objects_in_map_view` function):**
    1.  Receives request data.
    2.  Calls `decode_base64_image`. Raises HTTPException on failure.
    3.  Gets image dimensions.
    4.  Calls `run_yolo_detection`.
    5.  Iterates through raw detections:
        *   Calculates center pixel coordinates from `bbox_pixels`.
        *   Calls `convert_pixel_to_geo` using center pixels, image dimensions, and request bounds.
        *   Generates a UUID for the detection `id`.
        *   Formats the result according to `DjinnDetectionResult`.
    6.  Returns `DjinnDetectionResponse` containing the list of formatted detections.

## 4. Frontend Implementation (`DjinnPage` - `pages/djinn.tsx`)

### 4.1. Dependencies & Setup
*   **Dependency Added:** `leaflet-image` installed via npm.
*   **Type Definitions:** Added `frontend/types/leaflet-image.d.ts` for TypeScript support.
*   **Map Instance:** Logic added (using `useState` and `onMapLoad` prop in `SharedMapComponent`) to get and store a reference to the Leaflet map instance.

### 4.2. Trigger & API Call
*   **UI:** A `<button>` ("Detect Objects in View") was added to the page.
*   **State:** `useState` hooks added for `yoloDetections` (results array), `isLoadingDetections` (boolean), and `detectionError` (string/null).
*   **`handleDetectObjectsClick` Function:**
    1.  Sets loading state.
    2.  Uses `leafletImage()` to capture the map view as a canvas.
    3.  Gets base64 PNG data from the canvas (`canvas.toDataURL`).
    4.  Gets current map bounds (`mapInstance.getBounds()`) and formats them.
    5.  Sends a `fetch` POST request to `/api/djinn/detect_map_view` with `image_data` and `bounds`.
    6.  On success, parses the JSON response and updates the `yoloDetections` state.
    7.  Handles errors and updates loading/error states.
*   **Button Styling:** The button was initially styled using an existing class (`styles.mapControl`) and later updated with a custom class (`styles.detectButton` defined in `MapPage.module.css`) with specific styles (semi-transparent background, rounded corners, etc.).
*   **Button Positioning:** The button was positioned between the SearchBar and Context Window Placeholder elements.

### 4.3. Displaying Results (`SharedMapComponent.tsx`)
*   The `yoloDetections` state array from `djinn.tsx` is passed as the `detections` prop to `SharedMapComponent`.
*   `SharedMapComponent` iterates through the `detections` prop and renders a `<CircleMarker>` for each detection at its `location`.
*   Markers are styled based on the `visOptions` prop (color by class) and include a `<Tooltip>` showing class name and confidence score (if `showConfidence` is enabled).

## 5. Debugging & Refinements

*   **Duplicate Controls:** An issue where map overlay controls (SearchBar, etc.) appeared twice was traced to them being rendered incorrectly within `SharedMapComponent.tsx` *in addition* to `djinn.tsx`. The duplicates were removed from `SharedMapComponent.tsx`.
*   **Button Styling:** Iteratively refined the "Detect Objects" button style based on feedback.

## 6. Key Considerations & Limitations

*   **Coordinate Conversion Accuracy:** The current pixel-to-geo conversion uses linear interpolation. This is an approximation and may have inaccuracies, especially at lower zoom levels or across large geographic areas where map projection distortions are more significant. More sophisticated projection libraries (like `proj4js` or backend GIS libraries) could improve accuracy if needed.
*   **Frontend Capture Performance:** Capturing the map view using `leaflet-image` can be slow, especially for large/complex views. It also relies on the browser's rendering.
*   **Resolution:** The resolution of the captured image sent to the backend is limited by the screen display, which might affect the detection quality of small objects compared to processing original high-resolution imagery.
*   **Error Handling:** Basic error handling is in place, but could be made more robust (e.g., more specific error messages, user feedback).
*   **Scalability:** The current approach processes the entire captured view on each click. For very large views or frequent updates, performance might degrade.

## 7. Potential Future Enhancements

*   **SAM Integration:** Implement the YOLO+SAM pipeline for precise segmentation masks.
*   **Backend Tile Processing:** Switch to Option B (Backend Tile Fetching) for potentially better resolution and performance, removing the need for `leaflet-image`.
*   **Asynchronous Processing:** For large images or complex models, use background tasks (e.g., Celery) on the backend to avoid blocking API responses.
*   **Model Selection:** Allow users to choose different YOLO models (e.g., size variants, fine-tuned models).
*   **Advanced Filtering:** Implement Size/Aspect Ratio filters (requires backend to return `width`/`height`).
*   **Map Button Integration:** Connect the existing map filter buttons (Aircraft, etc.) to control the `selectedClasses` state in `djinn.tsx`.