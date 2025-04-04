import { useAuth } from '../context/AuthContext'; // Import useAuth
import React, { useState, useRef, useCallback, useEffect } from 'react'; // Added useEffect
import Layout from '../components/layout/Layout';
import dynamic from 'next/dynamic';
import styles from '../styles/MapPage.module.css'; // Keep using MapPage styles for now, can be refactored later if needed
import { styleOptions } from '../components/map/LayersMenu'; // Import styleOptions array
import LayersMenu, { defaultStyleOption, StyleOption } from '../components/map/LayersMenu'; // Import LayersMenu and types
import { FaPlus, FaMinus, FaCompass, FaClock } from 'react-icons/fa'; // Import icons
import type { Map } from 'leaflet'; // Import Leaflet Map type for ref
import FilterButtons from '../components/map/FilterButtons'; // Import FilterButtons
import SearchBar from '../components/map/SearchBar'; // Import SearchBar
import ContextWindowPlaceholder from '../components/map/ContextWindowPlaceholder'; // Import Placeholder
// Dynamically import the map component to avoid SSR issues with Leaflet
const SharedMapComponent = dynamic(
  () => import('../components/map/SharedMapComponent'),
  { ssr: false }
);

const DjinnPage: React.FC = () => { // Renamed from MapPage
  // State for the currently selected map style
  const { isGuest } = useAuth(); // Get guest status
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(defaultStyleOption);
  // Ref to hold the Leaflet map instance
  const mapRef = useRef<Map | null>(null);

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


  return (
    <Layout title="Djinn Suite - Selkie"> {/* Updated title */}
      {/* Pass selected style and mapRef to the map component */}
      {/* Ensure SharedMapComponent is updated to accept these props */}
      <SharedMapComponent
        tileLayerInfo={selectedStyle}
        mapRef={mapRef}
      />

      {/* --- Overlays --- */}
      {/* Individual Overlay Components */}
      <div className={styles.filterButtonsOverlay}>
        <FilterButtons />
      </div>
      <div className={styles.searchBarOverlay}>
        <SearchBar />
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