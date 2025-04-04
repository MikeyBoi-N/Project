import React, { useState, useEffect, ReactNode, ChangeEvent } from 'react';
import { ResizableBox, ResizeCallbackData } from 'react-resizable';
import { useRouter } from 'next/router';
import styles from '../../styles/Layout.module.css'; // Adjust path if needed
import ScrollableContent from '../common/ScrollableContent'; // Import the new component
import SidebarItem from '../common/SidebarItem'; // Import the new item component

// Import default styles for react-resizable
// It's often better to import this in a global CSS file (_app.tsx)
// but for simplicity here, we'll assume it's handled or add it later if needed.
// import 'react-resizable/css/styles.css'; // We'll add this styling to Layout.module.css instead

const SIDEBAR_WIDTH_STORAGE_KEY = 'sidebarWidth';
const DEFAULT_SIDEBAR_WIDTH = 450;
const MIN_SIDEBAR_WIDTH = 150;
const MAX_SIDEBAR_WIDTH = 1000; // Updated max width

// Define Props interface for type safety and clarity
export interface SidebarProps {
  confidenceThreshold: number;
  visOptions: {
    colorByClass: boolean;
    showConfidence: boolean;
  };
  isGeoFilterActive: boolean;
  selectedDetection: object | null; // Data for the currently selected detection (display only)
  objectCount: number | null; // Count of currently visible objects (display only)
  onConfidenceChange: (event: ChangeEvent<HTMLInputElement>) => void; // Pass the event directly
  onVisOptionChange: (optionName: keyof SidebarProps['visOptions'], event: ChangeEvent<HTMLInputElement>) => void; // Pass the event directly
  onGeoFilterToggle: () => void;
  onSaveFilters?: () => void; // Added for saving filters
  onLoadFilters?: () => void; // Added for loading filters
}

