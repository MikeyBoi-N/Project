# Djinn Map Sidebar Feature Research Summary

**Date:** 2025-04-04

**Objective:** Research and evaluate potential sidebar features for the Djinn map interface within the Selkie project, focusing on interaction with YOLO object detections visualized on a Leaflet map.

**Context:**
*   **Map Library:** Leaflet / React-Leaflet (`selkie_architecture.md`)
*   **CV Engine:** Djinn, using YOLO (v5, v7, v8, World) for object detection in EO/SAR imagery (`djinn.tsx`, `phase_3_djinn.md`).
*   **Core Data Output:** Geolocated detections including object class, bounding box, confidence score (`phase_3_djinn.md`).
*   **Phase 3 MVP Goal:** Visualize detected object locations on the shared Leaflet map (`selkie_architecture.md`, `phase_3_djinn.md`).

**Conclusion:** The sidebar should prioritize features enabling users to filter, explore, and perform basic analysis on the visualized YOLO detections, directly supporting the Phase 3 MVP goals. Advanced ML integrations represent significant post-MVP efforts.

---

## Feature Evaluation & Prioritization

Features are categorized based on alignment with the Phase 3 MVP, technical feasibility (Frontend/Backend focus), and availability of free libraries compatible with Leaflet/React.

### High Priority (Core MVP Support)

These features directly support interacting with the initial YOLO detection visualizations.

1.  **Object Class Filtering:**
    *   **Description:** Allow users to show/hide detections based on their predicted class.
    *   **Implementation:** Frontend state management filters the detection data array. UI uses checkboxes or a multi-select component.
    *   **Libraries:** Standard React UI components.
    *   **Feasibility:** High (Frontend).
2.  **Confidence Score Threshold:**
    *   **Description:** Filter detections based on a minimum confidence score using a slider or input.
    *   **Implementation:** Frontend state filters detections based on the `confidence` property.
    *   **Libraries:** UI component library slider/input.
    *   **Feasibility:** High (Frontend).
3.  **Bounding Box Visualization Options:**
    *   **Description:** Customize how detection bounding boxes (or markers at locations) appear on the map (e.g., color by class, show confidence label).
    *   **Implementation:** Frontend logic using Leaflet's styling API (`L.circleMarker`, `L.polygon`, `L.divIcon`) to dynamically style map features.
    *   **Libraries:** `react-leaflet` API.
    *   **Feasibility:** Medium (Frontend - requires map layer interaction).
4.  **Displaying Metadata:**
    *   **Description:** Show detection details (class, confidence, exact coordinates) in a popup or panel on click/hover.
    *   **Implementation:** Frontend uses Leaflet event listeners (`onEachFeature` or direct layer events) to trigger display.
    *   **Libraries:** `react-leaflet` event handling.
    *   **Feasibility:** High (Frontend).
5.  **Geographic Filtering:**
    *   **Description:** Allow users to draw a rectangle or polygon on the map to filter detections within that area.
    *   **Implementation:** Integrate drawing tools; use Turf.js to perform spatial query (`booleanPointInPolygon`).
    *   **Libraries:** `react-leaflet`, `leaflet-draw` (or `react-leaflet-draw`), `@turf/turf`.
    *   **Feasibility:** High (Frontend).
6.  **Object Counting:**
    *   **Description:** Display a count of currently visible/filtered detections.
    *   **Implementation:** Frontend calculates count based on the filtered data array.
    *   **Libraries:** None specific.
    *   **Feasibility:** High (Frontend).

### Medium Priority (Useful Enhancements)

These features add value but are not strictly required for the core MVP visualization.

7.  **Search Functionality (Classes):**
    *   **Description:** Input field to quickly find and filter the list of available object classes for selection.
    *   **Implementation:** Frontend UI filtering on the class list.
    *   **Libraries:** Standard React UI components.
    *   **Feasibility:** High (Frontend).
