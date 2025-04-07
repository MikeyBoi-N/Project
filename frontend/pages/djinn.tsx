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
// Keep the comprehensive import and the geocoder JS import
import L, { Map, LatLngExpression, LatLngBounds, LatLng } from 'leaflet'; // Import Leaflet and types
import 'leaflet-control-geocoder'; // Import the geocoder library (ensure JS is loaded)
// Removed duplicate/redundant imports for Map and LatLngBounds
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
    id: 'cv', title: 'Computer Vision', checkState: 'unchecked', isOpen: false, items: [
      { id: 'cv-detection', title: 'Detection Threshold', checkState: 'unchecked', isSubOpen: false, subItems: [
          { id: 'cv-detection-confidence', title: 'Confidence Score', checkState: 'unchecked', hasSlider: true /* 0.1-0.9 */ },
          { id: 'cv-detection-size', title: 'Object Size Range', checkState: 'unchecked', hasInput: true /* pixels/meters/feet */ },
          { id: 'cv-detection-sensitivity', title: 'Class Sensitivity', checkState: 'unchecked', hasPicker: true /* Aircraft, vessels, etc. */, subSubItems: [
              { id: 'cv-sensitivity-aircraft', title: 'Aircraft', checkState: 'unchecked' },
              { id: 'cv-sensitivity-vessels', title: 'Vessels', checkState: 'unchecked' },
              { id: 'cv-sensitivity-vehicles', title: 'Land Vehicles', checkState: 'unchecked' },
              // Potentially more nested classes here
          ]},
      ]},
      { id: 'cv-temporal', title: 'Temporal Filters', checkState: 'unchecked', isSubOpen: false, subItems: [
          { id: 'cv-temporal-hours', title: 'Detections within X hours', checkState: 'unchecked', hasSlider: true /* 1-72 */ },
          { id: 'cv-temporal-timelapse', title: 'Time-lapse Speed', checkState: 'unchecked', hasSlider: true /* 1x-10x */ },
          { id: 'cv-temporal-history', title: 'Historical Comparison', checkState: 'unchecked', hasPicker: true /* Side-by-side/Overlay */ },
      ]},
      { id: 'cv-class', title: 'Object Class Filter', checkState: 'unchecked', isSubOpen: false, subItems: [
          { id: 'cv-class-aircraft', title: 'Aircraft', checkState: 'unchecked', subSubItems: [
              { id: 'cv-class-aircraft-comm', title: 'Commercial', checkState: 'unchecked' },
              { id: 'cv-class-aircraft-mil', title: 'Military', checkState: 'unchecked' },
              { id: 'cv-class-aircraft-priv', title: 'Private', checkState: 'unchecked' },
              { id: 'cv-class-aircraft-unk', title: 'Unknown', checkState: 'unchecked' },
          ]},
          { id: 'cv-class-maritime', title: 'Maritime Vessels', checkState: 'unchecked', subSubItems: [
              { id: 'cv-class-maritime-cargo', title: 'Cargo', checkState: 'unchecked' },
              { id: 'cv-class-maritime-tanker', title: 'Tanker', checkState: 'unchecked' },
              // ... other vessel types
          ]},
          { id: 'cv-class-ground', title: 'Ground Vehicles', checkState: 'unchecked', subSubItems: [
              { id: 'cv-class-ground-civ', title: 'Civilian', checkState: 'unchecked' },
              { id: 'cv-class-ground-mil', title: 'Military', checkState: 'unchecked' },
              // ... other vehicle types
          ]},
      ]},
      { id: 'cv-spatial', title: 'Spatial Constraints', checkState: 'unchecked', isSubOpen: false, subItems: [
          { id: 'cv-spatial-bbox', title: 'Map Extent BBox', checkState: 'unchecked', hasPicker: true /* Map interaction? */ },
          { id: 'cv-spatial-alt', title: 'Altitude/Elevation Range', checkState: 'unchecked', hasSlider: true },
          { id: 'cv-spatial-poi', title: 'Proximity to POIs', checkState: 'unchecked', hasPicker: true /* Select POIs? */ },
      ]},
      { id: 'cv-output', title: 'Output Metrics', checkState: 'unchecked', isSubOpen: false, subItems: [
          { id: 'cv-output-count', title: 'Detection Count', checkState: 'unchecked', hasPicker: true /* per km²/bbox/extent */ },
          { id: 'cv-output-dist', title: 'Class Distribution', checkState: 'unchecked' /* Display only? */ },
          { id: 'cv-output-heatmap', title: 'Heatmap Density', checkState: 'unchecked' },
          { id: 'cv-output-stats', title: 'Additional Stats', checkState: 'unchecked' /* Display only? */ },
      ]},
    ]
  },
  // Weather Section
  {
    id: 'weather', title: 'Weather', checkState: 'unchecked', isOpen: false, items: [
      { id: 'weather-forecast', title: 'Forecast Layers', checkState: 'unchecked', isSubOpen: false, subItems: [
          { id: 'weather-forecast-time', title: 'Time Window', checkState: 'unchecked', hasSlider: true /* 0-72 hrs */ },
          { id: 'weather-forecast-precip', title: 'Precipitation Type', checkState: 'unchecked', hasPicker: true /* rain/snow/hail */ },
          { id: 'weather-forecast-storm', title: 'Storm Tracking', checkState: 'unchecked' },
      ]},
      { id: 'weather-sea', title: 'Sea State', checkState: 'unchecked', isSubOpen: false, subItems: [
          { id: 'weather-sea-wave', title: 'Wave Height', checkState: 'unchecked', hasSlider: true /* 0-15m */ },
          { id: 'weather-sea-swell', title: 'Swell Direction', checkState: 'unchecked', hasSlider: true /* 0-360 deg */ },
          { id: 'weather-sea-temp', title: 'Water Temp Anomaly', checkState: 'unchecked' },
      ]},
      { id: 'weather-atmos', title: 'Atmospheric Sensors', checkState: 'unchecked', isSubOpen: false, subItems: [
          { id: 'weather-atmos-wind', title: 'Wind Vectors', checkState: 'unchecked' },
          { id: 'weather-atmos-aqi', title: 'Air Quality Index', checkState: 'unchecked', hasPicker: true /* PM2.5/CO2 */ },
          { id: 'weather-atmos-lightning', title: 'Lightning Strike Density', checkState: 'unchecked' },
      ]},
      { id: 'weather-extreme', title: 'Extreme Events', checkState: 'unchecked', isSubOpen: false, subItems: [
          { id: 'weather-extreme-hurricane', title: 'Hurricane/Cyclone Alerts', checkState: 'unchecked' },
          { id: 'weather-extreme-flood', title: 'Flood Risk Zones', checkState: 'unchecked', hasSlider: true /* 1-5 severity */ },
          { id: 'weather-extreme-fire', title: 'Wildfire Smoke Dispersion', checkState: 'unchecked' },
      ]},
      { id: 'weather-climate', title: 'Climate Overlays', checkState: 'unchecked', isSubOpen: false, subItems: [
          { id: 'weather-climate-avg', title: 'Historical Averages', checkState: 'unchecked' },
          { id: 'weather-climate-drought', title: 'Drought Index', checkState: 'unchecked' },
          { id: 'weather-climate-ice', title: 'Ice Cover Percentage', checkState: 'unchecked', hasSlider: true },
      ]},
    ]
  },
  // Aerial Section
  {
    id: 'aerial', title: 'Aerial', checkState: 'unchecked', isOpen: false, items: [
       { id: 'aerial-tracking', title: 'Flight Tracking', checkState: 'unchecked', isSubOpen: false, subItems: [
           { id: 'aerial-tracking-alt', title: 'Altitude Range', checkState: 'unchecked', hasSlider: true /* 0-50k ft */ },
           { id: 'aerial-tracking-type', title: 'Aircraft Type', checkState: 'unchecked', hasPicker: true /* comm/mil/uav */ },
           { id: 'aerial-tracking-emerg', title: 'Emergency Status', checkState: 'unchecked', hasPicker: true /* mayday/squawk */ },
       ]},
       { id: 'aerial-imagery', title: 'Imagery Sources', checkState: 'unchecked', isSubOpen: false, subItems: [
           { id: 'aerial-imagery-source', title: 'Satellite vs UAV', checkState: 'unchecked', hasPicker: true },
           { id: 'aerial-imagery-band', title: 'Spectral Band', checkState: 'unchecked', hasPicker: true /* RGB/IR */ },
           { id: 'aerial-imagery-cloud', title: 'Cloud Cover Tolerance', checkState: 'unchecked', hasSlider: true /* 0-100% */ },
       ]},
       { id: 'aerial-density', title: 'Density Metrics', checkState: 'unchecked', isSubOpen: false, subItems: [
           { id: 'aerial-density-heatmap', title: 'Flights/Hour Heatmap', checkState: 'unchecked' },
           { id: 'aerial-density-noise', title: 'Noise Pollution Contours', checkState: 'unchecked' },
           { id: 'aerial-density-airspace', title: 'Restricted Airspace Alerts', checkState: 'unchecked' },
       ]},
    ]
  },
  // Maritime Section
  {
    id: 'maritime', title: 'Maritime', checkState: 'unchecked', isOpen: false, items: [
        { id: 'maritime-filters', title: 'Vessel Filters', checkState: 'unchecked', isSubOpen: false, subItems: [
            { id: 'maritime-filters-speed', title: 'Speed Range', checkState: 'unchecked', hasSlider: true /* 0-30 knots */ },
            { id: 'maritime-filters-draft', title: 'Draft Depth', checkState: 'unchecked', hasSlider: true /* 1-25m */ },
            { id: 'maritime-filters-flag', title: 'Flag State', checkState: 'unchecked', hasPicker: true },
        ]},
        { id: 'maritime-cargo', title: 'Cargo Metrics', checkState: 'unchecked', isSubOpen: false, subItems: [
            { id: 'maritime-cargo-count', title: 'Container Count Estimate', checkState: 'unchecked' },
            { id: 'maritime-cargo-hazmat', title: 'Hazardous Material Flags', checkState: 'unchecked' },
            { id: 'maritime-cargo-congestion', title: 'Port Congestion Indicators', checkState: 'unchecked' },
        ]},
        { id: 'maritime-env', title: 'Environmental Sensors', checkState: 'unchecked', isSubOpen: false, subItems: [
            { id: 'maritime-env-spill', title: 'Oil Spill Detection', checkState: 'unchecked' },
            { id: 'maritime-env-fishing', title: 'Illegal Fishing Alerts', checkState: 'unchecked' },
            { id: 'maritime-env-cetacean', title: 'Cetacean Migration Paths', checkState: 'unchecked' },
        ]},
    ]
  },
  // Land Section
  {
    id: 'land', title: 'Land', checkState: 'unchecked', isOpen: false, items: [
        { id: 'land-traffic', title: 'Traffic Analytics', checkState: 'unchecked', isSubOpen: false, subItems: [
            { id: 'land-traffic-congestion', title: 'Congestion Level', checkState: 'unchecked', hasPicker: true /* low/med/high */ },
            { id: 'land-traffic-incidents', title: 'Incident Reports', checkState: 'unchecked' },
            { id: 'land-traffic-ev', title: 'EV Charging Density', checkState: 'unchecked' },
        ]},
        { id: 'land-infra', title: 'Infrastructure', checkState: 'unchecked', isSubOpen: false, subItems: [
            { id: 'land-infra-bridge', title: 'Bridge Weight Limits', checkState: 'unchecked' },
            { id: 'land-infra-rail', title: 'Railway Crossing Status', checkState: 'unchecked' },
            { id: 'land-infra-power', title: 'Power Grid Load', checkState: 'unchecked' },
        ]},
        { id: 'land-terrain', title: 'Terrain Analysis', checkState: 'unchecked', isSubOpen: false, subItems: [
            { id: 'land-terrain-slope', title: 'Slope Angle', checkState: 'unchecked', hasSlider: true /* 0-45 deg */ },
            { id: 'land-terrain-veg', title: 'Vegetation Health (NDVI)', checkState: 'unchecked' },
            { id: 'land-terrain-heat', title: 'Urban Heat Island', checkState: 'unchecked' },
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
  // --- Search State ---
  const [currentSearchMarker, setCurrentSearchMarker] = useState<L.Marker | null>(null);
  const [highlightedLayers, setHighlightedLayers] = useState<{ layer: L.Layer, originalStyle: L.PathOptions }[]>([]); // Assuming internal data are Path layers
  const geocoderRef = useRef<any | null>(null); // Use 'any' for geocoder instance type due to potential TS issues

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

  // --- Search Implementation (Based on djinn_search_plan.md) ---

  // Initialize Geocoder instance
  useEffect(() => {
    // Use type casting for Geocoder
    if (typeof window !== 'undefined' && (L.Control as any).Geocoder) {
        // Ensure Leaflet and the plugin are loaded client-side
        // Use type casting for Geocoder
        geocoderRef.current = (L.Control as any).Geocoder.nominatim();
    }
  }, []);

  // Helper: Clear previous search results
  const clearSearchResults = useCallback(() => {
    if (currentSearchMarker && mapRef.current) {
        mapRef.current.removeLayer(currentSearchMarker);
        setCurrentSearchMarker(null);
    }
    highlightedLayers.forEach(item => {
        try {
            // Attempt to reset style - requires knowing the layer type
            if ('setStyle' in item.layer) {
                (item.layer as L.Path).setStyle(item.originalStyle);
            }
        } catch (e) { console.error("Error reverting style:", e); }
    });
    setHighlightedLayers([]);
    mapRef.current?.closePopup();
  }, [currentSearchMarker, highlightedLayers, mapRef]); // Added mapRef dependency

  // Helper: Search internal data layers (using rawDetections as source)
  const searchInternalLayers = useCallback((term: string): { layer?: L.Layer, name: string, location: LatLngExpression | LatLngBounds }[] => {
    const matches: { layer?: L.Layer, name: string, location: LatLngExpression | LatLngBounds }[] = [];
    if (!mapRef.current) return matches; // Need map instance to find layers potentially

    const lowerCaseTerm = term.toLowerCase();

    // Option 1: Search the raw data before it becomes layers
    // This is simpler if layers aren't easily iterable or don't store all needed data
    rawDetections.forEach(detection => {
        let found = false;
        // Check detection class
        if (detection.class.toLowerCase().includes(lowerCaseTerm)) {
            found = true;
        }
        // Add checks for other properties if needed (e.g., detection.id)

        if (found) {
            matches.push({
                // Layer reference might be tricky here if not searching actual layers
                // We might need to find the layer corresponding to the detection ID later
                name: `Detection: ${detection.class} (${detection.id})`,
                location: detection.location // Use the location from data
            });
        }
    });

    // Option 2: Iterate over actual map layers (More complex, needs layer group reference)
    // Example: if you have a layer group named 'detectionLayerGroup'
    /*
    if (detectionLayerGroupRef.current) {
        detectionLayerGroupRef.current.eachLayer(layer => {
            // Access layer data (e.g., layer.options.detectionData)
            // Perform checks similar to Option 1
            // If match, push { layer: layer, name: ..., location: layer.getLatLng() } to matches
        });
    }
    */

    console.log(`Internal search found ${matches.length} matches for '${term}'`);
    return matches;
  }, [rawDetections, mapRef]); // Added mapRef dependency

  // Helper: Perform Geocoding (async)
  const performGeocoding = useCallback((term: string, internalResults: any[]) => {
    if (!geocoderRef.current) {
        console.error("Geocoder not initialized");
        displayCombinedResults(internalResults, []); // Display internal results even if geocoder fails
        return;
    }
    console.log(`Performing geocoding for: ${term}`);
    // Use 'any' for geocoderRef.current and cast Result type
    geocoderRef.current.geocode(term, (geocodingResults: any[]) => { // Using any[] for results for simplicity
        console.log(`Geocoding results received:`, geocodingResults);
        displayCombinedResults(internalResults, geocodingResults || []);
    });
  }, [geocoderRef]); // Removed displayCombinedResults from deps, it uses state/refs

  // Helper: Display combined results
  // Use 'any[]' for geocodingMatches type
  const displayCombinedResults = useCallback((internalMatches: any[], geocodingMatches: any[]) => {
    if (!mapRef.current) return;
    const mapInstance = mapRef.current;
    clearSearchResults(); // Clear previous results first

    const allBounds: (LatLng | LatLngBounds)[] = [];
    const newHighlightedLayers: { layer: L.Layer, originalStyle: L.PathOptions }[] = [];

    // --- Display Internal Matches ---
    // This part needs refinement based on how internal layers are actually rendered
    // For now, we'll just log them and add their locations to bounds
    console.log(`Displaying ${internalMatches.length} internal matches.`);
    internalMatches.forEach(match => {
        if (match.location) {
            // We don't have the actual layer reference easily here with Option 1 search
            // So we can't highlight directly. We could add temporary markers instead.
            // Add marker for internal match, but don't open popup
            const tempMarker = L.marker(match.location as LatLngExpression).addTo(mapInstance)
                .bindPopup(`Internal: ${match.name}`); // Removed .openPopup()
            // Add marker to a temporary list to be cleared later? Or handle via clearSearchResults?
            // For now, let's just add bounds
            if (match.location instanceof L.LatLng || Array.isArray(match.location)) {
                allBounds.push(L.latLng(match.location as LatLngExpression));
            } else if (match.location instanceof L.LatLngBounds) {
                allBounds.push(match.location);
            }
        }
        // If using Option 2 search (iterating layers), highlighting would look like:
        /*
        try {
            const layer = match.layer as L.Path; // Assuming Path layers
            const originalStyle = JSON.parse(JSON.stringify(layer.options.style || L.Path.prototype.options));
            newHighlightedLayers.push({ layer: layer, originalStyle: originalStyle });
            layer.setStyle({ color: 'yellow', weight: 5, fillColor: 'yellow', fillOpacity: 0.4 }); // Highlight
            // layer.openPopup(); // Removed .openPopup()
            layer.openPopup();
            if (match.location instanceof L.LatLng) allBounds.push(match.location);
            else if (match.location instanceof L.LatLngBounds) allBounds.push(match.location);
        } catch (e) { console.error("Error processing internal match:", e); }
        */
    });
    // setHighlightedLayers(newHighlightedLayers); // Only if using Option 2 search

    // --- Display Top Geocoding Match ---
    console.log(`Displaying ${geocodingMatches.length} geocoding matches.`);
    if (geocodingMatches.length > 0) {
        const topResult = geocodingMatches[0];
        // Add marker for geocoding result, but don't open popup
        const marker = L.marker(topResult.center).addTo(mapInstance)
            .bindPopup(`Location: ${topResult.name}`); // Removed .openPopup()
        setCurrentSearchMarker(marker);
        allBounds.push(topResult.bbox instanceof L.LatLngBounds ? topResult.bbox : topResult.center);
    }

    // --- Adjust Map View ---
    if (allBounds.length > 0) {
        // Create bounds iteratively to handle mixed LatLng and LatLngBounds
        let combinedBounds = L.latLngBounds([]); // Start with empty bounds
        allBounds.forEach(bound => {
            if (bound instanceof L.LatLng) {
                combinedBounds.extend(bound);
            } else if (bound instanceof L.LatLngBounds) {
                combinedBounds.extend(bound); // extend can handle LatLngBounds directly
            }
        });

        if (combinedBounds.isValid()) {
             mapInstance.flyToBounds(combinedBounds.pad(0.1));
        } else if (allBounds.length === 1 && allBounds[0] instanceof L.LatLng) {
             // Fallback for single point if bounds somehow invalid
             mapInstance.flyTo(allBounds[0], 15);
        } else {
             console.error("Could not determine valid bounds for results:", allBounds);
        }
    } else {
        console.log("No results found to display.");
        // Optionally show a toast notification
        toast.info('No results found.', { containerId: 'mapNotifications' });
    }
  }, [mapRef, clearSearchResults]); // Dependencies

  // --- Main Search Handler ---
  const handleSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm) {
        clearSearchResults();
        return;
    }
    console.log(`Search triggered for: "${searchTerm}"`);

    // Step 1: Attempt Coordinate Parse
    const coordMatch = searchTerm.match(/^\s*(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)\s*$/);
    if (coordMatch) {
        const lat = parseFloat(coordMatch[1]);
        const lon = parseFloat(coordMatch[2]);
        if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
            console.log(`Coordinate match found: ${lat}, ${lon}`);
            clearSearchResults();
            if (mapRef.current) {
                mapRef.current.flyTo([lat, lon], 15);
                // Add marker for coordinate result, but don't open popup
                const marker = L.marker([lat, lon]).addTo(mapRef.current)
                    .bindPopup(`Coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)}`); // Removed .openPopup()
                setCurrentSearchMarker(marker);
            }
            return; // Stop processing
        }
    }

    // If not coordinates, proceed
    clearSearchResults(); // Clear previous non-coord results

    // Step 2: Perform Internal Data Search
    const internalResults = searchInternalLayers(searchTerm);

    // Step 3: Perform Geocoding Search (will call displayCombinedResults in callback)
    performGeocoding(searchTerm, internalResults);

  }, [mapRef, clearSearchResults, searchInternalLayers, performGeocoding]); // Dependencies
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

