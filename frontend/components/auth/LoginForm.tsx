import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import styles from '../../styles/Login.module.css';
import GoogleLoginButton from './GoogleLoginButton';

const LoginForm: React.FC = () => { // Removed unused props
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Add password state
  const [error, setError] = useState<string | null>(null); // Add error state
  const { login, loading } = useAuth(); // Get login function and loading state

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => { // Add password handler
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); // Clear previous errors

    try {
      await login(email, password);
      // Redirect is handled within the login function in AuthContext
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.'); // Set error message
      console.error("Login component error:", err);
    }
  };

  return (
    <div className={styles.loginBox}>
      <h2 className={styles.loginTitle}>Log in to Selkie</h2> {/* Updated title */}

      <GoogleLoginButton />

      <div className={styles.separator}>OR</div>

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        {error && <p className={styles.errorText}>{error}</p>} {/* Display error */}
        <input
          type="email"
          placeholder="name@email.com"
          value={email}
          onChange={handleEmailChange}
          className={styles.input}
          required
          disabled={loading} // Disable input when loading
        />
        <input // Add password input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          className={styles.input}
          required
          disabled={loading} // Disable input when loading
        />
        <button type="submit" className={styles.emailButton} disabled={loading}> {/* Disable button when loading */}
          {loading ? 'Logging in...' : 'Log in with Email'} {/* Update button text */}
        </button>
      </form>

      {/* Consider adding a link to the registration form here later */}
      {/* <p className={styles.switchForm}>Don't have an account? <button onClick={switchToRegister}>Register</button></p> */}


      <p className={styles.terms}>
        By continuing, you agree to our Terms and Usage policy, and acknowledge our Privacy Policy
      </p>
    </div>
  );
};

export default LoginForm;