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
            <h1 className={styles.title}>Argos Mission Manager: Command Your Argos Drone</h1>
            <p className={styles.description}>
              Named after Odysseus' famously loyal companion, our Argos drone embodies steadfast reliability. To command this advanced UAV, we developed the Argos Mission Manager – your dedicated software suite.
            </p>
            <p className={styles.description}>
              This comprehensive tool provides robust flight planning and mapping, in-depth analysis of sensor data gathered by the Argos drone, and a real-time health dashboard for optimal performance. Streamline operations, ensure safety, and maximize the effectiveness of your Argos drone with its purpose-built command software.
            </p>
            {/* Add buttons or other elements from Figma if present */}
          </div>
          <div className={styles.imageContainer}>
            <Image
              src="/images/promo/argos_promo_main.png"
              alt="Argos Promotional Image"
              layout="responsive" // Use layout="responsive" or "fill" and control size with CSS
              width={700} // Provide aspect ratio hint, actual size controlled by CSS
              height={475} // Provide aspect ratio hint, actual size controlled by CSS
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