import React from 'react';
import styles from './SearchBar.module.css';
import { FaSearch } from 'react-icons/fa'; // Example icon

const SearchBar: React.FC = () => {
  return (
    <div className={styles.searchContainer}>
      <FaSearch className={styles.searchIcon} />
      <input
        type="text"
        placeholder="Search locations, data, etc..."
        className={styles.searchInput}
      />
    </div>
  );
};

export default SearchBar;