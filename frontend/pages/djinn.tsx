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

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import notificationStyles from '../styles/Notifications.module.css';
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

// Define the detailed sidebar structure here
const sampleSidebarStructure: SidebarItemData[] = [
  // Computer Vision Section
  {
    id: 'cv', title: 'Computer Vision', isChecked: false, isOpen: false, items: [
      { id: 'cv-detection', title: 'Detection Threshold', isChecked: false, isSubOpen: false, subItems: [
          { id: 'cv-detection-confidence', title: 'Confidence Score', isChecked: false, hasSlider: true /* 0.1-0.9 */ },
          { id: 'cv-detection-size', title: 'Object Size Range', isChecked: false, hasInput: true /* pixels/meters/feet */ },
          { id: 'cv-detection-sensitivity', title: 'Class Sensitivity', isChecked: false, hasPicker: true /* Aircraft, vessels, etc. */, subSubItems: [
              { id: 'cv-sensitivity-aircraft', title: 'Aircraft', isChecked: false },
              { id: 'cv-sensitivity-vessels', title: 'Vessels', isChecked: false },
              { id: 'cv-sensitivity-vehicles', title: 'Land Vehicles', isChecked: false },
              // Potentially more nested classes here
          ]},
      ]},
      { id: 'cv-temporal', title: 'Temporal Filters', isChecked: false, isSubOpen: false, subItems: [
          { id: 'cv-temporal-hours', title: 'Detections within X hours', isChecked: false, hasSlider: true /* 1-72 */ },
          { id: 'cv-temporal-timelapse', title: 'Time-lapse Speed', isChecked: false, hasSlider: true /* 1x-10x */ },
          { id: 'cv-temporal-history', title: 'Historical Comparison', isChecked: false, hasPicker: true /* Side-by-side/Overlay */ },
      ]},
      { id: 'cv-class', title: 'Object Class Filter', isChecked: false, isSubOpen: false, subItems: [
          { id: 'cv-class-aircraft', title: 'Aircraft', isChecked: false, subSubItems: [
              { id: 'cv-class-aircraft-comm', title: 'Commercial', isChecked: false },
              { id: 'cv-class-aircraft-mil', title: 'Military', isChecked: false },
              { id: 'cv-class-aircraft-priv', title: 'Private', isChecked: false },
              { id: 'cv-class-aircraft-unk', title: 'Unknown', isChecked: false },
          ]},
          { id: 'cv-class-maritime', title: 'Maritime Vessels', isChecked: false, subSubItems: [
              { id: 'cv-class-maritime-cargo', title: 'Cargo', isChecked: false },
              { id: 'cv-class-maritime-tanker', title: 'Tanker', isChecked: false },
              // ... other vessel types
          ]},
          { id: 'cv-class-ground', title: 'Ground Vehicles', isChecked: false, subSubItems: [
              { id: 'cv-class-ground-civ', title: 'Civilian', isChecked: false },
              { id: 'cv-class-ground-mil', title: 'Military', isChecked: false },
              // ... other vehicle types
          ]},
      ]},
      { id: 'cv-spatial', title: 'Spatial Constraints', isChecked: false, isSubOpen: false, subItems: [
          { id: 'cv-spatial-bbox', title: 'Map Extent BBox', isChecked: false, hasPicker: true /* Map interaction? */ },
          { id: 'cv-spatial-alt', title: 'Altitude/Elevation Range', isChecked: false, hasSlider: true },
          { id: 'cv-spatial-poi', title: 'Proximity to POIs', isChecked: false, hasPicker: true /* Select POIs? */ },
      ]},
      { id: 'cv-output', title: 'Output Metrics', isChecked: false, isSubOpen: false, subItems: [
          { id: 'cv-output-count', title: 'Detection Count', isChecked: false, hasPicker: true /* per km²/bbox/extent */ },
          { id: 'cv-output-dist', title: 'Class Distribution', isChecked: false /* Display only? */ },
          { id: 'cv-output-heatmap', title: 'Heatmap Density', isChecked: false },
          { id: 'cv-output-stats', title: 'Additional Stats', isChecked: false /* Display only? */ },
      ]},
    ]
  },
  // Weather Section
  {
    id: 'weather', title: 'Weather', isChecked: false, isOpen: false, items: [
      { id: 'weather-forecast', title: 'Forecast Layers', isChecked: false, isSubOpen: false, subItems: [
          { id: 'weather-forecast-time', title: 'Time Window', isChecked: false, hasSlider: true /* 0-72 hrs */ },
          { id: 'weather-forecast-precip', title: 'Precipitation Type', isChecked: false, hasPicker: true /* rain/snow/hail */ },
          { id: 'weather-forecast-storm', title: 'Storm Tracking', isChecked: false },
      ]},
      { id: 'weather-sea', title: 'Sea State', isChecked: false, isSubOpen: false, subItems: [
          { id: 'weather-sea-wave', title: 'Wave Height', isChecked: false, hasSlider: true /* 0-15m */ },
          { id: 'weather-sea-swell', title: 'Swell Direction', isChecked: false, hasSlider: true /* 0-360 deg */ },
          { id: 'weather-sea-temp', title: 'Water Temp Anomaly', isChecked: false },
      ]},
      { id: 'weather-atmos', title: 'Atmospheric Sensors', isChecked: false, isSubOpen: false, subItems: [
          { id: 'weather-atmos-wind', title: 'Wind Vectors', isChecked: false },
          { id: 'weather-atmos-aqi', title: 'Air Quality Index', isChecked: false, hasPicker: true /* PM2.5/CO2 */ },
          { id: 'weather-atmos-lightning', title: 'Lightning Strike Density', isChecked: false },
      ]},
      { id: 'weather-extreme', title: 'Extreme Events', isChecked: false, isSubOpen: false, subItems: [
          { id: 'weather-extreme-hurricane', title: 'Hurricane/Cyclone Alerts', isChecked: false },
          { id: 'weather-extreme-flood', title: 'Flood Risk Zones', isChecked: false, hasSlider: true /* 1-5 severity */ },
          { id: 'weather-extreme-fire', title: 'Wildfire Smoke Dispersion', isChecked: false },
      ]},
      { id: 'weather-climate', title: 'Climate Overlays', isChecked: false, isSubOpen: false, subItems: [
          { id: 'weather-climate-avg', title: 'Historical Averages', isChecked: false },
          { id: 'weather-climate-drought', title: 'Drought Index', isChecked: false },
          { id: 'weather-climate-ice', title: 'Ice Cover Percentage', isChecked: false, hasSlider: true },
      ]},
    ]
  },
  // Aerial Section
  {
    id: 'aerial', title: 'Aerial', isChecked: false, isOpen: false, items: [
       { id: 'aerial-tracking', title: 'Flight Tracking', isChecked: false, isSubOpen: false, subItems: [
           { id: 'aerial-tracking-alt', title: 'Altitude Range', isChecked: false, hasSlider: true /* 0-50k ft */ },
           { id: 'aerial-tracking-type', title: 'Aircraft Type', isChecked: false, hasPicker: true /* comm/mil/uav */ },
           { id: 'aerial-tracking-emerg', title: 'Emergency Status', isChecked: false, hasPicker: true /* mayday/squawk */ },
       ]},
       { id: 'aerial-imagery', title: 'Imagery Sources', isChecked: false, isSubOpen: false, subItems: [
           { id: 'aerial-imagery-source', title: 'Satellite vs UAV', isChecked: false, hasPicker: true },
           { id: 'aerial-imagery-band', title: 'Spectral Band', isChecked: false, hasPicker: true /* RGB/IR */ },
           { id: 'aerial-imagery-cloud', title: 'Cloud Cover Tolerance', isChecked: false, hasSlider: true /* 0-100% */ },
       ]},
       { id: 'aerial-density', title: 'Density Metrics', isChecked: false, isSubOpen: false, subItems: [
           { id: 'aerial-density-heatmap', title: 'Flights/Hour Heatmap', isChecked: false },
           { id: 'aerial-density-noise', title: 'Noise Pollution Contours', isChecked: false },
           { id: 'aerial-density-airspace', title: 'Restricted Airspace Alerts', isChecked: false },
       ]},
    ]
  },
  // Maritime Section
  {
    id: 'maritime', title: 'Maritime', isChecked: false, isOpen: false, items: [
        { id: 'maritime-filters', title: 'Vessel Filters', isChecked: false, isSubOpen: false, subItems: [
            { id: 'maritime-filters-speed', title: 'Speed Range', isChecked: false, hasSlider: true /* 0-30 knots */ },
            { id: 'maritime-filters-draft', title: 'Draft Depth', isChecked: false, hasSlider: true /* 1-25m */ },
            { id: 'maritime-filters-flag', title: 'Flag State', isChecked: false, hasPicker: true },
        ]},
        { id: 'maritime-cargo', title: 'Cargo Metrics', isChecked: false, isSubOpen: false, subItems: [
            { id: 'maritime-cargo-count', title: 'Container Count Estimate', isChecked: false },
            { id: 'maritime-cargo-hazmat', title: 'Hazardous Material Flags', isChecked: false },
            { id: 'maritime-cargo-congestion', title: 'Port Congestion Indicators', isChecked: false },
        ]},
        { id: 'maritime-env', title: 'Environmental Sensors', isChecked: false, isSubOpen: false, subItems: [
            { id: 'maritime-env-spill', title: 'Oil Spill Detection', isChecked: false },
            { id: 'maritime-env-fishing', title: 'Illegal Fishing Alerts', isChecked: false },
            { id: 'maritime-env-cetacean', title: 'Cetacean Migration Paths', isChecked: false },
        ]},
    ]
  },
  // Land Section
  {
    id: 'land', title: 'Land', isChecked: false, isOpen: false, items: [
        { id: 'land-traffic', title: 'Traffic Analytics', isChecked: false, isSubOpen: false, subItems: [
            { id: 'land-traffic-congestion', title: 'Congestion Level', isChecked: false, hasPicker: true /* low/med/high */ },
            { id: 'land-traffic-incidents', title: 'Incident Reports', isChecked: false },
            { id: 'land-traffic-ev', title: 'EV Charging Density', isChecked: false },
        ]},
        { id: 'land-infra', title: 'Infrastructure', isChecked: false, isSubOpen: false, subItems: [
            { id: 'land-infra-bridge', title: 'Bridge Weight Limits', isChecked: false },
            { id: 'land-infra-rail', title: 'Railway Crossing Status', isChecked: false },
            { id: 'land-infra-power', title: 'Power Grid Load', isChecked: false },
        ]},
        { id: 'land-terrain', title: 'Terrain Analysis', isChecked: false, isSubOpen: false, subItems: [
            { id: 'land-terrain-slope', title: 'Slope Angle', isChecked: false, hasSlider: true /* 0-45 deg */ },
            { id: 'land-terrain-veg', title: 'Vegetation Health (NDVI)', isChecked: false },
            { id: 'land-terrain-heat', title: 'Urban Heat Island', isChecked: false },
        ]},
    ]
  },
];


