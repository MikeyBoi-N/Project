import React, { useState, useRef, useCallback } from 'react'; // Added useState, useRef, useCallback
import Layout from '../components/layout/Layout';
import dynamic from 'next/dynamic';
import styles from '../styles/MapPage.module.css'; // Import map page styles
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

const MapPage: React.FC = () => {
  // State for the currently selected map style
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(defaultStyleOption);
  // Ref to hold the Leaflet map instance
  const mapRef = useRef<Map | null>(null);

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
    <Layout title="Map Suite - Selkie">
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

export default MapPage;