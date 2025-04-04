import React, { useState } from 'react';
import styles from './FilterTabs.module.css';

const TABS = ["Aircraft", "Vessels", "Tanks", "Oil Rigs", "SUV", "Pedestrian", "Trains", "Hangar"];

const FilterTabs: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>(TABS[0]); // Default to "Aircraft"

    return (
        <div className={styles.tabsContainer}>
            {TABS.map((tabName) => (
                <button
                    key={tabName}
                    className={`${styles.tabButton} ${activeTab === tabName ? styles.active : ''}`}
                    onClick={() => setActiveTab(tabName)}
                >
                    {tabName}
                </button>
            ))}
        </div>
    );
};

export default FilterTabs;