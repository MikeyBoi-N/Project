import React from 'react';
import Image from 'next/image';
import PromoHeader from '../../components/promo/PromoHeader'; // Updated path
import styles from './djinn.module.css'; // Updated path

const DjinnPage: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <PromoHeader />
      <main className={styles.mainContent}>
        <section className={styles.heroSection}>
          <div className={styles.textContainer}>
            <h1 className={styles.title}>Djinn: See the Unseen with Advanced Computer Vision</h1>
            <p className={styles.description}>
              Leverage the power of automated image analysis with Djinn. Our Computer Vision engine processes aerial imagery (EO, SAR, and more) to automatically detect, identify, and track objects of interest.
            </p>
            <p className={styles.description}>
              Djinn turns vast amounts of visual data into concise, geolocated results visualized directly on your map interface, accelerating analysis and enhancing situational awareness.
            </p>
            {/* Add buttons or other elements from Figma if present */}
          </div>
          <div className={styles.imageContainer}>
            <Image
              src="/images/promo/djinn_promo_main.png"
              alt="Djinn Promotional Image"
              layout="responsive" // Use layout="responsive" or "fill" and control size with CSS
              width={700} // Provide aspect ratio hint, actual size controlled by CSS
              height={475} // Provide aspect ratio hint, actual size controlled by CSS - Adjust ratio if needed based on djinn_promo_main.png
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

export default DjinnPage;