# Phase 2.5: Shared Map Component MVP

*   **Detailed Description:** This intermediate phase introduces the core `Shared Map Component` into the frontend. The primary goal is to establish the basic map visualization infrastructure using Leaflet and React-Leaflet, integrated within the Next.js application. It needs to connect to the API Gateway to fetch and display simple geospatial data. Initially, this could be test data or basic location metadata extracted from Kappa documents (if available and implemented in Phase 2). This phase lays the groundwork for visualizing outputs from Djinn, Ghost, and Tesseract in later stages.
*   **Checklist:**
    *   [ ] Install Leaflet and React-Leaflet dependencies in the frontend project (`frontend`).
    *   [ ] Create a dedicated `SharedMapComponent` React component (`frontend/components/map/SharedMapComponent.tsx` or similar).
    *   [ ] Integrate the `SharedMapComponent` into a relevant frontend page (e.g., `frontend/pages/map.tsx`).
    *   [ ] Implement basic map initialization (setting view, zoom level, base layer).
    *   [ ] Define API endpoint(s) in the API Gateway (FastAPI) specifically for fetching map data (initially simple points).
    *   [ ] Implement backend logic (potentially within API Gateway or a dedicated small service/module) to fetch initial map data (e.g., test points, or query Kappa data in Neo4j for documents with locations).
    *   [ ] Implement frontend logic within `SharedMapComponent` to:
        *   [ ] Fetch map data from the API Gateway endpoint.
        *   [ ] Display fetched data as simple markers (e.g., `L.Marker`) on the Leaflet map.
    *   [ ] Ensure map component is interactive (pan, zoom).