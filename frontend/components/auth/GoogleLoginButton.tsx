import React from 'react';
import styles from '../../styles/Login.module.css'; // Adjust path as needed
import GoogleGIcon from '../icons/GoogleGIcon'; // Import the SVG icon component

// No props needed anymore
const GoogleLoginButton: React.FC = () => {
  // The backend URL for initiating Google OAuth
  // Assuming /api/* is proxied to the backend or they share an origin.
  // If not, use the full backend URL: e.g., 'http://localhost:8000/auth/google/login'
  const googleLoginUrl = '/api/auth/google/login';

  return (
    // Changed from button to anchor tag
    <a href={googleLoginUrl} className={styles.googleButton}>
      <GoogleGIcon style={{ marginRight: '10px', verticalAlign: 'middle' }} /> {/* Use the SVG icon */}
      Continue with Google
    </a>
  );
};

export default GoogleLoginButton;