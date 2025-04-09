import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './PromoHeader.module.css'; // Assuming CSS Modules

const PromoHeader: React.FC = () => {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logoLink}> {/* Wrap logo container with Link */}
        <div className={styles.logoContainer}>
          <Image
            src="/images/promo/selkie_logo_promo.png"
            alt="Selkie Logo"
            width={50} // Set a base width, actual size controlled by height/CSS potentially
            height={30} // Set height based on typical logo size/Figma inspection
            priority // Preload the logo as it's likely LCP
          />
          <span className={styles.logoText}>Selkie</span>
        </div>
      </Link>
      <nav className={styles.nav}>
        <Link href="/about/djinn" legacyBehavior><a className={styles.navLink}>Djinn</a></Link> {/* Updated path */}
        <Link href="/about/ghost" legacyBehavior><a className={styles.navLink}>Ghost</a></Link> {/* Updated path */}
        <Link href="/about/argos" legacyBehavior><a className={styles.navLink}>Argos</a></Link> {/* Updated path */}
        <Link href="/about/projects" legacyBehavior><a className={styles.navLink}>Projects</a></Link> {/* Updated path */}
      </nav>
      
    </header>
  );
};

export default PromoHeader;