// --- NEW Helper Functions for Hierarchical Checkbox State ---

type CheckState = 'checked' | 'indeterminate' | 'unchecked';

// Recursively finds a node and updates the checkState of all its descendants
const updateDescendantStates = (
  items: SidebarItemData[],
  targetId: string,
  newCheckState: CheckState
): SidebarItemData[] => {

  const updateRecursively = (nodes: SidebarItemData[], isDescendantOfTarget: boolean): SidebarItemData[] => {
    return nodes.map(node => {
      let children = node.items ?? node.subItems ?? node.subSubItems;
      let currentlyIsDescendant = isDescendantOfTarget;

      // If this node is the target, mark its children as descendants
      if (node.id === targetId) {
        currentlyIsDescendant = true;
        // Update the target node itself
        const updatedNode = { ...node, checkState: newCheckState };
        const updatedChildren = children ? updateRecursively(children, currentlyIsDescendant) : undefined;
        // Reconstruct node
        if (updatedNode.items) updatedNode.items = updatedChildren;
        else if (updatedNode.subItems) updatedNode.subItems = updatedChildren;
        else if (updatedNode.subSubItems) updatedNode.subSubItems = updatedChildren;
        return updatedNode;
      }

      // If this node is a descendant, update its state
      if (currentlyIsDescendant) {
         const updatedNode = { ...node, checkState: newCheckState };
         const updatedChildren = children ? updateRecursively(children, currentlyIsDescendant) : undefined;
         // Reconstruct node
         if (updatedNode.items) updatedNode.items = updatedChildren;
         else if (updatedNode.subItems) updatedNode.subItems = updatedChildren;
         else if (updatedNode.subSubItems) updatedNode.subSubItems = updatedChildren;
         return updatedNode;
      }

      // Otherwise, just recurse on children without changing current node state
      const updatedChildren = children ? updateRecursively(children, currentlyIsDescendant) : undefined;
      if (updatedChildren && updatedChildren !== children) {
          const updatedNode = { ...node };
          if (updatedNode.items) updatedNode.items = updatedChildren;
          else if (updatedNode.subItems) updatedNode.subItems = updatedChildren;
          else if (updatedNode.subSubItems) updatedNode.subSubItems = updatedChildren;
          return updatedNode;
      }

      // If no changes below, return original node
      return node;
    });
  };

  return updateRecursively(items, false); // Start recursion, not initially a descendant
};


