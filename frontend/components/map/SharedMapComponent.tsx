import React, { useState, useEffect, useRef, useCallback, MutableRefObject } from 'react'; // Added useState, useRef, useCallback
import { toast } from 'react-toastify'; // Import toast for notifications
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import { MapContainer, TileLayer, Marker, Popup, Polygon, CircleMarker, Tooltip } from 'react-leaflet'; // Added CircleMarker, Tooltip
import L, { Map, LatLngExpression, LatLng, LeafletMouseEvent, Polyline } from 'leaflet'; // Added LatLng, LeafletMouseEvent, Polyline
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { StyleOption } from './LayersMenu'; // Import StyleOption type
import FilterButtons from './FilterButtons'; // Import the new filter buttons
import SearchBar from './SearchBar'; // Import the search bar
import ContextWindowPlaceholder from './ContextWindowPlaceholder'; // Import the placeholder
import styles from '../../styles/MapPage.module.css'; // Import CSS module for styling
import MapContextMenu from './MapContextMenu'; // Import the context menu component
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

    // --- Context Menu State ---
    const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ top: 0, left: 0 });
    const [contextMenuLatLng, setContextMenuLatLng] = useState<LatLng | null>(null);

    // --- Measurement State ---
    const [isMeasuring, setIsMeasuring] = useState(false);
    const [measurementPoints, setMeasurementPoints] = useState<LatLng[]>([]);
    const [measurementLayer, setMeasurementLayer] = useState<Polyline | null>(null);
    const [currentDistance, setCurrentDistance] = useState<number>(0);

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

    // --- Context Menu Logic ---
    const handleCloseContextMenu = useCallback(() => {
        setIsContextMenuVisible(false);
        setContextMenuLatLng(null);
    }, []);

    // Effect to handle map context menu event and clicks outside the menu
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        const handleContextMenu = (e: LeafletMouseEvent) => {
            e.originalEvent.preventDefault(); // Prevent default browser menu
            setContextMenuPosition({ top: e.containerPoint.y, left: e.containerPoint.x });
            setContextMenuLatLng(e.latlng);
            setIsContextMenuVisible(true);
            logger.debug(`Context menu opened at: ${e.latlng}, position:`, e.containerPoint);
        };

        const handleClick = (e: LeafletMouseEvent) => {
            // Close context menu if open
            if (isContextMenuVisible) {
                handleCloseContextMenu();
                return; // Don't process measurement click if context menu was just closed
            }

            // Handle measurement clicks
            if (isMeasuring) {
                const newPoint = e.latlng;
                const updatedPoints = [...measurementPoints, newPoint];
                setMeasurementPoints(updatedPoints);

                let distance = 0;
                for (let i = 1; i < updatedPoints.length; i++) {
                    distance += updatedPoints[i-1].distanceTo(updatedPoints[i]);
                }
                setCurrentDistance(distance);
                const distanceKm = (distance / 1000).toFixed(2);

                if (measurementLayer) {
                    measurementLayer.setLatLngs(updatedPoints);
                    measurementLayer.bindTooltip(`Distance: ${distanceKm} km`).openTooltip();
                } else {
                    const newLayer = L.polyline(updatedPoints, { color: 'red', weight: 3 })
                        .addTo(map)
                        .bindTooltip(`Distance: ${distanceKm} km`, { permanent: true, direction: 'center' }) // Make tooltip permanent
                        .openTooltip();
                    setMeasurementLayer(newLayer);
                }
                logger.debug(`Measurement point added: ${newPoint}. Total points: ${updatedPoints.length}. Distance: ${distanceKm} km`);
            }
        };

        const handleDoubleClick = () => {
            if (isMeasuring) {
                logger.debug('Measurement finished via double-click.');
                setIsMeasuring(false);
                // Optionally make the tooltip permanent or display final distance
                if (measurementLayer) {
                    const finalDistanceKm = (currentDistance / 1000).toFixed(2);
                    measurementLayer.unbindTooltip(); // Remove temporary tooltip
                    measurementLayer.bindPopup(`<b>Final Distance:</b> ${finalDistanceKm} km`).openPopup(); // Add a popup instead
                }
                // Reset points for next measurement? Or keep layer until cleared? For now, keep layer.
                // setMeasurementPoints([]);
                // setMeasurementLayer(null);
                // setCurrentDistance(0);
                toast.success(`Measurement complete: ${(currentDistance / 1000).toFixed(2)} km`, { containerId: 'mapNotifications' });
                // TODO: Reset map cursor style
            }
        };

        map.on('contextmenu', handleContextMenu);
        map.on('click', handleClick); // Handles closing context menu AND measurement clicks
        map.on('dblclick', handleDoubleClick); // Finish measurement on double-click

        // Cleanup listeners
        return () => {
            map.off('contextmenu', handleContextMenu);
            map.off('click', handleClick);
            map.off('dblclick', handleDoubleClick);
            map.off('click', handleClick);
        };
        // Re-run if map instance changes or if visibility/measurement state changes
    }, [mapRef, isContextMenuVisible, handleCloseContextMenu, isMeasuring]); // Added isMeasuring dependency


    // --- Action Handlers ---
    const handleCopyCoords = useCallback((latLng: LatLng) => {
        const coordsText = `${latLng.lat.toFixed(6)}, ${latLng.lng.toFixed(6)}`;
        navigator.clipboard.writeText(coordsText)
            .then(() => {
                logger.debug('Coordinates copied to clipboard:', coordsText);
                toast.success(`Coordinates copied: ${coordsText}`, { containerId: 'mapNotifications', autoClose: 2000 });
            })
            .catch(err => {
                logger.error('Failed to copy coordinates:', err);
                toast.error('Failed to copy coordinates.', { containerId: 'mapNotifications' });
            });
    }, []);

    const handleMeasureDistance = useCallback((startLatLng: LatLng) => {
        logger.debug('Action: Measure Distance Start at', startLatLng);
        setIsMeasuring(true);
        setMeasurementPoints([startLatLng]); // Start with the clicked point
        setCurrentDistance(0);
        if (measurementLayer && mapRef.current) {
             mapRef.current.removeLayer(measurementLayer); // Clear previous layer
             setMeasurementLayer(null);
        }
        // TODO: Change map cursor style
        toast.info('Click on the map to add points. Double-click to finish.', { containerId: 'mapNotifications', autoClose: 3000 });
    }, []);

    const handleAddPoint = useCallback((latLng: LatLng) => {
        logger.debug('Action: Add Point at', latLng);
        const map = mapRef.current;
        if (map) {
            L.marker(latLng)
                .addTo(map)
                .bindPopup(`Added Point: ${latLng.lat.toFixed(4)}, ${latLng.lng.toFixed(4)}`);
            toast.info('Point added to map.', { containerId: 'mapNotifications', autoClose: 1500 });
        } else {
            logger.error('Map instance not available to add point.');
            toast.error('Could not add point: Map not ready.', { containerId: 'mapNotifications' });
        }
    }, []);

    const handleGenerateIsochrone = useCallback((latLng: LatLng) => {
        logger.debug('Action: Generate Isochrone (WIP)', latLng);
        // TODO: Implement isochrone logic (Phase 4 - Placeholder)
        alert('Generate Isochrone (WIP - Placeholder)');
    }, []);

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
            {/* Render Context Menu */}
            <MapContextMenu
                top={contextMenuPosition.top}
                left={contextMenuPosition.left}
                isVisible={isContextMenuVisible}
                latLng={contextMenuLatLng}
                onClose={handleCloseContextMenu}
                onCopyCoords={handleCopyCoords}
                onMeasureDistance={handleMeasureDistance}
                onAddPoint={handleAddPoint}
                onGenerateIsochrone={handleGenerateIsochrone}
            />

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