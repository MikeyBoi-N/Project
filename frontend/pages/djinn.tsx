import React from 'react';
import Image from 'next/image';
import PromoHeader from '../components/promo/PromoHeader';
import styles from './djinn.module.css'; // Page-specific styles

const DjinnPage: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <PromoHeader />
      <main className={styles.mainContent}>
        <section className={styles.heroSection}>
          <div className={styles.textContainer}>
            <h1>Meet Djinn: Your Intelligent Data Assistant</h1>
            <p>
              Djinn leverages advanced AI to understand your data requests in natural language.
              Ask complex questions, get insightful answers, and interact with your data like never before.
              It connects seamlessly with various data sources to provide a unified view.
              {/* Add more specific text from Figma Frame 2033:3 here */}
            </p>
            {/* Add buttons or other elements from Figma if present */}
          </div>
          <div className={styles.imageContainer}>
            <Image
              src="/images/promo/djinn_promo_main.png"
              alt="Djinn Promotional Image"
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

export default DjinnPage;