# Djinn Leaflet Map Search Implementation Plan

## 1. Objective & Constraints

*   **Objective:** Implement multi-type search (Coordinates, Internal Djinn Data, Geocoding) for the existing Leaflet map using the existing search bar UI element.
*   **Constraints:**
    *   Use Leaflet.js.
    *   Integrate with the existing HTML search bar.
    *   **Strictly no external CSS or style modifications.**
    *   Use Nominatim (free OSM geocoder) via a suitable library.
    *   Search internal Djinn data assumed to be present as client-side Leaflet layers.
    *   Display results for all matching types (coordinates, internal, geocoding) simultaneously.
    *   Keep all components free (no paid API keys).

## 2. Recommended Libraries

*   **Leaflet:** Core map library (already in use).
*   **Leaflet Control Geocoder:** ([https://github.com/perliedman/leaflet-control-geocoder](https://github.com/perliedman/leaflet-control-geocoder))
    *   Use this library *programmatically* for its Nominatim geocoding capabilities.
    *   **Important:** Include the library's JavaScript file (`Control.Geocoder.js`) but **DO NOT** include its CSS file (`Control.Geocoder.css`) to comply with the no-CSS constraint.

## 3. Implementation Logic Flow

The core logic will reside within an event listener attached to the existing search input (e.g., listening for 'submit' on a form wrapping the input, or 'change'/'keydown' on the input itself).

```javascript
// --- Attach listener to your search input/form ---
const searchInput = document.getElementById('your-search-input-id'); // Or querySelector
searchInput.addEventListener('change', handleSearch); // Or 'submit' if it's a form

// --- Global variables to store results/markers ---
let currentSearchMarker = null;
let highlightedLayers = []; // To store { layer: layerRef, originalStyle: style }

// --- Main search handler function ---
async function handleSearch(event) {
    const searchTerm = event.target.value.trim();
    if (!searchTerm) {
        clearSearchResults(); // Clear map if input is empty
        return;
    }

    // --- Step 1: Attempt Coordinate Parse ---
    const coordMatch = searchTerm.match(/^\s*(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)\s*$/);
    if (coordMatch) {
        const lat = parseFloat(coordMatch[1]);
        const lon = parseFloat(coordMatch[2]);
        if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
            clearSearchResults();
            map.flyTo([lat, lon], 15); // Adjust zoom level as needed
            currentSearchMarker = L.marker([lat, lon]).addTo(map)
                .bindPopup(`Coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)}`)
                .openPopup();
            return; // Stop processing if coordinates found
        }
    }

    // --- If not coordinates, proceed with other searches ---
    clearSearchResults(); // Clear previous non-coord results before new search

    // --- Step 2: Perform Internal Data Search (Client-Side) ---
    const internalResults = searchInternalLayers(searchTerm);

    // --- Step 3: Perform Geocoding Search (Nominatim) ---
    // Note: Geocoding is async. Display logic is called from its callback.
    performGeocoding(searchTerm, internalResults);
}

// --- Helper: Clear previous results ---
function clearSearchResults() {
    if (currentSearchMarker) {
        map.removeLayer(currentSearchMarker);
        currentSearchMarker = null;
    }
    highlightedLayers.forEach(item => {
        try {
            item.layer.setStyle(item.originalStyle); // Revert style
        } catch (e) { console.error("Error reverting style:", e); }
    });
    highlightedLayers = [];
    // Close any open popups if desired
    map.closePopup();
}

// --- Step 2 Implementation ---
function searchInternalLayers(term) {
    const matches = [];
    const lowerCaseTerm = term.toLowerCase();
    // Replace 'yourLayerGroup' with the actual Leaflet layer group containing Djinn data
    yourLayerGroup.eachLayer(layer => {
        let found = false;
        // --- Adapt property checking based on your data structure ---
        if (layer.feature && layer.feature.properties) { // Example for GeoJSON
            for (const key in layer.feature.properties) {
                const value = layer.feature.properties[key];
                if (typeof value === 'string' && value.toLowerCase().includes(lowerCaseTerm)) {
                    found = true; break;
                }
            }
        } else if (layer.options && layer.options.title) { // Example for layers with titles
             if (layer.options.title.toLowerCase().includes(lowerCaseTerm)) {
                 found = true;
             }
        }
        // Add other checks as needed for your specific layer data...

        if (found) {
            matches.push({
                layer: layer,
                name: (layer.feature?.properties?.name || layer.options?.title || 'Internal Match'), // Get a display name
                location: layer.getLatLng ? layer.getLatLng() : layer.getBounds() // Get location
            });
        }
    });
    return matches;
}

// --- Step 3 Implementation ---
function performGeocoding(term, internalResults) {
    const geocoder = L.Control.Geocoder.nominatim(); // Ensure L.Control.Geocoder is loaded
    geocoder.geocode(term, function(geocodingResults) {
        // --- Step 4: Display Combined Results (called from async callback) ---
        displayCombinedResults(internalResults, geocodingResults || []);
    });
}

// --- Step 4 Implementation ---
function displayCombinedResults(internalMatches, geocodingMatches) {
    const allBounds = [];

    // Display Internal Matches
    internalMatches.forEach(match => {
        try {
            const originalStyle = JSON.parse(JSON.stringify(match.layer.options.style || L.Path.prototype.options)); // Deep copy original style
            highlightedLayers.push({ layer: match.layer, originalStyle: originalStyle });
            match.layer.setStyle({ color: 'yellow', weight: 5, fillColor: 'yellow', fillOpacity: 0.4 }); // Example highlight
            if (match.layer.bindPopup) { // Add popup if possible
                 match.layer.bindPopup(`Internal: ${match.name}`).openPopup();
            }
            if (match.location instanceof L.LatLng) {
                allBounds.push(match.location);
            } else if (match.location instanceof L.LatLngBounds) {
                allBounds.push(match.location);
            }
        } catch (e) { console.error("Error processing internal match:", e); }
    });

    // Display Top Geocoding Match
    if (geocodingMatches.length > 0) {
        const topResult = geocodingMatches[0];
        currentSearchMarker = L.marker(topResult.center).addTo(map)
            .bindPopup(`Location: ${topResult.name}`)
            .openPopup();
        allBounds.push(topResult.bbox instanceof L.LatLngBounds ? topResult.bbox : topResult.center);
    }

    // Adjust Map View
    if (allBounds.length > 0) {
        if (allBounds.length === 1 && allBounds[0] instanceof L.LatLng) {
             // If only one point result (internal or geocoding), zoom closer
             map.flyTo(allBounds[0], 15);
        } else {
             // Fit map to combined bounds of all results
             const combinedBounds = L.latLngBounds(allBounds);
             map.flyToBounds(combinedBounds.pad(0.1)); // Add padding
        }
    } else {
        // Optional: Display a "No results found" message somewhere
        console.log("No results found for the search term.");
    }
}

```

## 4. Result Display Strategy

*   **Coordinates:** Map pans/zooms directly to the point, single marker added.
*   **Internal Data:** Matched layers are highlighted (e.g., yellow outline/fill). Original style is stored and reverted on the next search or clear. Popups are opened on matched layers.
*   **Geocoding:** A single marker is added for the top result from Nominatim. Popup shows the location name.
*   **Combined Results:** Map view adjusts (`flyToBounds`) to encompass all found internal items (using their bounds or LatLng) and the geocoding result's bounding box (`bbox`) or center point. Highlights and markers are applied as above.
*   **Clearing:** Before a new search (or coordinate navigation) or when the input is cleared, previous markers are removed, and highlighted layers have their styles reverted.

## 5. Next Steps

*   Integrate the `leaflet-control-geocoder` JavaScript library.
*   Adapt the pseudocode into the Djinn application's JavaScript/TypeScript codebase, replacing placeholders like `your-search-input-id` and `yourLayerGroup` with actual IDs and variable names.
*   Refine the internal data search logic (`searchInternalLayers`) based on the exact structure of Djinn's map layers and data properties.
*   Test thoroughly with various search terms (coordinates, place names, internal data names, mixed cases, empty input).