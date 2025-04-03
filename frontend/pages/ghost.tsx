import React from 'react';
import Image from 'next/image';
import PromoHeader from '../components/promo/PromoHeader';
import styles from './ghost.module.css'; // Page-specific styles

const GhostPage: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <PromoHeader />
      <main className={styles.mainContent}>
        <section className={styles.heroSection}>
          <div className={styles.textContainer}>
            <h1>Unveil Insights with Ghost: The Anomaly Detector</h1>
            <p>
              Ghost automatically monitors your data streams, identifying unusual patterns and anomalies in real-time.
              Configure alerts, investigate deviations, and maintain system health proactively.
              It's designed for scalability and integrates with various monitoring tools.
              {/* Add more specific text from Figma Frame 2033:60 here */}
              {/* Reference architecture/selkie_architecture.md line 15 if needed */}
            </p>
            {/* Add buttons or other elements from Figma if present */}
          </div>
          <div className={styles.imageContainer}>
            <Image
              src="/images/promo/ghost_promo_main.png"
              alt="Ghost Promotional Image"
              width={500} // Adjust based on Figma
              height={400} // Adjust based on Figma
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