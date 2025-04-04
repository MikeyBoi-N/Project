import React, { ReactNode, useState, useEffect, useRef } from 'react'; // Added useState, useEffect, useRef
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image'; // Import Image component
import { useRouter } from 'next/router';
import Sidebar from './Sidebar'; // Import the Sidebar component
import { FaUserCircle, FaCog } from 'react-icons/fa';
import styles from '../../styles/Layout.module.css'; // Adjust path if needed

interface LayoutProps {
  children: ReactNode;
  title?: string; // Optional title for the page head
  hideSidebar?: boolean; // Optional prop to hide the sidebar
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'Selkie', hideSidebar }) => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown container

  // --- Dynamic Header Text Logic ---
  const toolPaths: { [key: string]: string } = {
    '/djinn': 'Djinn',
    '/argos': 'Argos',
    '/ghost': 'Ghost',
    '/tesseract': 'Tesseract',
  };
  const currentPath = router.pathname;
  const isToolPage = Object.keys(toolPaths).includes(currentPath);
  const headerText = isToolPage ? toolPaths[currentPath] : 'Selkie';
  // const isClickableHeader = !isToolPage; // Header is now always clickable

  // --- Dropdown Toggle ---
  const toggleDropdown = () => {
    // Always allow toggling now
    setIsDropdownOpen(!isDropdownOpen);
  };

  // --- Click Outside Logic ---
   useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);


  // --- Icon Visibility Logic (Adjusted if needed, keeping original logic for now) ---
  const allowedPaths = ['/djinn', '/tesseract', '/ghost', '/profile']; // Updated /map to /djinn
  const showIcons = allowedPaths.includes(router.pathname);
  return (
    <div className={styles.layoutContainer}>
      <Head>
        <title>{title}</title>
        {/* Add other common head elements if needed, like favicons or meta tags */}
        {/* Ensure fonts are loaded (might be better in _app.tsx if used globally) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Anonymous+Pro:wght@400;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet" />
      </Head>

      <header className={styles.header}>
          <Link href="/djinn" passHref> {/* Updated link from /map to /djinn */}
        <div className={styles.headerLogo}> {/* Keep div for margin/alignment if needed */}
          <Image
            src="/icons/Selkie Logo White.png" // Path relative to public folder
            alt="Selkie Logo"
            width={30} // Set desired width
            height={30} // Set desired height
            priority // Optional: Prioritize loading if it's above the fold
          />
        </div>
          </Link>
        {/* --- Header Title & Dropdown Trigger --- */}
        <div className={styles.headerTitleContainer} ref={dropdownRef}> {/* Added ref here */}
          <h1
            className={`${styles.headerTitle} ${styles.clickableHeader}`} // Always apply clickable style
            onClick={toggleDropdown}
            style={{ cursor: 'pointer' }} // Always use pointer cursor
          >
            {headerText}
          </h1>
          {/* --- Dropdown Menu --- */}
          {isDropdownOpen && ( // Removed isClickableHeader check
            <div className={styles.dropdownMenu}>
              <Link href="/djinn" className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>Djinn</Link>
              <Link href="/argos" passHref><div className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>Argos</div></Link>
              <Link href="/ghost" passHref><div className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>Ghost</div></Link>
              <Link href="/tesseract" passHref><div className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>Tesseract</div></Link>
            </div>
          )}
        </div>
        {/* --- Header Icons (Keep original logic) --- */}
        {showIcons && (
          <div className={styles.headerIcons}> {/* Container for icons */}
            <Link href="/profile" passHref>
              <FaUserCircle className={styles.icon} />
            </Link>
            <FaCog className={styles.icon} />
          </div>
        )}
      </header>

      <div className={styles.mainContentArea}>
        {!hideSidebar && <Sidebar />}
        <main className={styles.pageContent}>
          {children} {/* Page-specific content goes here */}
        </main>
      </div>
    </div>
  );
};

export default Layout;