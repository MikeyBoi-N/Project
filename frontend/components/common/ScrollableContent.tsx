import React, { ReactNode } from 'react';
import styles from '../../styles/ScrollableContent.module.css'; // Adjust path if needed

interface ScrollableContentProps {
  children: ReactNode;
  className?: string; // Add optional className prop
}

const ScrollableContent: React.FC<ScrollableContentProps> = ({ children, className }) => {
  // Apply global class, module class, and passed class
  const combinedClassName = `globalScrollableContainer ${styles.scrollableContainer} ${className || ''}`.trim();

  return (
    <div className={combinedClassName}>
      {children}
    </div>
  );
};

export default ScrollableContent;