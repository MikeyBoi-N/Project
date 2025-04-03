import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './PromoHeader.module.css'; // Assuming CSS Modules

const PromoHeader: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Image
          src="/images/promo/selkie_logo_promo.png"
          alt="Selkie Logo"
          width={150} // Adjust width as needed based on Figma
          height={50} // Adjust height as needed based on Figma
          priority // Preload the logo as it's likely LCP
        />
      </div>
      <nav className={styles.nav}>
        <Link href="/djinn" legacyBehavior><a className={styles.navLink}>Djinn</a></Link>
        <Link href="/ghost" legacyBehavior><a className={styles.navLink}>Ghost</a></Link>
        <Link href="/argos" legacyBehavior><a className={styles.navLink}>Argos</a></Link>
      </nav>
    </header>
  );
};

export default PromoHeader;