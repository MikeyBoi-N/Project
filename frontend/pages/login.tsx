import React from 'react';
import Head from 'next/head';
import LoginForm from '../components/auth/LoginForm'; // Adjust path if necessary
import styles from '../styles/Login.module.css'; // Adjust path if necessary

const LoginPage: React.FC = () => {
  // Placeholder function for handling email submission from LoginForm
  const handleLoginSubmit = (email: string) => {
    console.log('Login attempt with email:', email);
    // Here you would typically make an API call to your backend
    // e.g., fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email }) })
    //      .then(response => response.json())
    //      .then(data => { /* handle token, redirect */ })
    //      .catch(error => { /* handle error */ });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Login - Selkie</title>
        {/* Link to Google Fonts if Anonymous Pro/Inter aren't loaded globally */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Anonymous+Pro:wght@400;700&family=Inter:wght@300&display=swap" rel="stylesheet" />
      </Head>

      <h1 className={styles.title}>Selkie</h1>

      <LoginForm onEmailSubmit={handleLoginSubmit} />

      {/* Optional: Add a footer or other elements outside the login box if needed */}
    </div>
  );
};

export default LoginPage;