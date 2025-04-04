import React from 'react';
import Image from 'next/image';
import PromoHeader from '../../components/promo/PromoHeader'; // Updated path
import styles from './ghost.module.css'; // Updated path

const GhostPage: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <PromoHeader />
      <main className={styles.mainContent}>
        <section className={styles.heroSection}>
          <div className={styles.textContainer}>
            <h1 className={styles.title}>Ghost: Master the Spectrum with Signal Intelligence</h1>
            <p className={styles.description}>
              Decode the electromagnetic environment with Ghost. This powerful Signal Processing engine utilizes Software-Defined Radio (SDR) technology to detect, analyze, classify, and potentially locate RF signals.
            </p>
            <p className={styles.description}>
              Ghost integrates seamlessly with Kappa for transcription and translation of intercepted communications and visualizes signal intelligence directly on the map, providing a critical layer of understanding.
            </p>
            {/* Add buttons or other elements from Figma if present */}
          </div>
          <div className={styles.imageContainer}>
            <Image
              src="/images/promo/ghost/ghost_promo_main.png"
              alt="Ghost Promotional Image"
              layout="responsive" // Use layout="responsive" or "fill" and control size with CSS
              width={700} // Provide aspect ratio hint, actual size controlled by CSS - Adjust ratio if needed based on ghost_promo_main.png
              height={475} // Provide aspect ratio hint, actual size controlled by CSS - Adjust ratio if needed based on ghost_promo_main.png
              priority
            />
          </div>
        </section>
        {/* Add more sections based on Figma design */}
      </main>
      {/* Add a footer if specified in Figma */}
    </div>
  );
};

export default GhostPage;