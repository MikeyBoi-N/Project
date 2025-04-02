import React from 'react';
import styles from '../../styles/Login.module.css'; // Adjust path as needed
import GoogleGIcon from '../icons/GoogleGIcon'; // Import the SVG icon component

interface GoogleLoginButtonProps {
  onClick?: () => void; // Optional click handler prop
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onClick }) => {
  const handleClick = () => {
    console.log('Google Login button clicked (placeholder)');
    if (onClick) {
      onClick();
    }
    // TODO: Implement actual Google OAuth flow
  };

  return (
    <button type="button" className={styles.googleButton} onClick={handleClick}>
      <GoogleGIcon style={{ marginRight: '10px', verticalAlign: 'middle' }} /> {/* Use the SVG icon */}
      Continue with Google
    </button>
  );
};

export default GoogleLoginButton;