8.  **Saving/Loading Filters:**
    *   **Description:** Allow users to save their current filter settings (classes, confidence) and reload them later.
    *   **Implementation:** Frontend uses browser `localStorage` to persist filter state.
    *   **Libraries:** None specific.
    *   **Feasibility:** High (Frontend).
9.  **Density Mapping (Heatmaps):**
    *   **Description:** Visualize the spatial density of detected objects using a heatmap layer.
    *   **Implementation:** Integrate a Leaflet-compatible heatmap library.
    *   **Libraries:** `leaflet.heat` (via `react-leaflet-heatmap` or direct integration), `heatmap.js`.
    *   **Feasibility:** High (Frontend).
10. **Image Chips/Cropped Views:**
    *   **Description:** Display a cropped view of the original image corresponding to the selected detection's bounding box.
    *   **Implementation:** Requires coordination. Frontend requests crop from backend; backend uses CV library to extract and return image chip.
    *   **Libraries:** Frontend: React image display. Backend: Python Pillow/OpenCV.
    *   **Feasibility:** Medium (Frontend + Backend).
11. **Export Functionality:**
    *   **Description:** Export the currently filtered detection data (class, confidence, coordinates) as CSV or GeoJSON.
    *   **Implementation:** Frontend formats data and triggers browser download.
    *   **Libraries:** `papaparse` (for CSV).
    *   **Feasibility:** Medium (Frontend).

### Lower Priority (Post-MVP / Significant R&D)

These features involve more complex interactions, backend persistence, or advanced ML capabilities beyond the Phase 3 scope.

12. **Annotation Tools:**
    *   **Description:** Allow users to manually add, edit, or delete object annotations (bounding boxes) on the map or image chips.
    *   **Implementation:** Requires drawing tools (`leaflet-draw`), complex state management, and backend API/DB integration to persist annotations.
    *   **Libraries:** `leaflet-draw`, potentially `react-image-annotate` (for chips), Backend API/DB.
    *   **Feasibility:** Medium-High (Frontend + Backend - Persistence is key).
13. **Date/Time Filtering:**
    *   **Description:** Filter detections based on timestamp.
    *   **Implementation:** Requires temporal metadata associated with detections/imagery. UI requires date pickers. Filtering logic likely backend.
    *   **Libraries:** Date picker UI component.
    *   **Feasibility:** Medium (Depends on data availability).
14. **Filtering by Size/Aspect Ratio:**
    *   **Description:** Filter detections based on bounding box dimensions.
    *   **Implementation:** Frontend calculation from bounding box data.
    *   **Libraries:** None specific.
    *   **Feasibility:** Medium (Frontend - Lower priority).
15. **Advanced Analysis & Integration:**
    *   **Description:** Includes Change Detection, Integration with Other Models (Segmentation, Tracking), Similarity Search, Anomaly Detection.
    *   **Implementation:** Primarily significant backend ML development, leveraging libraries like OpenCV, PyTorch/TensorFlow, MMDetection, Detectron2, Faiss, etc. Requires careful model selection (free pre-trained options from Hugging Face, PyTorch Hub), potential fine-tuning, and robust backend infrastructure. Addresses challenges like SAR data nuances and open-set recognition mentioned in `phase_3_djinn.md`.
    *   **Feasibility:** Low (Represents major R&D efforts beyond Phase 3).

---

## Recommended Libraries (Leaflet Focus)

*   **Mapping Core:** `react-leaflet`, `leaflet`
*   **Drawing/Interaction:** `leaflet-draw` (or `react-leaflet-draw` wrapper)
*   **Spatial Analysis:** `@turf/turf` (for geographic filtering)
*   **Heatmaps:** `leaflet.heat` (via `react-leaflet-heatmap` or direct integration), `heatmap.js`
*   **CSV Export:** `papaparse`
---

## Next Steps

*   Confirm prioritization aligns with project goals.
*   Begin implementation of High Priority features, focusing on frontend integration with the Leaflet map component and backend API for fetching detection data.
*   Plan backend support for features like Image Chips if prioritized.