const Sidebar: React.FC<SidebarProps> = ({
  confidenceThreshold,
  visOptions,
  isGeoFilterActive,
  selectedDetection,
  objectCount,
  onConfidenceChange,
  onVisOptionChange,
  onGeoFilterToggle,
  onSaveFilters, // Destructure new prop
  onLoadFilters, // Destructure new prop
}) => {
  const router = useRouter();
  const [width, setWidth] = useState<number>(DEFAULT_SIDEBAR_WIDTH);

  // State is now managed by the parent component and passed via props.
  // Local state for width remains.

  // --- Djinn Event Handlers ---

  const handleConfidenceChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Call the handler passed down from the parent
    onConfidenceChange(event);
  };

  const handleVisOptionChange = (optionName: keyof SidebarProps['visOptions'], event: ChangeEvent<HTMLInputElement>) => {
    // Call the handler passed down from the parent
    onVisOptionChange(optionName, event);
  };

  const handleGeoFilterToggle = () => {
    // Call the handler passed down from the parent
    onGeoFilterToggle();
  };
  // --- End Djinn ---

  // Load initial width from localStorage
  useEffect(() => {
    const savedWidth = localStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY);
    if (savedWidth) {
      const parsedWidth = parseInt(savedWidth, 10);
      if (!isNaN(parsedWidth) && parsedWidth >= MIN_SIDEBAR_WIDTH && parsedWidth <= MAX_SIDEBAR_WIDTH /* Use literal here or ensure constant is updated */) { // Adjusted max width check
        setWidth(parsedWidth);
      }
    }
  }, []);

  // Save width to localStorage on change
  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, String(width));
  }, [width]);

  const onResize: (event: React.SyntheticEvent, data: ResizeCallbackData) => void = (event, { size }) => {
    // Ensure width stays within bounds during resize
    const newWidth = Math.max(MIN_SIDEBAR_WIDTH, Math.min(size.width, MAX_SIDEBAR_WIDTH /* Use literal here or ensure constant is updated */)); // Adjusted max width constraint
    setWidth(newWidth);
  };

  // Define sidebar links (empty as per original)
  const navItems: { name: string; path: string }[] = [];

  // Placeholder content removed - Replaced with specific feature sections below

  return (
    <ResizableBox
      width={width}
      height={Infinity} // Let the container control the height
      axis="x" // Allow resizing horizontally
      minConstraints={[MIN_SIDEBAR_WIDTH, Infinity]}
      maxConstraints={[MAX_SIDEBAR_WIDTH, Infinity]} // Updated max width constraint directly
      handle={<span className={styles.customResizeHandle} />} // Custom handle style
      resizeHandles={['e']} // Show handle on the east (right) side
      onResize={onResize}
      className={styles.sidebarResizableContainer} // Add a class for potential styling
    >
      {/* The actual sidebar nav element */}
      <nav className={styles.sidebar} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
        {/* Use the reusable ScrollableContent component */}
        <ScrollableContent className={styles.sidebarScrollableArea}>
          {/* Wrap nav items */}
          {navItems.map((item) => {
            const isActive = router.pathname === item.path;
            const linkClassName = isActive
              ? `${styles.sidebarLink} ${styles.sidebarLinkActive}`
              : styles.sidebarLink;

            return (
              <SidebarItem key={item.name}>
                <a href={item.path} className={linkClassName}> {/* Use <a> for simplicity */}
                  {item.name}
                </a>
              </SidebarItem>
            );
          })}
          {/* Add Placeholder Content */}
          {/* --- Detection Filters --- */}
          <h3>Detection Filters</h3>

          {/* 2. Confidence Score Threshold */}
          <h4>Confidence Threshold</h4>
          <SidebarItem>
            <div>
              <label htmlFor="confidence-slider" style={{ marginRight: '8px' }}>Min Confidence:</label>
              <input
                type="range"
                id="confidence-slider"
                name="confidence"
                min="0"
                max="1"
                step="0.01"
                value={confidenceThreshold} // Use prop
                onChange={handleConfidenceChange}
                style={{ verticalAlign: 'middle', cursor: 'pointer' }}
              />
              {/* Display current value, formatted to 2 decimal places */}
              <span style={{ marginLeft: '8px', fontVariantNumeric: 'tabular-nums' }}>
                {typeof confidenceThreshold === 'number' ? confidenceThreshold.toFixed(2) : 'N/A'} {/* Use prop, added check */}
              </span>
            </div>
          </SidebarItem>

        {/* 5. Geographic Filtering */}
        <h4>Geographic Filter</h4>
        <SidebarItem>
            <button
              className={`${styles.sidebarButton} ${isGeoFilterActive ? styles.sidebarButtonActive : ''}`}
              onClick={handleGeoFilterToggle}
            >
              {isGeoFilterActive ? 'Cancel Area Draw' : 'Draw Area to Filter'} {/* Use prop */}
            </button>
        </SidebarItem>
          {/* --- Filter Presets --- */}
          {(onSaveFilters || onLoadFilters) && (
            <>
              <h3>Filter Presets</h3>
              <SidebarItem>
                {onSaveFilters && (
                  <button
                    className={styles.sidebarButton}
                    onClick={onSaveFilters}
                    style={{ marginRight: '8px' }} // Add some spacing
                  >
                    Save Current Filters
                  </button>
                )}
                {onLoadFilters && (
                  <button
                    className={styles.sidebarButton}
                    onClick={onLoadFilters}
                  >
                    Load Saved Filters
                  </button>
                )}
                )
            </SidebarItem>
          </>
        )}

          {/* --- Visualization Options --- */}
          <h3>Visualization Options</h3>

          {/* 3. Bounding Box Visualization Options */}
          <h4>Bounding Box Style</h4>
          <SidebarItem>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  style={{ marginRight: '4px', verticalAlign: 'middle' }}
                  checked={visOptions?.colorByClass ?? false} // Use prop, added check
                  onChange={(e) => handleVisOptionChange('colorByClass', e)}
                /> Color-code by Class
              </label>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  style={{ marginRight: '4px', verticalAlign: 'middle' }}
                  checked={visOptions?.showConfidence ?? false} // Use prop, added check
                  onChange={(e) => handleVisOptionChange('showConfidence', e)}
                /> Show Confidence Labels
              </label>
            </div>
          </SidebarItem>

          {/* --- Detection Info --- */}
          <h3>Detection Info</h3>

          {/* 6. Object Counting */}
          <h4>Visible Detections</h4>
          <SidebarItem>
              <p>Count: <span style={{ fontWeight: 'bold' }}>{objectCount ?? 'N/A'}</span></p> {/* Use prop */}
          </SidebarItem>

          {/* 4. Displaying Metadata (Selected Detection) */}
          <h4>Selected Detection</h4>
          <SidebarItem>
            {/* TODO: Populate this based on map selection event */}
            <div style={{ minHeight: '50px', border: '1px dashed #555', padding: '5px', background: '#2a2a2a', overflowWrap: 'break-word' }}>
              {selectedDetection ? ( /* Use prop */
                <pre style={{ margin: 0, fontSize: '0.8em', color: '#ddd', whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(selectedDetection, null, 2)}
                </pre>
              ) : (
                <p style={{ margin: 0, fontSize: '0.9em', color: '#aaa' }}>
                  [Select a detection on the map to see details]
                </p>
              )}
            </div>
          </SidebarItem>
        </ScrollableContent>
      </nav>
    </ResizableBox>
  );
};

export default Sidebar;