// Calculates and applies the correct checkState to all parent nodes based on children
// Returns the updated array of items
const calculateAndApplyCheckStates = (items: SidebarItemData[]): SidebarItemData[] => {
    const calculateNodeState = (node: SidebarItemData): SidebarItemData => {
        let children = node.items ?? node.subItems ?? node.subSubItems;

        if (!children || children.length === 0) {
            // Leaf node: state is already set (should be checked/unchecked), just return it
            // Ensure leaf nodes are never indeterminate
            return { ...node, checkState: node.checkState === 'indeterminate' ? 'unchecked' : node.checkState };
        }

        // Recursively ensure children states are calculated first
        const updatedChildren = children.map(child => calculateNodeState(child));

        // Determine parent state based on updated children
        const numChildren = updatedChildren.length;
        const numChecked = updatedChildren.filter(c => c.checkState === 'checked').length;
        const numIndeterminate = updatedChildren.filter(c => c.checkState === 'indeterminate').length;

        let newCheckState: CheckState;
        if (numIndeterminate > 0 || (numChecked > 0 && numChecked < numChildren)) {
            newCheckState = 'indeterminate';
        } else if (numChecked === numChildren) {
            newCheckState = 'checked';
        } else { // numChecked === 0
            newCheckState = 'unchecked';
        }

        // Return the node with potentially updated children and its calculated state
        const updatedNode = { ...node, checkState: newCheckState };
         if (updatedNode.items) updatedNode.items = updatedChildren;
         else if (updatedNode.subItems) updatedNode.subItems = updatedChildren;
         else if (updatedNode.subSubItems) updatedNode.subSubItems = updatedChildren;
         return updatedNode;
    };

    // Apply calculation to all top-level items
    return items.map(item => calculateNodeState(item));
};

