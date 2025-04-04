import React, { useState } from 'react';
import styles from '../../styles/MapPage.module.css'; // Assuming styles will be added here

interface FilterButtonsProps {
    // Define any props if needed, e.g., initial filters, callback on change
}

const filterOptions = ["Aircraft", "Vessels", "Tanks", "Personnel", "Structures", "Vehicles", "Buildings", "Infrastructure"]; // Example filters

const FilterButtons: React.FC<FilterButtonsProps> = () => {
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    const handleFilterClick = (filter: string) => {
        setSelectedFilters(prevSelected =>
            prevSelected.includes(filter)
                ? prevSelected.filter(f => f !== filter) // Deselect if already selected
                : [...prevSelected, filter] // Select if not selected
        );
        // Optional: Add callback here to notify parent component of filter changes
        // console.log("Selected filters:", selectedFilters); // For debugging
    };

    return (
        <div className={styles.filterButtonsContainer}>
            {filterOptions.map(filter => (
                <button
                    key={filter}
                    className={`${styles.filterButton} ${selectedFilters.includes(filter) ? styles.selected : ''}`}
                    onClick={() => handleFilterClick(filter)}
                >
                    {filter}
                </button>
            ))}
        </div>
    );
};

export default FilterButtons;