import React from 'react';
import Image from 'next/image';
import PromoHeader from '../components/promo/PromoHeader';
import styles from './argos.module.css'; // Page-specific styles

const ArgosPage: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <PromoHeader />
      <main className={styles.mainContent}>
        <section className={styles.heroSection}>
          <div className={styles.textContainer}>
            <h1>Argos: Visualize Your Network's Landscape</h1>
            <p>
              Argos provides powerful network visualization and analysis tools.
              Map dependencies, understand traffic flow, and identify potential bottlenecks.
              Gain clarity on complex network structures with interactive graphs.
              {/* Add more specific text from Figma Frame 2034:97 here */}
            </p>
            {/* Add buttons or other elements from Figma if present */}
          </div>
          <div className={styles.imageContainer}>
            <Image
              src="/images/promo/argos_promo_main.png"
              alt="Argos Promotional Image"
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

export default ArgosPage;