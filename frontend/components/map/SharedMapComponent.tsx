import React, { useState, useEffect, MutableRefObject } from 'react'; // Added MutableRefObject
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import { MapContainer, TileLayer, Marker, Popup, Polygon, CircleMarker, Tooltip } from 'react-leaflet'; // Added CircleMarker, Tooltip
import L, { Map, LatLngExpression } from 'leaflet'; // Added Map type and LatLngExpression
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { StyleOption } from './LayersMenu'; // Import StyleOption type
import FilterButtons from './FilterButtons'; // Import the new filter buttons
import SearchBar from './SearchBar'; // Import the search bar
import ContextWindowPlaceholder from './ContextWindowPlaceholder'; // Import the placeholder
import styles from '../../styles/MapPage.module.css'; // Import CSS module for styling
// Fix for default marker icon issue
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl.src,
    iconUrl: iconUrl.src,
    shadowUrl: shadowUrl.src,
});

// --- Interfaces (Keep existing MapMarkerData, MapFootprintData) ---
interface MapMarkerData {
    id: string;
    position: [number, number];
    popupContent: string;
    source?: 'kappa' | 'djinn' | 'ghost' | 'tesseract' | 'test';
}

interface MapFootprintData {
    type: "Feature";
    properties: {
        scene_id: string;
        name?: string;
        source: 'tesseract';
        [key: string]: any;
    };
    geometry: {
        type: "Polygon";
        coordinates: number[][][];
    };
}

// --- New Interfaces for Detections ---
// TODO: Move these interfaces to a shared types file (e.g., frontend/types/map.ts)
interface Detection {
    id: number; // Changed from string to number to match djinn.tsx
    location: LatLngExpression; // [lat, lng]
    class: string;
    confidence: number;
    // Add other relevant fields if needed
}

interface VisOptions {
    colorByClass: boolean;
    showConfidence: boolean;
}


// --- Props Interface ---
interface SharedMapComponentProps {
    tileLayerInfo: StyleOption; // Receive selected style info from parent
    mapRef: MutableRefObject<Map | null>; // Receive ref from parent
    detections: Detection[]; // Receive filtered detections
    visOptions: VisOptions; // Receive visualization options
}

// --- Helper Functions (Keep existing getIconForSource) ---
// Removed getIconForSource as we are using CircleMarker now

// --- Helper for Colors ---
const CLASS_COLORS: { [key: string]: string } = {
    car: 'blue',
    person: 'red',
    truck: 'green',
    bicycle: 'orange',
    // Add more classes and colors as needed
};
const DEFAULT_COLOR = 'grey';

function getDetectionColor(detection: Detection, options: VisOptions): string {
    if (options.colorByClass) {
        return CLASS_COLORS[detection.class.toLowerCase()] || DEFAULT_COLOR;
    }
    return DEFAULT_COLOR;
}

// --- Component ---
const defaultCenter: [number, number] = [51.505, -0.09];
const defaultZoom = 13;

