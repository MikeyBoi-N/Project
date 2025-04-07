import { useAuth } from '../context/AuthContext'; // Import useAuth
import { ChangeEvent } from 'react'; // Import ChangeEvent
import leafletImage from 'leaflet-image';
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import Layout from '../components/layout/Layout';
import Sidebar, { SidebarItemData } from '../components/layout/Sidebar'; // Import Sidebar and its data type
import dynamic from 'next/dynamic';
import styles from '../styles/MapPage.module.css';
import { styleOptions } from '../components/map/LayersMenu';
import LayersMenu, { defaultStyleOption, StyleOption } from '../components/map/LayersMenu';
import { FaPlus, FaMinus, FaCompass, FaClock } from 'react-icons/fa';
import type { Map } from 'leaflet';
import type { LatLngBounds } from 'leaflet';
import FilterButtons from '../components/map/FilterButtons';
import SearchBar from '../components/map/SearchBar';
import ContextWindowPlaceholder from '../components/map/ContextWindowPlaceholder';

// Dynamically import the map component to avoid SSR issues with Leaflet
const SharedMapComponent = dynamic(
  () => import('../components/map/SharedMapComponent'),
  { ssr: false }
);

const FILTER_STORAGE_KEY = 'djinnFilterSettings'; // Key for localStorage

// Define a type for detections for clarity (used by YOLO state and placeholders)
const guestStyleKey = 'guestMapStyleId'; // Key for sessionStorage

type Detection = {
  id: number;
  class: string;
  confidence: number;
  location: { lat: number; lng: number };
};

