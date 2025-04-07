import React, { useState, useCallback } from 'react'; // Add useState and useCallback
import styles from './Sidebar.module.css'; // Import CSS module for layout sidebar

// --- TypeScript Interfaces ---

// Interface for the data structure of a single sidebar item
export interface SidebarItemData {
  id: string;
  title: string;
  isChecked: boolean;
  isOpen?: boolean; // Top-level items might use this
  isSubOpen?: boolean; // Nested items might use this
  items?: SidebarItemData[]; // For top-level children
  subItems?: SidebarItemData[]; // For first level nesting
  subSubItems?: SidebarItemData[]; // For second level nesting
  hasInput?: boolean;
  inputValue?: number | string; // Allow string for input state, convert on change
  hasPicker?: boolean;
  hasSlider?: boolean;
}

// Props for the SidebarItem component
interface SidebarItemProps {
  item: SidebarItemData;
  level?: number;
  onToggleOpen: (id: string) => void;
  onToggleCheck: (id: string) => void;
  onInputChange: (id: string, value: string) => void; // Input value is string
}

// Props for the main Sidebar component - Adjusted to match expected props in Layout/DjinnPage
export interface SidebarProps {
  sections: SidebarItemData[]; // Renamed from sidebarProps in Layout to sections for consistency
  onToggleCheck: (id: string) => void;
  onInputChange: (id: string, value: string) => void;
  // Add any other props the Layout component expects to pass down, if necessary
  // For now, assuming these are the core props based on the Testing Grounds logic
  // Add handlers for save/load if they are managed by the parent and passed down
  onSaveFilters?: () => void;
  onLoadFilters?: () => void;
}


// --- Sample Data Structure (Illustrative) ---
// This structure demonstrates how the data for the new sidebar items
// should be organized. In a real application, this data would typically
// be managed by a parent component (like DjinnPage or Layout) and passed
// down via the 'sections' prop.

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