const SharedMapComponent: React.FC<SharedMapComponentProps> = ({ tileLayerInfo, mapRef, detections, visOptions }) => {
    // Removed marker state, isLoading, error - data now comes via props
    const [footprints, setFootprints] = useState<MapFootprintData[]>([]);
    // Keep isLoading/error state ONLY if footprints still need fetching internally
    const [isFootprintLoading, setIsFootprintLoading] = useState<boolean>(false);
    const [footprintError, setFootprintError] = useState<string | null>(null);

    const { isGuest } = useAuth(); // Get guest status
    const guestViewportKey = 'guestMapViewport'; // Key for center/zoom
    const guestStyleKey = 'guestMapStyleId'; // Key for style ID

    // Effect to load map VIEWPORT state for guests from sessionStorage
    useEffect(() => {
        if (isGuest && mapRef.current) {
            const savedViewportRaw = sessionStorage.getItem(guestViewportKey);
            if (savedViewportRaw) {
                try {
                    const savedViewport = JSON.parse(savedViewportRaw);
                    if (savedViewport.center && savedViewport.zoom) {
                        mapRef.current.setView(savedViewport.center, savedViewport.zoom);
                        logger.debug('Restored guest map viewport from sessionStorage:', savedViewport);
                    }
                    // Style is loaded elsewhere (e.g., LayersMenu or parent page)
                } catch (e) {
                    logger.error('Failed to parse guest map viewport from sessionStorage', e);
                    sessionStorage.removeItem(guestViewportKey); // Clear corrupted data
                }
            }
        }
        // Dependency array includes mapRef.current to re-run if the map initializes later,
        // and isGuest to run when guest status is confirmed.
    }, [isGuest, mapRef.current]);

    // Effect to save map VIEWPORT state for guests to sessionStorage
    useEffect(() => {
        const map = mapRef.current;
        if (isGuest && map) {
            const saveViewportState = () => {
                const center = map.getCenter();
                const zoom = map.getZoom();
                const viewportToSave = {
                    center: { lat: center.lat, lng: center.lng },
                    zoom: zoom,
                };
                try {
                    sessionStorage.setItem(guestViewportKey, JSON.stringify(viewportToSave));
                    logger.debug('Saved guest map viewport to sessionStorage:', viewportToSave);
                } catch (e) {
                    logger.error('Failed to save guest map viewport to sessionStorage', e);
                }
            };

            map.on('moveend', saveViewportState);
            map.on('zoomend', saveViewportState);

            // Cleanup listeners
            return () => {
                map.off('moveend', saveViewportState);
                map.off('zoomend', saveViewportState);
            };
        } else if (!isGuest) {
             // If user logs in, clear guest state
             sessionStorage.removeItem(guestViewportKey);
             sessionStorage.removeItem(guestStyleKey); // Also clear style key
        }
        // Dependencies: Run when guest status changes or map instance is ready
    }, [isGuest, mapRef.current]);

    // Effect to save map STYLE state for guests to sessionStorage
    useEffect(() => {
        // Only save if guest and tileLayerInfo.id is valid
        if (isGuest && tileLayerInfo?.id) {
            try {
                sessionStorage.setItem(guestStyleKey, tileLayerInfo.id);
                logger.debug('Saved guest map style ID to sessionStorage:', tileLayerInfo.id);
            } catch (e) {
                logger.error('Failed to save guest map style ID to sessionStorage', e);
            }
        }
        // Dependencies: Run when guest status changes or the tileLayerInfo prop changes
    }, [isGuest, tileLayerInfo]);

    // Data fetching logic - MODIFIED to only fetch footprints if needed
    // If footprints also come via props, this useEffect can be removed entirely.
    // Assuming footprints are still fetched internally for now.
    useEffect(() => {
        const fetchFootprintData = async () => {
            setIsFootprintLoading(true);
            setFootprintError(null);
            // setMarkers([]); // Markers come from props now
            setFootprints([]);
            try {
                // Assuming the same endpoint provides footprints, adjust if necessary
                const response = await axios.get('/api/mapdata');

                // Process Footprints ONLY
                if (response.data?.footprints) {
                    const fetchedFootprints: MapFootprintData[] = response.data.footprints.filter(
                        (f: any) => f.type === "Feature" && f.geometry?.type === "Polygon" && Array.isArray(f.geometry.coordinates)
                    );
                    setFootprints(fetchedFootprints);
                    logger.debug(`Successfully fetched ${fetchedFootprints.length} footprints.`);
                } else {
                     logger.warn("No footprint data found in response.");
                     setFootprints([]);
                }

                 if (!response.data?.footprints) {
                      logger.warn("No footprint data found in response.");
                 }

            } catch (err: any) {
                logger.error('Failed to fetch footprint data:', err);
                setFootprintError(err.message || 'Could not load footprint data.');
            } finally {
                setIsFootprintLoading(false);
            }
        };

        // Only fetch if needed (e.g., if footprints aren't passed as props)
        fetchFootprintData();
    }, []); // Dependency array might need adjustment if fetching depends on other props/state

    // REMOVED: Internal theme state (isDarkMode) and toggle button

    return (
        <div style={{ flexGrow: 1, position: 'relative', width: '100%', height: '100%' }}>
             {typeof window !== 'undefined' && (
                <MapContainer
                    center={defaultCenter}
                    zoom={defaultZoom}
                    scrollWheelZoom={true}
                    zoomControl={false} // Keep default controls disabled
                    style={{ height: '100%', width: '100%' }}
                    // Assign the map instance using the ref prop
                    ref={mapRef}
                >
                    {/* Opening tag fixed */}
                    {/* Use the TileLayer info passed via props */}
                    <TileLayer
                        key={tileLayerInfo.url} // Add key to force re-render on URL change
                        attribution={tileLayerInfo.attribution}
                        url={tileLayerInfo.url}
                    />

                    {/* Loading/error indicators for footprints */}
                    {isFootprintLoading && <p>Loading footprint data...</p>}
                    {footprintError && <p style={{ color: 'red' }}>Footprint Error: {footprintError}</p>}

                    {/* Render Detections from Props */}
                    {detections.map((detection) => {
                        const color = getDetectionColor(detection, visOptions);
                        return (
                            <CircleMarker
                                key={detection.id}
                                center={detection.location}
                                pathOptions={{ color: color, fillColor: color, fillOpacity: 0.6 }} // Example styling
                                radius={8} // Example radius
                            >
                                {visOptions.showConfidence && (
                                    <Tooltip>
                                        Confidence: {detection.confidence.toFixed(2)} <br />
                                        Class: {detection.class}
                                    </Tooltip>
                                )}
                                {/* Add a Popup here later if needed for more details */}
                            </CircleMarker>
                        );
                    })}

                    {/* Keep footprint rendering, but use isFootprintLoading */}
                    {!isFootprintLoading && footprints.map((footprint) => {
                        const positions = footprint.geometry.coordinates[0].map(coord => [coord[1], coord[0]] as [number, number]);
                        const sceneId = footprint.properties.scene_id;
                        const name = footprint.properties.name || `Scene ${sceneId}`;

                        return (
                            <Polygon key={sceneId} pathOptions={{ color: 'purple' }} positions={positions}>
                                <Popup>
                                    Tesseract Footprint: {name} <br />
                                    Scene ID: {sceneId}
                                </Popup>
                            </Polygon>
                        );
                    })}
                </MapContainer>
            )}
            {/* New Overlay Container for Controls */}
            <div className={styles.mapControlsOverlay}>
            </div>
        </div>
    );
};

// Keep logger instance
const logger = {
    error: (...args: any[]) => console.error(...args),
    debug: (...args: any[]) => console.log(...args),
    warn: (...args: any[]) => console.warn(...args),
};

export default SharedMapComponent;