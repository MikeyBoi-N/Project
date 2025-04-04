import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../styles/Layout.module.css'; // Adjust path if needed

const Sidebar: React.FC = () => {
  const router = useRouter();

  // Define sidebar links based on the screenshot/Figma
  // Using placeholder paths for now
  // Navigation items removed as per requirement to move them to header dropdown.
  // Sidebar structure remains for potential future use.
  const navItems: { name: string; path: string }[] = [];

  return (
    <nav className={styles.sidebar}>
      {navItems.map((item) => {
        const isActive = router.pathname === item.path;
        // Apply active style if the current route matches the item's path
        const linkClassName = isActive
          ? `${styles.sidebarLink} ${styles.sidebarLinkActive}`
          : styles.sidebarLink;

        return (
          <Link href={item.path} key={item.name} className={linkClassName}>
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default Sidebar;