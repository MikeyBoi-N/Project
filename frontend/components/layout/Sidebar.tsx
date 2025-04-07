import React from 'react'; // Removed useState, useCallback as they are not used internally here
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
  onToggleOpen: (id: string) => void;
  onToggleCheck: (id: string) => void;
  onInputChange: (id: string, value: string) => void;
  // Add any other props the Layout component expects to pass down, if necessary
  // For now, assuming these are the core props based on the Testing Grounds logic
  // Add handlers for save/load if they are managed by the parent and passed down
  onSaveFilters?: () => void;
  onLoadFilters?: () => void;
}


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
  onToggleOpen,
  onToggleCheck,
  onInputChange,
  onSaveFilters, // Receive save handler
  onLoadFilters, // Receive load handler
}) => {
  // Note: The state management (useState, useCallback for handlers)
  // should reside in the parent component (e.g., DjinnPage or Layout)
  // This component just receives the data and handlers as props.

  return (
    // Using layout sidebar CSS module class names
    <aside className={styles.sidebarContainer}>
       {/* Optional: Add a title or header if the layout sidebar needs one */}
       {/* <h2 className={styles.sidebarTitle}>Layers & Filters</h2> */}
      {sections.map(section => (
        <SidebarItem
          key={section.id}
          item={section}
          level={0} // Top-level items are level 0
          onToggleOpen={onToggleOpen}
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