const DjinnPage: React.FC = () => {
  // --- Core State ---
  const { isGuest } = useAuth(); // Auth status
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(defaultStyleOption); // Map style
  const mapRef = useRef<Map | null>(null); // Map instance

  // --- NEW Layout Sidebar State (Adapted from Testing Grounds) ---
  const initialSidebarSections: SidebarItemData[] = [
    { id: 'air', title: 'Air', isOpen: false, isChecked: false, items: [] },
    { id: 'maritime', title: 'Maritime', isOpen: false, isChecked: false, items: [] },
    { id: 'computer-vision', title: 'Computer Vision', isOpen: true, isChecked: true, items: [
      { id: 'detection-filters', title: 'Detection Filters', isSubOpen: false, isChecked: true, subItems: [] },
      { id: 'confidence-score', title: 'Confidence Score', isSubOpen: false, isChecked: true, subItems: [], hasInput: true, inputValue: 87 },
      { id: 'preferences', title: 'Preferences', isSubOpen: true, isChecked: true, subItems: [
        { id: 'align-rotation', title: 'Align detection rotation', isChecked: true },
        { id: 'segmentation', title: 'Segmentation', isSubOpen: false, isChecked: true, subSubItems: [] },
        { id: 'opacity', title: 'Opacity', isChecked: true, hasSlider: true },
        { id: 'theme', title: 'Theme', isChecked: true, hasPicker: true }
      ]}
    ]},
    { id: 'signals', title: 'Signals', isOpen: false, isChecked: false, items: [] },
    { id: 'imagery', title: 'Imagery', isOpen: false, isChecked: false, items: [] },
    { id: 'weather', title: 'Weather', isOpen: false, isChecked: false, items: [] },
  ];
  const [sidebarSections, setSidebarSections] = useState<SidebarItemData[]>(initialSidebarSections);

  // --- Other Page State (Previously existed, needed for filtering/map/API) ---
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(new Set(['car', 'person'])); // Filter state
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.5); // Filter state
  const [visOptions, setVisOptions] = useState({ colorByClass: true, showConfidence: false }); // Map visualization state
  const [objectCount, setObjectCount] = useState<number | null>(0); // Display state (derived)
  const [yoloDetections, setYoloDetections] = useState<Detection[]>([]); // API results
  const [isLoadingDetections, setIsLoadingDetections] = useState<boolean>(false); // API loading
  const [detectionError, setDetectionError] = useState<string | null>(null); // API error

  // --- Placeholder Data (Can be removed if API is primary source) ---
  const [rawDetections, setRawDetections] = useState<Detection[]>([
    { id: 1, class: 'car', confidence: 0.9, location: { lat: 51.505, lng: -0.09 } },
    { id: 2, class: 'person', confidence: 0.75, location: { lat: 51.51, lng: -0.1 } },
    { id: 3, class: 'car', confidence: 0.6, location: { lat: 51.50, lng: -0.08 } },
    { id: 4, class: 'truck', confidence: 0.85, location: { lat: 51.515, lng: -0.095 } },
  ]);

  // --- Derived State ---
  const filteredDetections = useMemo(() => {
    // Filter placeholder data based on filter state
    return rawDetections.filter(detection =>
      selectedClasses.has(detection.class) &&
      detection.confidence >= confidenceThreshold
    );
    // TODO: Adapt this to filter yoloDetections when API is primary source
  }, [rawDetections, selectedClasses, confidenceThreshold]);

  // --- Effects ---
  // Update object count when filtered data changes
  useEffect(() => {
    setObjectCount(filteredDetections.length);
  }, [filteredDetections]);

  // Load guest map style from session storage
  useEffect(() => {
    if (isGuest === true) {
      const savedStyleId = sessionStorage.getItem(guestStyleKey);
      if (savedStyleId) {
        const foundStyle = styleOptions.find((style: StyleOption) => style.id === savedStyleId);
        if (foundStyle) {
          setSelectedStyle(foundStyle);
        } else {
          console.warn(`Saved guest style ID "${savedStyleId}" not found in options.`);
        }
      }
    }
  }, [isGuest]);

  // Load filters from local storage on mount
  useEffect(() => {
    loadFiltersFromStorage();
  }, []); // Run only once on mount

  // --- Handlers ---

  // Helper function to recursively find and update sidebar items
  const findItemAndUpdate = (
    items: SidebarItemData[],
    id: string,
    updateFn: (item: SidebarItemData) => SidebarItemData
  ): SidebarItemData[] => {
    return items.map(item => {
      if (item.id === id) {
        return updateFn(item);
      }
      let children: SidebarItemData[] | undefined;
      if (item.items) children = item.items;
      else if (item.subItems) children = item.subItems;
      else if (item.subSubItems) children = item.subSubItems;

      if (children && children.length > 0) {
        const updatedChildren = findItemAndUpdate(children, id, updateFn);
        if (updatedChildren !== children) {
            if (item.items) return { ...item, items: updatedChildren };
            if (item.subItems) return { ...item, subItems: updatedChildren };
            if (item.subSubItems) return { ...item, subSubItems: updatedChildren };
        }
      }
      return item;
    });
  };

  // NEW Sidebar Handlers
  const handleSidebarToggleOpen = useCallback((id: string) => {
    setSidebarSections(currentSections =>
      findItemAndUpdate(currentSections, id, (item) => {
        const updatedItem = { ...item };
        if (updatedItem.hasOwnProperty('isOpen')) updatedItem.isOpen = !updatedItem.isOpen;
        if (updatedItem.hasOwnProperty('isSubOpen')) updatedItem.isSubOpen = !updatedItem.isSubOpen;
        return updatedItem;
      })
    );
  }, []);

  const handleSidebarToggleCheck = useCallback((id: string) => {
    setSidebarSections(currentSections =>
      findItemAndUpdate(currentSections, id, item => ({
        ...item,
        isChecked: !item.isChecked,
      }))
    );
    console.log(`Item ${id} checked state changed.`);
    // TODO: Trigger side effects (filtering, layer visibility) based on 'id' and new checked state
  }, []);

  const handleSidebarInputChange = useCallback((id: string, value: string) => {
    setSidebarSections(currentSections =>
      findItemAndUpdate(currentSections, id, item => ({
        ...item,
        inputValue: value,
      }))
    );
    console.log(`Item ${id} input changed to: ${value}`);
     // TODO: Trigger side effects (filtering) based on 'id' and new 'value'
     // Example: If id === 'confidence-score', update confidenceThreshold state
     if (id === 'confidence-score') {
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
            setConfidenceThreshold(numericValue / 100); // Assuming input is 0-100, state is 0-1
        }
     }
  }, []);

  // Map Style Handler
  const handleStyleChange = useCallback((style: StyleOption) => {
    setSelectedStyle(style);
    // Save guest style choice to session storage
    if (isGuest) {
      sessionStorage.setItem(guestStyleKey, style.id);
    }
  }, [isGuest]); // Add isGuest dependency

  // Map Control Handlers
  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handle3DClick = () => console.log("3D View Clicked (Deferred)");
  const handleRotateClick = () => console.log("Rotate Clicked (Deferred)");
  const handleTimelineClick = () => console.log("Timeline Clicked (Deferred)");

  // Filter Save/Load Handlers
  const loadFiltersFromStorage = useCallback(() => {
    const savedData = localStorage.getItem(FILTER_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log('Loading filters from storage:', parsedData);

        // Load sidebar state snapshot if available
        if (Array.isArray(parsedData.sidebarStateSnapshot)) {
           setSidebarSections(parsedData.sidebarStateSnapshot);
           // Also update related filter states based on loaded sidebar state
           const confidenceItem = parsedData.sidebarStateSnapshot
             .flatMap((s: SidebarItemData) => s.items ?? [])
             .find((i: SidebarItemData) => i.id === 'confidence-score');
           if (confidenceItem?.inputValue) {
             const numericValue = parseFloat(confidenceItem.inputValue);
             if (!isNaN(numericValue)) {
               setConfidenceThreshold(numericValue / 100); // Assuming 0-100 input
             }
           }
           // TODO: Update selectedClasses based on loaded checked states if needed
        } else {
            // Fallback or handle older saved formats if necessary
            console.warn('Loaded sidebarStateSnapshot is not an array or missing.');
            // Load individual filter states if snapshot isn't present (optional fallback)
            if (typeof parsedData.confidenceThreshold === 'number') {
              setConfidenceThreshold(parsedData.confidenceThreshold);
            }
            if (typeof parsedData.visOptions === 'object' && parsedData.visOptions !== null) {
              setVisOptions(prev => ({ ...prev, ...parsedData.visOptions }));
            }
            if (Array.isArray(parsedData.selectedClasses)) {
              setSelectedClasses(new Set(parsedData.selectedClasses));
            }
        }

      } catch (error) {
        console.error('Failed to parse saved filter settings:', error);
      }
    } else {
      console.log('No saved filter settings found.');
    }
  }, []); // Removed state setters as dependencies, loadFiltersFromStorage is stable

  const handleSaveFilters = () => {
    try {
      // Save the current state of the sidebar directly
      const filterSettings = {
        sidebarStateSnapshot: sidebarSections
        // Optionally save other non-sidebar states if needed separately
        // confidenceThreshold: confidenceThreshold, // Example
        // visOptions: visOptions, // Example
      };
      const stringifiedData = JSON.stringify(filterSettings);
      localStorage.setItem(FILTER_STORAGE_KEY, stringifiedData);
      console.log('Filter settings saved:', filterSettings);
      // Add user feedback (e.g., toast notification)
    } catch (error) {
      console.error('Failed to save filter settings:', error);
      // Add user feedback
    }
  };

  const handleLoadFilters = () => {
    loadFiltersFromStorage();
    // Add user feedback
  };

  // YOLO Detection Handler
  const handleDetectObjectsClick = async () => {
    if (!mapRef.current) {
      console.error('Map instance not available');
      setDetectionError('Map instance not ready.');
      return;
    }

    const mapInstance = mapRef.current;
    setIsLoadingDetections(true);
    setDetectionError(null);
    setYoloDetections([]);

    leafletImage(mapInstance, async (err: Error | null, canvas: HTMLCanvasElement) => {
      if (err) {
        console.error('Error capturing map image:', err);
        setDetectionError(`Failed to capture map image: ${err.message}`);
        setIsLoadingDetections(false);
        return;
      }

      try {
        const imageData = canvas.toDataURL('image/png');
        const boundsRaw = mapInstance.getBounds();
        const bounds = {
          _southWest: { lat: boundsRaw.getSouthWest().lat, lng: boundsRaw.getSouthWest().lng },
          _northEast: { lat: boundsRaw.getNorthEast().lat, lng: boundsRaw.getNorthEast().lng },
        };

        console.log('Sending detection request with bounds:', bounds);

        const response = await fetch('/api/djinn/detect_map_view', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_data: imageData, bounds: bounds }),
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`API Error (${response.status}): ${errorData || response.statusText}`);
        }

        const data = await response.json();
        console.log('Received detections:', data.detections);
        setYoloDetections(data.detections || []);

      } catch (error: any) {
        console.error('Error calling detection API:', error);
        setDetectionError(`Detection failed: ${error.message}`);
        setYoloDetections([]);
      } finally {
        setIsLoadingDetections(false);
      }
    });
  };


  // --- Render ---
  return (
    <Layout
      title="Djinn Suite - Selkie"
      sidebarProps={{ // Pass props for the NEW layout sidebar structure
        sections: sidebarSections,
        onToggleOpen: handleSidebarToggleOpen,
        onToggleCheck: handleSidebarToggleCheck,
        onInputChange: handleSidebarInputChange,
        onSaveFilters: handleSaveFilters, // Pass save/load handlers
        onLoadFilters: handleLoadFilters,
      }}
    >
      {/* Map Component */}
      <SharedMapComponent
        tileLayerInfo={selectedStyle}
        mapRef={mapRef}
        detections={yoloDetections} // Pass API detections
        visOptions={visOptions} // Pass visualization options
      />

      {/* --- Overlays --- */}
      <div className={styles.filterButtonsOverlay}>
        <FilterButtons />
      </div>
      <div className={styles.searchBarOverlay}>
        <SearchBar />
      </div>
      <div className={styles.detectionTriggerOverlay}>
         <button
           onClick={handleDetectObjectsClick}
           disabled={isLoadingDetections}
           className={styles.detectButton}
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
        <LayersMenu
          selectedStyle={selectedStyle}
          onStyleChange={handleStyleChange}
        />
        <div className={styles.toolNavContainer}>
          <button className={styles.toolButton} onClick={handleZoomIn} aria-label="Zoom In"><FaPlus /></button>
          <button className={styles.toolButton} onClick={handleZoomOut} aria-label="Zoom Out"><FaMinus /></button>
          <button className={styles.toolButton} onClick={handle3DClick} aria-label="3D View"><span>3D</span></button>
          <button className={styles.toolButton} onClick={handleRotateClick} aria-label="Rotate View"><FaCompass /></button>
          <button className={styles.toolButton} onClick={handleTimelineClick} aria-label="Timeline"><FaClock /></button>
        </div>
      </div>

    </Layout>
  );
};

export default DjinnPage;