// Helper to find a specific item by ID
const findItemById = (items: SidebarItemData[], id: string): SidebarItemData | null => {
    for (const item of items) {
        if (item.id === id) {
            return item;
        }
        const children = item.items ?? item.subItems ?? item.subSubItems;
        if (children) {
            const found = findItemById(children, id);
            if (found) return found;
        }
    }
    return null;
};

// Helper to update a single item's state
const updateSingleItemState = (
    items: SidebarItemData[],
    id: string,
    newCheckState: CheckState
): SidebarItemData[] => {
    return items.map(item => {
        if (item.id === id) {
            // Ensure leaf nodes don't become indeterminate directly
            const children = item.items ?? item.subItems ?? item.subSubItems;
            const finalState = (!children || children.length === 0) && newCheckState === 'indeterminate'
                                ? 'unchecked' // Or decide based on previous state? Defaulting to unchecked.
                                : newCheckState;
            return { ...item, checkState: finalState };
        }
        let children = item.items ?? item.subItems ?? item.subSubItems;
        if (children) {
            const updatedChildren = updateSingleItemState(children, id, newCheckState);
            if (updatedChildren !== children) {
                 const updatedNode = { ...item };
                 if (updatedNode.items) updatedNode.items = updatedChildren;
                 else if (updatedNode.subItems) updatedNode.subItems = updatedChildren;
                 else if (updatedNode.subSubItems) updatedNode.subSubItems = updatedChildren;
                 return updatedNode;
            }
        }
        return item;
    });
};

