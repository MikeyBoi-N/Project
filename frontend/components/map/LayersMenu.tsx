import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image'; // Import next/image
import styles from './LayersMenu.module.css';
import { FaLayerGroup } from 'react-icons/fa'; // Layers icon

// Define the structure for a style option
export interface StyleOption {
    name: string;
    imageSrc: string; // Changed from color to imageSrc
    url: string; // TileLayer URL
    attribution: string;
}

// Define the available style options based on Figma colors and placeholders
const styleOptions: StyleOption[] = [
    { name: 'Dark', imageSrc: '/images/map/style_preview_1.png', url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>' },
    { name: 'Ocean', imageSrc: '/images/map/style_preview_2.png', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }, // Placeholder: OSM
    { name: 'Satellite', imageSrc: '/images/map/style_preview_3.png', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community' },
    { name: 'Infrared', imageSrc: '/images/map/style_preview_4.png', url: 'https://{s}.basemaps.cartocdn.com/rastertiles/positron/{z}/{x}/{y}{r}.png', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>' }, // Placeholder: Carto Positron
    { name: 'Night', imageSrc: '/images/map/style_preview_5.png', url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>' }, // Placeholder: Carto Dark
    { name: 'Terrain', imageSrc: '/images/map/style_preview_6.png', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }, // Placeholder: OSM
];

interface LayersMenuProps {
    selectedStyle: StyleOption;
    onStyleChange: (style: StyleOption) => void;
}

const LayersMenu: React.FC<LayersMenuProps> = ({ selectedStyle, onStyleChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    // Placeholder state for toggles - functionality deferred
    const [showLabels, setShowLabels] = useState(true);
    const [showRoads, setShowRoads] = useState(true);
    const [showBorders, setShowBorders] = useState(true);

    console.log("LayersMenu RENDERED, isOpen:", isOpen); // Log state on render

    const toggleMenu = () => {
        console.log("toggleMenu CALLED, current isOpen:", isOpen); // Log click handler call
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Check if the click is outside the menu container
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                // Only close if the menu is currently open
                if (isOpen) {
                    console.log("handleClickOutside DETECTED, closing menu."); // Log outside click
                    setIsOpen(false);
                }
            }
        };

        // Add listener only when the menu is open
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Cleanup function to remove the listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]); // Re-run effect if isOpen changes


    const handleStyleSelect = (style: StyleOption) => {
        onStyleChange(style);
        // Optionally close menu on selection: setIsOpen(false);
    };

    return (
        <div className={styles.layersMenuContainer} ref={menuRef}>
            {/* Collapsed state: Image Button */}
            {!isOpen && (
                <button
                    className={styles.layersButton}
                    onClick={toggleMenu}
                    aria-label="Toggle Layers Menu"
                    aria-expanded={isOpen}
                >
                    <Image
                        src={selectedStyle.imageSrc} // Dynamically set src based on selected style
                        alt={`Selected map style: ${selectedStyle.name}`} // Dynamic alt text
                        width={60} // Match Figma node 2040:212 size (adjust if needed)
                        height={60} // Match button CSS height
                        className={styles.layersButtonImage} // Add specific class for image styling if needed
                    />
                </button>
            )}

            {/* Panel is always rendered but visibility/appearance controlled by CSS */}
            <div className={`${styles.layersPanel} ${isOpen ? styles.panelOpen : ''}`}>
                {/* Style Selection */}
                <div className={styles.styleOptions}>
                    {styleOptions.map((style) => (
                        <div
                            key={style.name}
                            className={`${styles.stylePreview} ${selectedStyle.name === style.name ? styles.selected : ''}`}
                            // style removed, background handled by image
                            onClick={() => handleStyleSelect(style)}
                            title={style.name}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && handleStyleSelect(style)}
                        >
                            <Image
                                src={style.imageSrc}
                                alt={style.name}
                                width={60} // Adjust width as needed based on Figma/CSS
                                height={60} // Added required height prop
                                className={styles.previewImage} // Add class for styling
                            />
                            {/* Removed span with name, title attribute provides it */}
                        </div>
                    ))}
                </div>

                {/* Feature Toggles */}
                <div className={styles.togglesContainer}>
                    <div className={styles.toggleItem}>
                        <label htmlFor="labelsToggle">Labels</label>
                        <input
                            type="checkbox"
                            id="labelsToggle"
                            checked={showLabels}
                            onChange={(e) => setShowLabels(e.target.checked)}
                            // Disabled until functionality is implemented
                            disabled
                        />
                    </div>
                    <div className={styles.toggleItem}>
                        <label htmlFor="roadsToggle">Roads</label>
                        <input
                            type="checkbox"
                            id="roadsToggle"
                            checked={showRoads}
                            onChange={(e) => setShowRoads(e.target.checked)}
                            disabled // Disabled until functionality is implemented
                        />
                    </div>
                    <div className={styles.toggleItem}>
                        <label htmlFor="bordersToggle">Borders</label>
                        <input
                            type="checkbox"
                            id="bordersToggle"
                            checked={showBorders}
                            onChange={(e) => setShowBorders(e.target.checked)}
                            disabled // Disabled until functionality is implemented
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Export the default style option for initialization in the parent
export const defaultStyleOption = styleOptions[0];

export default LayersMenu;