const DjinnPage: React.FC = () => {
  // --- Core State ---
  const { isGuest } = useAuth(); // Auth status
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(defaultStyleOption); // Map style
  const mapRef = useRef<Map | null>(null); // Map instance

  // --- NEW Layout Sidebar State (Adapted from Testing Grounds) ---
  // --- NEW Layout Sidebar State ---
  // Initialize with the detailed structure moved from Sidebar.tsx
  const [sidebarSections, setSidebarSections] = useState<SidebarItemData[]>(sampleSidebarStructure);
  // --- Other Page State (Previously existed, needed for filtering/map/API) ---
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(new Set(['car', 'person'])); // Filter state
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.5); // Filter state
  const [visOptions, setVisOptions] = useState({ colorByClass: true, showConfidence: false }); // Map visualization state
  const [objectCount, setObjectCount] = useState<number | null>(0); // Display state (derived)
  const [yoloDetections, setYoloDetections] = useState<Detection[]>([]); // API results
  const [isLoadingDetections, setIsLoadingDetections] = useState<boolean>(false); // API loading
  // const [detectionError, setDetectionError] = useState<string | null>(null); // API error - Replaced by toast notifications

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
           // setSidebarSections(parsedData.sidebarStateSnapshot); // Temporarily disabled to test hypothesis
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
      toast.error('Map instance not ready.', { className: notificationStyles.errorToast, progressClassName: notificationStyles.errorToastProgress });
      return;
    }

    const mapInstance = mapRef.current;
    setIsLoadingDetections(true);
    // setDetectionError(null); // Clear previous errors implicitly
    setYoloDetections([]);

    leafletImage(mapInstance, async (err: Error | null, canvas: HTMLCanvasElement) => {
      if (err) {
        console.error('Error capturing map image:', err);
        toast.error("Error capturing map image", { autoClose: 5000, className: notificationStyles.errorToast, progressClassName: notificationStyles.errorToastProgress });
        setIsLoadingDetections(false);
        return;
      }

      try {
        console.log('leafletImage callback: mapInstance valid?', !!mapInstance);
        console.log('leafletImage callback: canvas object:', canvas);
        const imageData = canvas.toDataURL('image/png');
        const boundsRaw = mapInstance.getBounds();
        console.log('leafletImage callback: boundsRaw object:', boundsRaw);
        const sw = boundsRaw.getSouthWest();
        const ne = boundsRaw.getNorthEast();
        console.log('leafletImage callback: sw object:', sw);
        console.log('leafletImage callback: ne object:', ne);
        const bounds = {
          _southWest: { lat: sw.lat, lng: sw.lng },
          _northEast: { lat: ne.lat, lng: ne.lng },
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
        toast.error("Detection request failed: API error", { autoClose: 10000, className: notificationStyles.errorToast, progressClassName: notificationStyles.errorToastProgress });
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
        // Pass detection props down
        onDetectObjects: handleDetectObjectsClick,
        isLoadingDetections: isLoadingDetections,
      }}
    >
      <ToastContainer autoClose={5000} hideProgressBar theme="colored" />
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
      {/* Button moved to Sidebar */}
      {/* Error display removed, handled by toast notifications */}
      {/* Closing brace removed */}
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