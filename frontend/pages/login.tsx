import React, { useState } from 'react'; // Import useState
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm'; // Import RegisterForm
import styles from '../styles/Login.module.css';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false); // State to track view

  const switchToRegister = () => setIsRegistering(true);
  const switchToLogin = () => setIsRegistering(false);

  return (
    <div className={styles.container}>
      <Head>
        <title>{isRegistering ? 'Register' : 'Login'} - Selkie</title> {/* Dynamic title */}
        {/* Link to Google Fonts if Anonymous Pro/Inter aren't loaded globally */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Anonymous+Pro:wght@400;700&family=Inter:wght@300&display=swap" rel="stylesheet" />
      </Head>

      {/* Close Button */}
      <button onClick={() => router.back()} className={styles.closeButton} title="Close">
        &times;
      </button>

      <h1 className={styles.title}>Selkie</h1>

      {/* Conditionally render Login or Register Form */}
      {isRegistering ? (
        <RegisterForm switchToLogin={switchToLogin} />
      ) : (
        <LoginForm /> // LoginForm doesn't need switchToRegister prop directly
      )}

      {/* Switch link/button - Placed outside the form components */}
      <p className={styles.switchFormText}> {/* Added a style for this text */}
        {isRegistering ? (
          <>
            Already have an account?{' '}
            <button onClick={switchToLogin} className={styles.switchButton}>
              Log In
            </button>
          </>
        ) : (
          <>
            Don't have an account?{' '}
            <button onClick={switchToRegister} className={styles.switchButton}>
              Register
            </button>
          </>
        )}
      </p>

      <Link href="/djinn" className={styles.guestLink}>
        continue as guest
      </Link>

      {/* Optional: Add a footer or other elements outside the login box if needed */}
    </div>
  );
};

export default LoginPage;