// --- END NEW Helper Functions ---


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

  // Rewritten handler for hierarchical checkbox logic
  const handleSidebarToggleCheck = useCallback((id: string) => {
    setSidebarSections(currentSections => {
      const clickedItem = findItemById(currentSections, id);
      if (!clickedItem) return currentSections; // Item not found

      let intermediateState: SidebarItemData[];
      const children = clickedItem.items ?? clickedItem.subItems ?? clickedItem.subSubItems;
      const isParent = children && children.length > 0;

      if (isParent) {
        // Parent node clicked: Update all descendants
        const newStateForChildren: CheckState = clickedItem.checkState === 'checked' ? 'unchecked' : 'checked';
        intermediateState = updateDescendantStates(currentSections, id, newStateForChildren);
      } else {
        // Leaf node clicked: Toggle its state
        const newChildState: CheckState = clickedItem.checkState === 'checked' ? 'unchecked' : 'checked';
        intermediateState = updateSingleItemState(currentSections, id, newChildState);
      }

      // After any change, recalculate states for the entire tree
      const finalState = calculateAndApplyCheckStates(intermediateState);
      console.log(`Item ${id} toggled. Recalculating states.`);
      // TODO: Trigger side effects based on the finalState if needed
      return finalState;
    });
  }, []); // Dependencies: updateDescendantStates, updateSingleItemState, calculateAndApplyCheckStates, findItemById (implicitly stable)

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
        <SearchBar onSearch={handleSearch} />
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