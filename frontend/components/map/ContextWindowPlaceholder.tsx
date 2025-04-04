import React from 'react';
import styles from './ContextWindowPlaceholder.module.css'; // We'll create this CSS module next

const ContextWindowPlaceholder: React.FC = () => {
  return (
    <div className={styles.placeholder}>
      {/* Placeholder content can be added here if needed */}
      <span>Context Window Placeholder</span>
    </div>
  );
};

export default ContextWindowPlaceholder;