// --- Sidebar Item Component ---

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  level = 0,
  onToggleOpen,
  onToggleCheck,
  onInputChange,
}) => {
  // Determine if the item has any children in any of the possible arrays
  const hasChildren = (item.items && item.items.length > 0) ||
                      (item.subItems && item.subItems.length > 0) ||
                      (item.subSubItems && item.subSubItems.length > 0);

  // Determine if the item is currently open
  const isOpen = item.isOpen ?? item.isSubOpen ?? false; // Use nullish coalescing

  // Determine which array holds the children, default to empty array if none
  let childItems: SidebarItemData[] = [];
  if (item.items) childItems = item.items;
  else if (item.subItems) childItems = item.subItems;
  else if (item.subSubItems) childItems = item.subSubItems;

  // --- Event Handlers ---

  const handleToggleCheck = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation(); // Prevent triggering open/close
    onToggleCheck(item.id);
  };

  const handleToggleOpen = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only toggle open/close if clicking the header itself or title/arrow
     if (e.target === e.currentTarget ||
         (e.target as HTMLElement).classList.contains(styles.sidebarItemTitle) ||
         (e.target as HTMLElement).classList.contains(styles.sidebarItemToggle) ) {
        if (hasChildren) {
            onToggleOpen(item.id);
        }
     }
  };

  const handleInputChangeInternal = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Prevent header click
    onInputChange(item.id, e.target.value);
  };

  // Stop propagation for placeholder clicks
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  // --- Render ---

  return (
    // Using layout sidebar CSS module class names
    <div className={`${styles.sidebarItem} ${styles[`level-${level}`] ?? ''}`}>
      <div className={styles.sidebarItemHeader} onClick={handleToggleOpen}>
        {/* Custom Checkbox */}
        <span
          className={`${styles.customCheckbox} ${item.isChecked ? styles.checked : ''}`}
          onClick={handleToggleCheck}
          role="checkbox"
          aria-checked={item.isChecked}
          aria-labelledby={`title-${item.id}`} // Accessibility
        ></span>

        {/* Item Title */}
        <span id={`title-${item.id}`} className={styles.sidebarItemTitle}>{item.title}</span>

        {/* Confidence Score Input */}
        {item.hasInput && (
          <div className={styles.confidenceContainer} onClick={stopPropagation}>
            <input
              type="number"
              className={styles.confidenceInput}
              value={item.inputValue ?? ''} // Use empty string if undefined
              onChange={handleInputChangeInternal}
              min="0"
              max="100"
              step="1"
              aria-label={`Confidence score for ${item.title}`} // Accessibility
            />
          </div>
        )}

        {/* Theme Picker Placeholder */}
        {item.hasPicker && (
          <div
            className={styles.themePickerPlaceholder}
            onClick={stopPropagation}
            role="button"
            aria-label={`Theme picker for ${item.title}`} // Accessibility
          >
            {/* Placeholder visual */}
          </div>
        )}

        {/* Opacity Slider Placeholder */}
        {item.hasSlider && (
          <div
            className={styles.opacitySliderPlaceholder}
            onClick={stopPropagation}
            role="slider" // Consider a more interactive element later
            aria-label={`Opacity slider for ${item.title}`} // Accessibility
          >
            {/* Placeholder visual */}
          </div>
        )}

        {/* Toggle Arrow */}
        {hasChildren && (
          <span
            className={`${styles.sidebarItemToggle} ${isOpen ? styles.open : ''}`}
            aria-hidden="true" // Decorative element
            onClick={(e) => { // Allow clicking arrow specifically to toggle
                e.stopPropagation();
                handleToggleOpen(e as any); // Cast needed as it expects div event
            }}
          >
            {'>'}
          </span>
        )}
      </div>

      {/* Nested Items */}
      {hasChildren && isOpen && (
        <div className={styles.sidebarItemContent}>
          {childItems.map(child => (
            <SidebarItem
              key={child.id}
              item={child}
              level={level + 1}
              onToggleOpen={onToggleOpen}
              onToggleCheck={onToggleCheck}
              onInputChange={onInputChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};


// --- Main Sidebar Component ---

const Sidebar: React.FC<SidebarProps> = ({
  sections,
  onToggleCheck,
  onInputChange,
  onSaveFilters, // Receive save handler
  onLoadFilters, // Receive load handler
}) => {
  const [sidebarData, setSidebarData] = useState<SidebarItemData[]>(sampleSidebarStructure);

  // Recursive function to toggle the open state of an item by ID
  const findAndToggleOpen = (items: SidebarItemData[], id: string): SidebarItemData[] => {
    return items.map(item => {
      if (item.id === id) {
        // Determine which open state property to toggle
        const isOpenKey = item.items ? 'isOpen' : 'isSubOpen'; // Adjust based on your structure if needed
        return { ...item, [isOpenKey]: !item[isOpenKey] };
      }
      // Recursively search in children
      let children: SidebarItemData[] | undefined;
      if (item.items) children = item.items;
      else if (item.subItems) children = item.subItems;
      else if (item.subSubItems) children = item.subSubItems;

      if (children) {
        const updatedChildren = findAndToggleOpen(children, id);
        if (updatedChildren !== children) { // Only update if a child was changed
           if (item.items) return { ...item, items: updatedChildren };
           if (item.subItems) return { ...item, subItems: updatedChildren };
           if (item.subSubItems) return { ...item, subSubItems: updatedChildren };
        }
      }
      return item; // No change
    });
  };

  const handleToggleOpen = useCallback((id: string) => {
    setSidebarData(currentData => findAndToggleOpen(currentData, id));
  }, []); // No dependencies needed as findAndToggleOpen is stable


  // Note: The state management (useState, useCallback for handlers)
  // should reside in the parent component (e.g., DjinnPage or Layout)
  // This component just receives the data and handlers as props.

  return (
    // Using layout sidebar CSS module class names
    <aside className={styles.sidebarContainer}>
       {/* Optional: Add a title or header if the layout sidebar needs one */}
       {/* <h2 className={styles.sidebarTitle}>Layers & Filters</h2> */}
      {sidebarData.map(section => (
        <SidebarItem
          key={section.id}
          item={section}
          level={0} // Top-level items are level 0
          onToggleOpen={handleToggleOpen}
          onToggleCheck={onToggleCheck}
          onInputChange={onInputChange}
        />
      ))}
       {/* Render Save/Load buttons if handlers are provided */}
       {(onSaveFilters || onLoadFilters) && (
         <div className={styles.filterActions}>
           {onSaveFilters && <button onClick={onSaveFilters}>Save Filters</button>}
           {onLoadFilters && <button onClick={onLoadFilters}>Load Filters</button>}
         </div>
       )}
    </aside>
  );
};

export default Sidebar; // Export the main component