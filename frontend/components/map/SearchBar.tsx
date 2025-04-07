import React, { useState, KeyboardEvent } from 'react'; // Import useState and KeyboardEvent
import styles from './SearchBar.module.css';
import { FaSearch } from 'react-icons/fa'; // Example icon

// Define props interface
interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}
const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch(searchTerm);
    }
  };

  return (
    <div className={styles.searchContainer}>
      <FaSearch
        className={styles.searchIcon}
        onClick={() => onSearch(searchTerm)} // Add onClick handler
      />
      <input
        type="text"
        placeholder="Search locations, data, etc..."
        className={styles.searchInput}
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown} // Trigger search on Enter
      />
    </div>
  );
};

export default SearchBar;