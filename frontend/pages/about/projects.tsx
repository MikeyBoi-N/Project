import React from 'react';
import Image from 'next/image';
import PromoHeader from '../../components/promo/PromoHeader'; // Updated path
import styles from './projects.module.css';

const ProjectsPage: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <PromoHeader />
      <main className={styles.mainContent}>
        <section className={styles.heroSection}>
          <div className={styles.textContainer}>
            <h1 className={styles.title}>Our Projects</h1>
            
            <h2>Software</h2>
            <ul>
                <li className={styles.description_projects}><a href="/about/djinn"><strong>Djinn:</strong> </a> AI-powered Computer Vision engine for analyzing aerial imagery (EO/SAR) and detecting objects.</li>
                <li className={styles.description_projects}><a href="/about/ghost"><strong>Ghost:</strong> </a> Signal Processing engine using SDR to detect, analyze, and visualize RF signals.</li>
                <li className={styles.description_projects}><a href="/about/argos"><strong>Argos Mission Manager:</strong> </a> Software suite for planning missions, controlling, and analyzing data from the Argos UAV.</li>
                <li className={styles.description_projects}><a href="/about/tesseract"><strong>Tesseract:</strong> </a> 4D Visualization engine for reconstructing and displaying immersive 3D spatio-temporal scenes.</li>
            </ul>
            <h2>Hardware</h2>
            <ul>
              <li className={styles.description_projects}><a href="/about/thunderbird"><strong>Thunderbird:</strong> </a> Long-range Attack UAV for air-to-sea operations, targeting maritime vessels/structures in adverse conditions.</li>
              <li className={styles.description_projects}><a href="/about/argos-uav"><strong>Argos UAV:</strong> </a> Versatile Unmanned Aerial Vehicle platform for data acquisition missions.</li>
            </ul>
          <div className={styles.imageContainer}>
          </div>
          </div>
        </section>
        {/* Add more sections based on Figma design */}
      </main>
      {/* Add a footer if specified in Figma */}
    </div>
  );
};

export default ProjectsPage;