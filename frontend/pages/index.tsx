import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css'; // We'll create this styles file later
import Link from 'next/link'; // Import Link

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Selkie Project</title>
        <meta name="description" content="Selkie Intelligence Analysis Suite" />
        <link rel="icon" href="/favicon.ico" /> {/* Placeholder favicon */}
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Selkie!
        </h1>

        <p className={styles.description}>
          Phase 1 Frontend Placeholder
        </p>

        {/* Link to the login page */}
        <div className={styles.grid}> {/* Use existing grid style or create a new one */}
          <Link href="/login" className={styles.card}> {/* Use existing card style */}
            <h2>Login &rarr;</h2>
            <p>Go to the Selkie login page.</p>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        {/* Basic footer */}
        Powered by Selkie Engine
      </footer>
    </div>
  );
};

export default Home;