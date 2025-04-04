import React, { useState, useEffect, ReactNode } from 'react';
import { ResizableBox, ResizeCallbackData } from 'react-resizable';
import { useRouter } from 'next/router';
import styles from '../../styles/Layout.module.css'; // Adjust path if needed
import ScrollableContent from '../common/ScrollableContent'; // Import the new component
import SidebarItem from '../common/SidebarItem'; // Import the new item component

// Import default styles for react-resizable
// It's often better to import this in a global CSS file (_app.tsx)
// but for simplicity here, we'll assume it's handled or add it later if needed.
// import 'react-resizable/css/styles.css'; // We'll add this styling to Layout.module.css instead

const SIDEBAR_WIDTH_STORAGE_KEY = 'sidebarWidth';
const DEFAULT_SIDEBAR_WIDTH = 450;
const MIN_SIDEBAR_WIDTH = 150;
const MAX_SIDEBAR_WIDTH = 1000; // Updated max width

const Sidebar: React.FC = () => {
  const router = useRouter();
  const [width, setWidth] = useState<number>(DEFAULT_SIDEBAR_WIDTH);

  // Load initial width from localStorage
  useEffect(() => {
    const savedWidth = localStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY);
    if (savedWidth) {
      const parsedWidth = parseInt(savedWidth, 10);
      if (!isNaN(parsedWidth) && parsedWidth >= MIN_SIDEBAR_WIDTH && parsedWidth <= MAX_SIDEBAR_WIDTH /* Use literal here or ensure constant is updated */) { // Adjusted max width check
        setWidth(parsedWidth);
      }
    }
  }, []);

  // Save width to localStorage on change
  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, String(width));
  }, [width]);

  const onResize: (event: React.SyntheticEvent, data: ResizeCallbackData) => void = (event, { size }) => {
    // Ensure width stays within bounds during resize
    const newWidth = Math.max(MIN_SIDEBAR_WIDTH, Math.min(size.width, MAX_SIDEBAR_WIDTH /* Use literal here or ensure constant is updated */)); // Adjusted max width constraint
    setWidth(newWidth);
  };

  // Define sidebar links (empty as per original)
  const navItems: { name: string; path: string }[] = [];

  // Placeholder content wrapped in SidebarItem
  const placeholderContent = Array.from({ length: 30 }, (_, i) => (
    <SidebarItem key={i}>
      <p style={{ margin: '0', padding: '0' }}> {/* Remove default p margins */}
        Scrollable Item {i + 1}
      </p>
    </SidebarItem>
  ));

  return (
    <ResizableBox
      width={width}
      height={Infinity} // Let the container control the height
      axis="x" // Allow resizing horizontally
      minConstraints={[MIN_SIDEBAR_WIDTH, Infinity]}
      maxConstraints={[MAX_SIDEBAR_WIDTH, Infinity]} // Updated max width constraint directly
      handle={<span className={styles.customResizeHandle} />} // Custom handle style
      resizeHandles={['e']} // Show handle on the east (right) side
      onResize={onResize}
      className={styles.sidebarResizableContainer} // Add a class for potential styling
    >
      {/* The actual sidebar nav element */}
      <nav className={styles.sidebar} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
        {/* Use the reusable ScrollableContent component */}
        <ScrollableContent className={styles.sidebarScrollableArea}>
          {/* Wrap nav items */}
          {navItems.map((item) => {
            const isActive = router.pathname === item.path;
            const linkClassName = isActive
              ? `${styles.sidebarLink} ${styles.sidebarLinkActive}`
              : styles.sidebarLink;

            return (
              <SidebarItem key={item.name}>
                <a href={item.path} className={linkClassName}> {/* Use <a> for simplicity */}
                  {item.name}
                </a>
              </SidebarItem>
            );
          })}
          {/* Add Placeholder Content */}
          {/* Wrap other content */}
          <SidebarItem>
            <h3>Sidebar Content</h3>
          </SidebarItem>
          {placeholderContent}
        </ScrollableContent>
      </nav>
    </ResizableBox>
  );
};

export default Sidebar;