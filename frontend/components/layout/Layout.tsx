import React, { ReactNode } from 'react';
import Head from 'next/head';
import Image from 'next/image'; // Import Image component
import Sidebar from './Sidebar'; // Import the Sidebar component
import styles from '../../styles/Layout.module.css'; // Adjust path if needed

interface LayoutProps {
  children: ReactNode;
  title?: string; // Optional title for the page head
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'Selkie' }) => {
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
        <div className={styles.headerLogo}> {/* Keep div for margin/alignment if needed */}
          <Image
            src="/icons/Selkie Logo White.png" // Path relative to public folder
            alt="Selkie Logo"
            width={30} // Set desired width
            height={30} // Set desired height
            priority // Optional: Prioritize loading if it's above the fold
          />
        </div>
        <h1 className={styles.headerTitle}>Selkie</h1>
      </header>

      <div className={styles.mainContentArea}>
        <Sidebar />
        <main className={styles.pageContent}>
          {children} {/* Page-specific content goes here */}
        </main>
      </div>
    </div>
  );
};

export default Layout;