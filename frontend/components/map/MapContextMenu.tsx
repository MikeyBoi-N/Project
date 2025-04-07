import React from 'react';
import styles from './MapContextMenu.module.css';
import { LatLng } from 'leaflet';
import { FaCopy, FaRulerHorizontal, FaMapMarkerAlt, FaClock } from 'react-icons/fa'; // Import icons

interface MapContextMenuProps {
  top: number;
  left: number;
  isVisible: boolean;
  latLng: LatLng | null;
  onClose: () => void;
  onCopyCoords: (latLng: LatLng) => void;
  onMeasureDistance: (latLng: LatLng) => void;
  onAddPoint: (latLng: LatLng) => void;
  onGenerateIsochrone: (latLng: LatLng) => void; // Placeholder action
}

const MapContextMenu: React.FC<MapContextMenuProps> = ({
  top,
  left,
  isVisible,
  latLng,
  onClose,
  onCopyCoords,
  onMeasureDistance,
  onAddPoint,
  onGenerateIsochrone,
}) => {
  if (!isVisible || !latLng) {
    return null;
  }

  const handleActionClick = (action: (latLng: LatLng) => void) => {
    action(latLng);
    onClose(); // Close menu after action
  };

  // Prevent context menu event from bubbling up from our custom menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className={styles.contextMenu}
      style={{ top: `${top}px`, left: `${left}px` }}
      onContextMenu={handleContextMenu} // Prevent nested context menus
    >
      <ul>
        <li onClick={() => handleActionClick(onCopyCoords)}>
          <FaCopy className={styles.menuIcon} /> Copy Coordinates
        </li>
        <li onClick={() => handleActionClick(onMeasureDistance)}>
          <FaRulerHorizontal className={styles.menuIcon} /> Measure Distance
        </li>
        <li onClick={() => handleActionClick(onAddPoint)}>
          <FaMapMarkerAlt className={styles.menuIcon} /> Add Point
        </li>
        <li className={styles.disabled} onClick={() => handleActionClick(onGenerateIsochrone)}> {/* Mark as disabled for now */}
          <FaClock className={styles.menuIcon} /> Generate Isochrone (WIP)
        </li>
      </ul>
    </div>
  );
};

export default MapContextMenu;