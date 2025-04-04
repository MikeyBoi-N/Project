import React from 'react';
import Image from 'next/image';
import PromoHeader from '../../components/promo/PromoHeader'; // Updated path
import styles from './djinn.module.css'; // Updated path

const DjinnPage: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <PromoHeader />
      {/* Add globalScrollableContainer for consistent scrollbar styling */}
      <main className={`${styles.mainContent} globalScrollableContainer`}>
        <h1 className={styles.pageTitle}>Djinn: See the Unseen with Advanced Computer Vision</h1>
        <section className={styles.heroSection}>
          <div className={styles.textContainer}>
            <p className={styles.description}>
              Leverage the power of automated image analysis with Djinn. Our Computer Vision engine processes aerial imagery (EO, SAR, and more) to automatically detect, identify, and track objects of interest.
            </p>
            <p className={styles.description}>
              Djinn transforms vast amounts of visual data into concise, geolocated results visualized directly on your map interface, accelerating analysis and enhancing situational awareness.
            </p>
            {/* Add buttons or other elements from Figma if present */}
          </div>
          <div className={styles.imageContainer}>
            <Image
              src="/images/promo/djinn/djinn_promo_main.png"
              alt="Djinn Promotional Image"
              layout="responsive" // Use layout="responsive" or "fill" and control size with CSS
              width={700} // Provide aspect ratio hint, actual size controlled by CSS
              height={475} // Provide aspect ratio hint, actual size controlled by CSS - Adjust ratio if needed based on djinn_promo_main.png
              priority
            />
          </div>
        </section>


        {/* --- Restructured Content Section with Side-by-Side Layout --- */}
        <section className={styles.promoTextSection}>
          <h2>Unlocking Insights with Djinn &amp; YOLO</h2>
          <p className={styles.description}>
            Djinn, a core part of the Selkie analytical engine, employs the cutting-edge YOLO (You Only Look Once) framework. This enables advanced, real-time object detection across diverse imagery types, including Electro-Optical (EO) and Synthetic Aperture Radar (SAR).
          </p>
          <p className={styles.description}>
            YOLO's architecture allows Djinn to analyze entire images swiftly, identifying and classifying objects like vehicles, aircraft, and infrastructure with remarkable speed and accuracy. This converts complex visual data into actionable intelligence.
          </p>

          {/* 1. YOLO: State-of-the-Art and Customizable */}
          <div className={styles.yoloSectionCentered}>
            {/* Image first */}
            <div className={styles.imagePlaceholderBlock}>
              <Image
                src="/images/promo/djinn/Yolo.png"
                alt="Diagram illustrating the YOLO object detection model"
                layout="responsive"
                width={200}
                height={200}
              />
            </div>
            {/* Text below image */}
            <div className={styles.textContentBlock}>
              <h3 className={styles.subHeading}>State-of-the-Art and Customizable</h3>
              <p className={styles.description}>
                Djinn leverages the You Only Look Once (YOLO) family of single-stage object detectors, integrating advancements across multiple iterations (e.g., YOLOv5, v7, v8, YOLO-World) to provide a baseline of high-performance detection. This architectural choice prioritizes inference speed by performing bounding box regression and classification concurrently. For domain-specific performance enhancements, Djinn supports fine-tuning workflows, enabling model adaptation to unique operational datasets. This customization process is critical for maximizing detection precision and recall while mitigating false positives in specialized environments.
              </p>
            </div>
          </div>
          <hr className={styles.sectionSeparator} />

          {/* 2. ATR: Advancing Automatic Target Recognition (ATR) */}
          <div className={styles.yoloSectionCentered}>
            {/* Image first */}
            <div className={styles.imagePlaceholderBlock}>
              <Image
                src="/images/promo/djinn/person_tank_detection.png"
                alt="Djinn detecting persons and tanks"
                layout="responsive"
                width={250}
                height={150}
              />
            </div>
            {/* Text below image */}
            <div className={styles.textContentBlock}>
              <h3 className={styles.subHeading}>Advancing Automatic Target Recognition (ATR)</h3>
              <p className={styles.description}>
                Djinn addresses core challenges in modern Automatic Target Recognition (ATR), particularly concerning the processing of diverse sensor modalities like Electro-Optical (EO) and Synthetic Aperture Radar (SAR) imagery. The system architecture is designed to handle the inherent complexities of these data types and incorporates methodologies aimed at improving robustness in open-set recognition scenarios – the critical task of identifying both predefined target classes and novel, previously unseen objects. Implementation leverages established deep learning frameworks such as PyTorch and TensorFlow, alongside computer vision libraries like OpenCV, providing a foundation for sophisticated model development and deployment, ultimately enhancing situational awareness and accelerating the decision-making cycle.
              </p>
            </div>
          </div>
          <hr className={styles.sectionSeparator} />

          {/* 3. Versatile Detection Capabilities */}
          <div className={`${styles.contentRow} ${styles.rowReverse}`}>
            <div className={styles.textContentBlock}>
              <h3 className={styles.subHeading}>Versatile Detection Capabilities</h3>
              <p className={styles.description}>
                The system's detection capabilities extend across a wide operational envelope, encompassing diverse object classes and environmental conditions typical of EO and SAR data streams. Djinn's adaptability stems from its underlying model architecture, which facilitates transfer learning and custom training pipelines. This allows for the rapid development and deployment of models tailored to specific targets of interest or unique mission parameters, ensuring relevance against dynamic operational requirements and emerging object signatures.
              </p>
              {/* Example: Add a list here if needed */}
              {/* <ul>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul> */}
            </div>
            <div className={styles.imagePlaceholderBlock}>
              <Image
                src="/images/promo/djinn/car_detection.png"
                alt="Djinn detecting cars in aerial imagery"
                layout="responsive"
                width={300}
                height={200}
              />
            </div>
          </div>
          <hr className={styles.sectionSeparator} />

          {/* 4. Near Real-Time Analysis */}
          <div className={styles.contentRow}>
            <div className={styles.textContentBlock}>
              <h3 className={styles.subHeading}>Near Real-Time Analysis</h3>
              <p className={styles.description}>
                Achieving low-latency analysis is a primary design goal. Djinn capitalizes on the computational efficiency inherent in the single-pass architecture of its core YOLO detectors. This approach, which performs localization and classification in parallel, significantly reduces the processing time per frame compared to two-stage detectors. The resulting near real-time performance provides analysts with timely object detection outputs, crucial for maintaining situational awareness in time-sensitive operational contexts. Actual throughput is dependent on hardware resources and model complexity.
              </p>
            </div>
            <div className={styles.imagePlaceholderBlock}>
              <Image
                src="/images/promo/djinn/Near_Real_Time_Analysis.png"
                alt="Diagram illustrating near real-time analysis workflow"
                width={250}
                height={180}
                layout="responsive"
              />
            </div>
          </div>
          <hr className={styles.sectionSeparator} />

          {/* 5. Seamless Integration within Selkie */}
          <div className={styles.contentRow}>
            <div className={styles.textContentBlock}>
              <h3 className={styles.subHeading}>Seamless Integration within Selkie</h3>
              <p className={styles.description}>
                Djinn is engineered for tight integration within the Selkie geospatial intelligence platform. This integration exposes advanced computer vision capabilities through Selkie's established user interface, minimizing the need for specialized operator training. Detection outputs, including object classifications, confidence scores, and precise geolocations, are rendered directly onto the shared map display. This unified visualization environment streamlines analyst workflows, enhances collaborative analysis, and accelerates the dissemination of derived intelligence products across operational teams.
              </p>
            </div>
            <div className={styles.imagePlaceholderBlock}>
              <Image
                src="/images/promo/djinn/airplane_detection.png"
                alt="Selkie map interface showing Djinn airplane detections"
                layout="responsive"
                width={400}
                height={100}
              />
            </div>
          </div>
        </section> {/* Close promoTextSection */}
        {/* Add more sections based on Figma design */}
      </main>
      {/* Add a footer if specified in Figma */}
    </div>
  );
};

export default DjinnPage;