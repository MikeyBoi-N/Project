import React, { useState } from 'react';
import styles from '../../styles/Login.module.css'; // Adjust path as needed
import GoogleLoginButton from './GoogleLoginButton'; // Import the Google button

interface LoginFormProps {
  onEmailSubmit?: (email: string) => void; // Optional submit handler prop
}

const LoginForm: React.FC<LoginFormProps> = ({ onEmailSubmit }) => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    console.log('Email submitted:', email);
    if (onEmailSubmit) {
      onEmailSubmit(email);
    }
    // TODO: Implement actual API call to backend /auth/login
  };

  return (
    <div className={styles.loginBox}>
      <h2 className={styles.loginTitle}>Start using Selkie</h2>

      <GoogleLoginButton />

      <div className={styles.separator}>OR</div>

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <input
          type="email"
          placeholder="name@email.com"
          value={email}
          onChange={handleEmailChange}
          className={styles.input}
          required // Basic HTML5 validation
        />
        <button type="submit" className={styles.emailButton}>
          Continue with email
        </button>
      </form>

      <p className={styles.terms}>
        By continuing, you agree to our Terms and Usage policy, and acknowledge our Privacy Policy
      </p>
    </div>
  );
};

export default LoginForm;