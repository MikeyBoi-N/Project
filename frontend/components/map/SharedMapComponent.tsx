import React, { useState, useEffect, MutableRefObject } from 'react'; // Added MutableRefObject
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import L, { Map } from 'leaflet'; // Added Map type
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

// --- Props Interface ---
interface SharedMapComponentProps {
    tileLayerInfo: StyleOption; // Receive selected style info from parent
    // id: string; // Removed - ID is accessed via tileLayerInfo.id
    mapRef: MutableRefObject<Map | null>; // Receive ref from parent
}

// --- Helper Functions (Keep existing getIconForSource) ---
function getIconForSource(source?: MapMarkerData['source']): L.Icon {
    return new L.Icon({
        iconUrl: iconUrl.src,
        iconRetinaUrl: iconRetinaUrl.src,
        shadowUrl: shadowUrl.src,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
}

// --- Component ---
const defaultCenter: [number, number] = [51.505, -0.09];
const defaultZoom = 13;

const SharedMapComponent: React.FC<SharedMapComponentProps> = ({ tileLayerInfo, mapRef }) => {
    const [markers, setMarkers] = useState<MapMarkerData[]>([]);
    const [footprints, setFootprints] = useState<MapFootprintData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

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

    // Data fetching logic (Keep existing useEffect)
    useEffect(() => {
        const fetchMapData = async () => {
            setIsLoading(true);
            setError(null);
            setMarkers([]);
            setFootprints([]);
            try {
                const response = await axios.get('/api/mapdata');

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
                    setMarkers([]);
                }

                // Process Footprints
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

                if (!response.data?.markers && !response.data?.footprints) {
                     // Keep this check, but maybe soften the error if one type exists but not the other
                     logger.warn("No marker or footprint data found in response.");
                     // throw new Error("Invalid or empty data format received from /api/mapdata");
                }

            } catch (err: any) {
                logger.error('Failed to fetch map data:', err);
                setError(err.message || 'Could not load map data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMapData();
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

                    {/* Keep existing loading/error indicators and marker/footprint rendering */}
                    {isLoading && <p>Loading map data...</p>}
                    {error && <p style={{ color: 'red' }}>Error: {error}</p>}

                    {!isLoading && markers.map((marker) => (
                        <Marker
                            key={marker.id}
                            position={marker.position}
                            icon={getIconForSource(marker.source)}
                        >
                            <Popup>
                                {marker.popupContent} <br />
                                <small>Source: {marker.source || 'Unknown'}</small>
                            </Popup>
                        </Marker>
                    ))}

                    {!isLoading && footprints.map((footprint) => {
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
                <FilterButtons />
                <SearchBar /> {/* Assuming SearchBar takes no props for now */}
                <ContextWindowPlaceholder />
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