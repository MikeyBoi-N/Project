import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import PromoHeader from '../components/promo/PromoHeader'; // Corrected path
// import { useAuth } from '../context/AuthContext'; // Assuming an auth context hook
import styles from '../styles/Home.module.css'; './PromoHeader.module.css';

const Home: NextPage = () => {
  // const { isAuthenticated } = useAuth(); // Get auth state
  const isAuthenticated = false; // Placeholder: Replace with actual auth check
  return (
    <div className={styles.container}>
      <PromoHeader />
      <Head>
        <title>Selkie</title>
        <meta name="description" content="Selkie Intelligence Analysis Suite" />
        {/* Ensure Anonymous Pro font is loaded (e.g., via _app.tsx or global CSS) */}
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <main className={styles.main}>
        <div className={styles.contentArea}>
          <h1 className={styles.headline}>
            Analyze Everything,<br />Understand Anything
          </h1>
          {/* Updated Link structure for modern Next.js */}
          {/* Conditional Link */}
          <Link href={isAuthenticated ? "/djinn" : "/login"} className={styles.ctaButton}> {/* Updated link from /map to /djinn */}
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