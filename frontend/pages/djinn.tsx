import { useAuth } from '../context/AuthContext'; // Import useAuth
import { ChangeEvent } from 'react'; // Import ChangeEvent
import leafletImage from 'leaflet-image';
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react'; // Added useEffect and useMemo
import Layout from '../components/layout/Layout';
import Sidebar from '../components/layout/Sidebar'; // Import Sidebar
import dynamic from 'next/dynamic';
import styles from '../styles/MapPage.module.css'; // Keep using MapPage styles for now, can be refactored later if needed
import { styleOptions } from '../components/map/LayersMenu'; // Import styleOptions array
import LayersMenu, { defaultStyleOption, StyleOption } from '../components/map/LayersMenu'; // Import LayersMenu and types
import { FaPlus, FaMinus, FaCompass, FaClock } from 'react-icons/fa'; // Import icons
import type { Map } from 'leaflet'; // Import Leaflet Map type for ref
import type { LatLngBounds } from 'leaflet'; // Import LatLngBounds type
import FilterButtons from '../components/map/FilterButtons'; // Import FilterButtons
import SearchBar from '../components/map/SearchBar'; // Import SearchBar
import ContextWindowPlaceholder from '../components/map/ContextWindowPlaceholder'; // Import Placeholder
// Dynamically import the map component to avoid SSR issues with Leaflet
const SharedMapComponent = dynamic(
  () => import('../components/map/SharedMapComponent'),
  { ssr: false }
);


const FILTER_STORAGE_KEY = 'djinnFilterSettings'; // Key for localStorage

