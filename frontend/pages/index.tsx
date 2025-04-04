import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
// import { useAuth } from '../context/AuthContext'; // Assuming an auth context hook
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  // const { isAuthenticated } = useAuth(); // Get auth state
  const isAuthenticated = false; // Placeholder: Replace with actual auth check
  return (
    <div className={styles.container}>
      <Head>
        <title>Selkie - Home</title>
        <meta name="description" content="Selkie Intelligence Analysis Suite" />
        {/* Ensure Anonymous Pro font is loaded (e.g., via _app.tsx or global CSS) */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <div className={styles.logo}>Selkie</div>
        <nav className={styles.nav}>
          {/* Using /about/* paths as previously established */}
          <Link href="/about/djinn" legacyBehavior><a className={styles.navLink}>Djinn</a></Link>
          <Link href="/about/ghost" legacyBehavior><a className={styles.navLink}>Ghost</a></Link>
          <Link href="/about/argos" legacyBehavior><a className={styles.navLink}>Argos</a></Link>
          {/* Tesseract link included based on Figma design */}
          <Link href="/about/tesseract" legacyBehavior><a className={styles.navLink}>Tesseract</a></Link>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.contentArea}>
          <h1 className={styles.headline}>
            Analyze Everything,<br />Understand Anything
          </h1>
          {/* Updated Link structure for modern Next.js */}
          {/* Conditional Link */}
          <Link href={isAuthenticated ? "/map" : "/login"} className={styles.ctaButton}>
            Start Analyzing
          </Link>
          {/* Image container moved inside contentArea */}
          <div className={styles.imageContainer}>
            <Image
              src="/images/home/wireframe_cad.png"
              alt="Wireframe CAD Drawing"
              layout="intrinsic" // Revert layout to allow relative sizing/positioning
              width={600} // Aspect ratio hint
              height={400} // Aspect ratio hint
              priority
            />
          </div>
        </div>
      </main>

      {/* Footer removed as it's not in the new design */}
    </div>
  );
};

export default Home;