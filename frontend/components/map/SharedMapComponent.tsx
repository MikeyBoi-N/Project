import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet'; // Added Polygon
import L from 'leaflet';
import axios from 'axios'; // Import axios for API calls
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS

// Fix for default marker icon issue with webpack/Next.js
// (See: https://github.com/PaulLeCam/react-leaflet/issues/808)
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Explicitly set the default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl; // Type assertion needed
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl.src,
    iconUrl: iconUrl.src,
    shadowUrl: shadowUrl.src,
});
// Function to get a specific icon based on the source
// TODO: Define custom icons for different sources (Kappa, Djinn, Ghost, etc.)
function getIconForSource(source?: MapMarkerData['source']): L.Icon {
    // Example: Return different icons based on source
    // if (source === 'djinn') return djinnIcon;
    // if (source === 'kappa') return kappaIcon;
    // For now, return the default icon for all sources
    // Create a new Icon instance with explicit options to satisfy TypeScript
    return new L.Icon({
        iconUrl: iconUrl.src,
        iconRetinaUrl: iconRetinaUrl.src,
        shadowUrl: shadowUrl.src,
        iconSize: [25, 41], // Default size
        iconAnchor: [12, 41], // Default anchor
        popupAnchor: [1, -34], // Default popup anchor
        shadowSize: [41, 41] // Default shadow size
    });
}


// Define a type for the marker data we expect
// TODO: Refine this based on actual data from API GW (Kappa, Djinn, Ghost, Tesseract Footprints)
interface MapMarkerData {
    id: string;
    position: [number, number]; // [latitude, longitude]
    popupContent: string;
    source?: 'kappa' | 'djinn' | 'ghost' | 'tesseract' | 'test'; // Optional source identifier
}

// Define a type for the footprint data (GeoJSON Feature structure)
// Note: Leaflet's Polygon expects coordinates as [lat, lon], while GeoJSON uses [lon, lat].
// We'll need to swap them when rendering.
interface MapFootprintData {
    type: "Feature";
    properties: {
        scene_id: string;
        name?: string;
        source: 'tesseract'; // Expecting footprints only from Tesseract for now
        [key: string]: any; // Allow other properties
    };
    geometry: {
        type: "Polygon";
        coordinates: number[][][]; // [[[lon, lat], [lon, lat], ...]]
    };
}

// Example initial center and zoom
const defaultCenter: [number, number] = [51.505, -0.09]; // London coordinates
const defaultZoom = 13;

const SharedMapComponent: React.FC = () => {
    const [markers, setMarkers] = useState<MapMarkerData[]>([]);
    const [footprints, setFootprints] = useState<MapFootprintData[]>([]); // State for footprints
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // TODO: Implement data fetching logic
    useEffect(() => {
        const fetchMapData = async () => {
            setIsLoading(true);
            setError(null);
            setMarkers([]); // Clear previous markers
            setFootprints([]); // Clear previous footprints
            try {
                // Fetch data from the backend API endpoint
                // Assuming Next.js proxy routes /api/* to the backend (e.g., localhost:8000)
                const response = await axios.get('/api/mapdata'); // Use relative path for proxy

                // Process Markers
                if (response.data?.markers) {
                    const fetchedMarkers: MapMarkerData[] = response.data.markers.map((m: any) => ({
                        id: m.id,
                        position: m.position,
                        popupContent: m.popupContent,
                        source: m.source,
                    }));
                    setMarkers(fetchedMarkers);
                    logger.debug(`Successfully fetched ${fetchedMarkers.length} markers.`);
                } else {
                    logger.warn("No marker data found in response.");
                    setMarkers([]); // Ensure markers are cleared if none are fetched
                }

                // Process Footprints
                if (response.data?.footprints) {
                    // Basic validation - could be more robust
                    const fetchedFootprints: MapFootprintData[] = response.data.footprints.filter(
                        (f: any) => f.type === "Feature" && f.geometry?.type === "Polygon" && Array.isArray(f.geometry.coordinates)
                    );
                    setFootprints(fetchedFootprints);
                    logger.debug(`Successfully fetched ${fetchedFootprints.length} footprints.`);
                } else {
                     logger.warn("No footprint data found in response.");
                     setFootprints([]); // Ensure footprints are cleared if none are fetched
                }

                if (!response.data?.markers && !response.data?.footprints) {
                     throw new Error("Invalid or empty data format received from /api/mapdata");
                }

            } catch (err: any) {
                logger.error('Failed to fetch map data:', err);
                setError(err.message || 'Could not load map data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMapData();
    }, []); // Empty dependency array means this runs once on mount

    // Note: MapContainer needs a defined height/width via CSS to be visible.
    // Ensure the parent container or a CSS rule provides this.
    // Example: style={{ height: '500px', width: '100%' }}

    // State for theme
    const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

    return (
        // This component now expects its parent (.pageContent) to manage layout.
        // We use a React Fragment <> or a div that grows to fill the space.
        // Let's use a div that grows to ensure it fills the flex container.
        <div style={{ flexGrow: 1, position: 'relative', width: '100%', height: '100%' }}>
             {/* Check if window is defined for SSR safety, although MapContainer handles much of this */}
            {typeof window !== 'undefined' && (
                <MapContainer
                    center={defaultCenter}
                    zoom={defaultZoom}
                    scrollWheelZoom={true}
                    zoomControl={false} // Disable default Leaflet zoom controls
                    style={{ height: '100%', width: '100%' }} // Map fills the container div
                >
                    {/* Conditionally render TileLayer based on theme */}
                    {isDarkMode ? (
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />
                    ) : (
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    )}

                    {isLoading && <p>Loading map data...</p>}
                    {error && <p style={{ color: 'red' }}>Error: {error}</p>}

                    {!isLoading && markers.map((marker) => (
                        <Marker
                            key={marker.id}
                            position={marker.position}
                            icon={getIconForSource(marker.source)} // Use custom icon based on source
                        >
                            <Popup>
                                {marker.popupContent} <br />
                                <small>Source: {marker.source || 'Unknown'}</small>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Render Tesseract Footprints */}
                    {!isLoading && footprints.map((footprint) => {
                        // IMPORTANT: Swap GeoJSON [lon, lat] to Leaflet [lat, lon]
                        const positions = footprint.geometry.coordinates[0].map(coord => [coord[1], coord[0]] as [number, number]);
                        const sceneId = footprint.properties.scene_id;
                        const name = footprint.properties.name || `Scene ${sceneId}`;

                        return (
                            <Polygon key={sceneId} pathOptions={{ color: 'purple' }} positions={positions}>
                                <Popup>
                                    Tesseract Footprint: {name} <br />
                                    Scene ID: {sceneId}
                                    {/* TODO: Add link to Tesseract 3D viewer */}
                                </Popup>
                            </Polygon>
                        );
                    })}
                </MapContainer>
            )}
            {/* Theme Toggle Button - Positioned absolutely */}
            <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                style={{
                    position: 'absolute',
                    bottom: '80px', // Position above default zoom placeholders for now
                    right: '10px',
                    zIndex: 1000, // Ensure it's above map layers
                    padding: '8px 12px',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                }}
            >
                {isDarkMode ? 'Light' : 'Dark'} Mode
            </button>
        </div>
    );
};

// Add logger instance if needed
const logger = {
    error: (...args: any[]) => console.error(...args),
    debug: (...args: any[]) => console.log(...args),
    warn: (...args: any[]) => console.warn(...args),
};


export default SharedMapComponent;