const DjinnPage: React.FC = () => { // Renamed from MapPage
  // State for the currently selected map style
  const { isGuest } = useAuth(); // Get guest status
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(defaultStyleOption);
  // Ref to hold the Leaflet map instance
  const mapRef = useRef<Map | null>(null);


  // --- Sidebar State & Handlers ---
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(new Set(['car', 'person'])); // Initial selection
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.5);
  const [visOptions, setVisOptions] = useState({
    colorByClass: true,
    showConfidence: false,
  });
  const [isGeoFilterActive, setIsGeoFilterActive] = useState<boolean>(false);
  const [selectedDetection, setSelectedDetection] = useState<object | null>(null); // For passing to Sidebar
  const [objectCount, setObjectCount] = useState<number | null>(0); // For passing to Sidebar



  // --- YOLO Detection State ---
  const [yoloDetections, setYoloDetections] = useState<Detection[]>([]); // State for API results
  const [isLoadingDetections, setIsLoadingDetections] = useState<boolean>(false);
  const [detectionError, setDetectionError] = useState<string | null>(null);

  // --- Placeholder Detection Data & Filtering --- 
  // Define a type for detections for clarity
  type Detection = {
    id: number;
    class: string;
    confidence: number;
    location: { lat: number; lng: number };
  };

  const [rawDetections, setRawDetections] = useState<Detection[]>([
    { id: 1, class: 'car', confidence: 0.9, location: { lat: 51.505, lng: -0.09 } },
    { id: 2, class: 'person', confidence: 0.75, location: { lat: 51.51, lng: -0.1 } },
    { id: 3, class: 'car', confidence: 0.6, location: { lat: 51.50, lng: -0.08 } },
    { id: 4, class: 'truck', confidence: 0.85, location: { lat: 51.515, lng: -0.095 } },
  ]);

  // Memoized filtered detections based on sidebar state
  const filteredDetections = useMemo(() => {
    return rawDetections.filter(detection => 
      selectedClasses.has(detection.class) && 
      detection.confidence >= confidenceThreshold
    );
  }, [rawDetections, selectedClasses, confidenceThreshold]);

  // Effect to update object count whenever filters change
  useEffect(() => {
    setObjectCount(filteredDetections.length);
  }, [filteredDetections]);
  // --- End Placeholder Detection Data & Filtering ---

  const handleConfidenceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newConfidence = parseFloat(event.target.value);
    setConfidenceThreshold(newConfidence);
    console.log('Parent: Confidence changed:', newConfidence); // Placeholder action
    // TODO: Trigger actual data fetching/filtering based on newConfidence
  };

  const handleVisOptionChange = (optionName: keyof typeof visOptions, event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setVisOptions(prevOptions => {
      const newOptions = { ...prevOptions, [optionName]: newValue };
      console.log('Parent: Vis option changed:', optionName, newValue, newOptions); // Placeholder action
      // TODO: Trigger map visualization update
      return newOptions;
    });
  };

  const handleGeoFilterToggle = () => {
    setIsGeoFilterActive(prev => {
      const newState = !prev;
      console.log('Parent: Geo filter toggled:', newState); // Placeholder action
      // TODO: Trigger map drawing mode enable/disable
      return newState;
    });
  };
  // --- End Sidebar State & Handlers ---

  // --- Filter Save/Load Handlers ---

  // Helper function to load and apply filters from localStorage
  const loadFiltersFromStorage = useCallback(() => {
    const savedData = localStorage.getItem(FILTER_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log('Loading filters from storage:', parsedData);

        // Validate and set confidence threshold
        if (typeof parsedData.confidenceThreshold === 'number') {
          setConfidenceThreshold(parsedData.confidenceThreshold);
        } else {
          console.warn('Loaded confidenceThreshold is not a number.');
        }

        // Validate and set visualization options
        if (typeof parsedData.visOptions === 'object' && parsedData.visOptions !== null) {
          // Basic check, could be more robust (e.g., check specific keys)
          setVisOptions(prev => ({ ...prev, ...parsedData.visOptions }));
        } else {
          console.warn('Loaded visOptions is not a valid object.');
        }

        // Validate and set selected classes (convert array back to Set)
        if (Array.isArray(parsedData.selectedClasses)) {
          setSelectedClasses(new Set(parsedData.selectedClasses));
        } else {
          console.warn('Loaded selectedClasses is not an array.');
        }

      } catch (error) {
        console.error('Failed to parse saved filter settings:', error);
        // Optional: Clear invalid data from storage
        // localStorage.removeItem(FILTER_STORAGE_KEY);
      }
    } else {
      console.log('No saved filter settings found.');
    }
  }, [setConfidenceThreshold, setVisOptions, setSelectedClasses]); // Dependencies: state setters

  const handleSaveFilters = () => {
    try {
      const filterSettings = {
        confidenceThreshold,
        visOptions,
        selectedClasses: Array.from(selectedClasses), // Convert Set to Array for JSON

      };
      const stringifiedData = JSON.stringify(filterSettings);
      localStorage.setItem(FILTER_STORAGE_KEY, stringifiedData);
      console.log('Filter settings saved:', filterSettings);
      // Optional: Add user feedback (e.g., alert('Filters saved!'))
    } catch (error) {
      console.error('Failed to save filter settings:', error);
      // Optional: Add user feedback (e.g., alert('Error saving filters.'))
    }
  };

  const handleLoadFilters = () => {
    loadFiltersFromStorage();
    // Optional: Add user feedback (e.g., alert('Filters loaded!'))
  };

  // --- End Filter Save/Load Handlers ---

  const guestStyleKey = 'guestMapStyleId'; // Key for sessionStorage

  // Effect to load guest style from sessionStorage
  useEffect(() => {
    // Only run if guest status is confirmed (not loading) and is actually guest
    if (isGuest === true) { // Explicit check for true
      const savedStyleId = sessionStorage.getItem(guestStyleKey);
      if (savedStyleId) {
        const foundStyle = styleOptions.find((style: StyleOption) => style.id === savedStyleId); // Add type annotation
        if (foundStyle) {
          setSelectedStyle(foundStyle);
          console.log('Restored guest map style:', foundStyle.name); // Optional logging
        } else {
          console.warn(`Saved guest style ID "${savedStyleId}" not found in options.`);
          // Optionally remove invalid key: sessionStorage.removeItem(guestStyleKey);
        }
      }
    }
    // Dependency: Run when guest status is determined/changes
  }, [isGuest]);

  // Callback to update the selected style
  const handleStyleChange = useCallback((style: StyleOption) => {
    setSelectedStyle(style);
  }, []);


  // Effect to load filters from localStorage on initial mount
  useEffect(() => {
    loadFiltersFromStorage();
  }, [loadFiltersFromStorage]); // Dependency ensures the effect uses the latest version of the callback

  // Zoom handlers using the mapRef
  const handleZoomIn = () => {
    mapRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut();
  };

  // Placeholder handlers for deferred functionality
  const handle3DClick = () => console.log("3D View Clicked (Deferred)");
  const handleRotateClick = () => console.log("Rotate Clicked (Deferred)");
  const handleTimelineClick = () => console.log("Timeline Clicked (Deferred)");


  // --- YOLO Detection Handler ---
  const handleDetectObjectsClick = async () => {
    if (!mapRef.current) {
      console.error('Map instance not available');
      setDetectionError('Map instance not ready.');
      return;
    }

    const mapInstance = mapRef.current;
    setIsLoadingDetections(true);
    setDetectionError(null);
    setYoloDetections([]); // Clear previous detections

    leafletImage(mapInstance, async (err: Error | null, canvas: HTMLCanvasElement) => { // Add types
      if (err) { // err is now typed
        console.error('Error capturing map image:', err);
        setDetectionError(`Failed to capture map image: ${err.message}`);
        setIsLoadingDetections(false);
        return;
      }

      try {
        const imageData = canvas.toDataURL('image/png');
        const boundsRaw = mapInstance.getBounds();
        // Format bounds to match backend Pydantic model (assuming _southWest, _northEast)
        const bounds = {
          _southWest: { lat: boundsRaw.getSouthWest().lat, lng: boundsRaw.getSouthWest().lng },
          _northEast: { lat: boundsRaw.getNorthEast().lat, lng: boundsRaw.getNorthEast().lng },
        };

        console.log('Sending detection request with bounds:', bounds);

        const response = await fetch('/api/djinn/detect_map_view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image_data: imageData, bounds: bounds }),
        });

        if (!response.ok) {
          const errorData = await response.text(); // Read error text
          throw new Error(`API Error (${response.status}): ${errorData || response.statusText}`);
        }

        const data = await response.json();
        console.log('Received detections:', data.detections);

        // IMPORTANT: Adapt this based on the actual structure of data.detections
        // Assuming each detection has id, class, confidence, and location: { lat, lng }
        setYoloDetections(data.detections || []); 

      } catch (error: any) {
        console.error('Error calling detection API:', error);
        setDetectionError(`Detection failed: ${error.message}`);
        setYoloDetections([]); // Clear detections on error
      } finally {
        setIsLoadingDetections(false);
      }
    });
  };


  return (
    <Layout
      title="Djinn Suite - Selkie"
      sidebarProps={{ // Pass all required props for the Sidebar here
        confidenceThreshold,
        visOptions,
        isGeoFilterActive,
        selectedDetection,
        objectCount,
        onConfidenceChange: handleConfidenceChange,
        onVisOptionChange: handleVisOptionChange,
        onGeoFilterToggle: handleGeoFilterToggle,
        onSaveFilters: handleSaveFilters, // Pass save handler
        onLoadFilters: handleLoadFilters, // Pass load handler
      }}
    >
      {/* Sidebar is now rendered by Layout. Props are passed via Layout's sidebarProps. */}
      {/* Map Component */}
      {/* --- Detection Trigger Button --- */}
      {/* Detection Trigger Button - Moved below SearchBar */}

      {/* Map Component */}
      <SharedMapComponent
        tileLayerInfo={selectedStyle}
        mapRef={mapRef} // Pass mapRef to Map Component
        detections={yoloDetections} // Pass YOLO detections from API
        visOptions={visOptions} // Pass visualization options
      />

      {/* --- Overlays --- */}
      {/* Individual Overlay Components */}
      <div className={styles.filterButtonsOverlay}>
        <FilterButtons />
      </div>
      <div className={styles.searchBarOverlay}>
        <SearchBar />
      </div>
      {/* --- Detection Trigger Button (Moved) --- */}
      <div className={styles.detectionTriggerOverlay}>
         <button
           onClick={handleDetectObjectsClick}
           disabled={isLoadingDetections}
           className={styles.detectButton} // Use the new custom style
         >
           {isLoadingDetections ? 'Detecting...' : 'Detect Objects in View'}
         </button>
         {detectionError && <p className={styles.detectionError}>Error: {detectionError}</p>}
       </div>
      <div className={styles.contextWindowOverlay}>
        <ContextWindowPlaceholder />
      </div>


      {/* --- Bottom Right UI Cluster --- */}
      <div className={styles.bottomRightCluster}>
        {/* Layers Menu Component */}
        <LayersMenu
          selectedStyle={selectedStyle}
          onStyleChange={handleStyleChange}
        />

        {/* Tool Navigation Section */}
        <div className={styles.toolNavContainer}>
          <button className={styles.toolButton} onClick={handleZoomIn} aria-label="Zoom In">
            <FaPlus />
          </button>
          <button className={styles.toolButton} onClick={handleZoomOut} aria-label="Zoom Out">
            <FaMinus />
          </button>
          <button className={styles.toolButton} onClick={handle3DClick} aria-label="3D View">
            <span>3D</span>
          </button>
          <button className={styles.toolButton} onClick={handleRotateClick} aria-label="Rotate View">
            <FaCompass />
          </button>
          <button className={styles.toolButton} onClick={handleTimelineClick} aria-label="Timeline">
            <FaClock /> {/* Using FaClock as a substitute for 🕙 */}
          </button>
        </div>
      </div>

    </Layout>
  );
};

export default DjinnPage; // Renamed from MapPage