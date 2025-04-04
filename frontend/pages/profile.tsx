import React from 'react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '../styles/Profile.module.css';
import Layout from '../components/layout/Layout';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [theme, setTheme] = useState('system'); // Default theme

  return (
    <Layout hideSidebar={true}>
    <div className={styles.container}>
      <h1>User Profile</h1>
      <section className={styles.section}>
        <h2>User Details</h2>
        {/* Placeholder for user details content */}
        <div className={styles.formGroup}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.inputField}
          />
        </div>
        <button className={styles.saveButton}>Save Details</button>
      </section>
      <section className={styles.section}>
        <h2>Preferences</h2>
        {/* Placeholder for preferences content */}
        <div className={styles.themeSelection}>
          <label className={styles.themeLabel}>Appearance:</label>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                name="theme"
                value="light"
                checked={theme === 'light'}
                onChange={() => setTheme('light')}
              /> Light
            </label>
            <label>
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={theme === 'dark'}
                onChange={() => setTheme('dark')}
              /> Dark
            </label>
            <label>
              <input
                type="radio"
                name="theme"
                value="system"
                checked={theme === 'system'}
                onChange={() => setTheme('system')}
              /> System
            </label>
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <h2>Account Actions</h2>
        {/* Placeholder for account actions content */}
        <button className={styles.logoutButton} onClick={() => router.push('/')}>Log Out</button>
      </section>
    </div>
    </Layout>
  );
};

export default ProfilePage;