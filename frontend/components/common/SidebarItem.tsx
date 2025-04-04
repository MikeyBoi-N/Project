import React, { ReactNode } from 'react';
import styles from '../../styles/SidebarItem.module.css';

interface SidebarItemProps {
  children: ReactNode;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ children }) => {
  return (
    <div className={styles.itemContainer}>
      {children}
    </div>
  );
};

export default SidebarItem;