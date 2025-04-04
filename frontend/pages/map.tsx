import React from 'react';
import Layout from '../components/layout/Layout'; // Adjust path if needed
import dynamic from 'next/dynamic';
// Import map-specific styles if needed later
// import styles from '../styles/Map.module.css';

// Dynamically import the map component to avoid SSR issues with Leaflet
const SharedMapComponent = dynamic(
  () => import('../components/map/SharedMapComponent'),
  { ssr: false }
);

const MapPage: React.FC = () => {
  return (
    <Layout title="Map Suite - Selkie">
      {/* Main container for the map page content. It will grow due to Layout.module.css changes */}
      {/* The SharedMapComponent itself will be styled to fill this container */}
      <SharedMapComponent />

      {/* Overlay elements remain absolutely positioned relative to the parent (.pageContent) */}

      {/* Placeholder for Search Bar */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px', // Position relative to the pageContent area
        zIndex: 2, // Above map
        backgroundColor: 'rgba(217, 217, 217, 0.8)', // Match Figma Rectangle 7
        padding: '10px 15px',
        borderRadius: '16.5px', // Match Figma Rectangle 7
        color: '#333',
        fontFamily: 'Anonymous Pro, monospace',
        fontSize: '16px',
      }}>
        Search Placeholder
      </div>

      {/* Placeholder for Map Context Window */}
      <div style={{
        position: 'absolute',
        top: '70px', // Below search bar
        left: '20px',
        zIndex: 2, // Above map
        width: '250px', // Approximate width
        backgroundColor: 'rgba(217, 217, 217, 0.8)', // Match Figma Rectangle 7
        padding: '15px',
        borderRadius: '16.5px', // Match Figma Rectangle 7
        color: '#333',
        fontFamily: 'Inter, sans-serif',
      }}>
        <h3 style={{ marginTop: 0, fontFamily: 'Inter', fontWeight: 600, fontSize: '16px', color: 'rgba(0, 0, 0, 0.72)' }}>
          This area
        </h3>
        <p>Context Window Placeholder</p>
        {/* Add placeholder list items later */}
      </div>

      {/* Placeholder for Map Controls (Zoom, etc.) */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        zIndex: 2, // Above map
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
      }}>
        <div style={{ padding: '5px', backgroundColor: '#000', borderRadius: '8px', color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center' }}>+</div>
        <div style={{ padding: '5px', backgroundColor: '#000', borderRadius: '8px', color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center' }}>-</div>
      </div>

    </Layout>
  );
};

export default MapPage;