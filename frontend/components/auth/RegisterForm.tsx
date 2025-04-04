import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/Login.module.css'; // Reuse login styles for consistency

interface RegisterFormProps {
    switchToLogin: () => void; // Function to switch back to login view
}

const RegisterForm: React.FC<RegisterFormProps> = ({ switchToLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Add confirm password state
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null); // For success feedback
    const { register, loading } = useAuth();

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await register(email, password);
            setSuccessMessage("Registration successful! Please log in."); // Set success message
            // Optionally clear fields or automatically switch to login
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            // Consider calling switchToLogin() after a short delay
            setTimeout(() => {
                switchToLogin();
            }, 2000); // Switch back to login after 2 seconds

        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred during registration.');
            console.error("Registration component error:", err);
        }
    };

    return (
        <div className={styles.loginBox}> {/* Reusing loginBox style */}
            <h2 className={styles.loginTitle}>Create Account</h2>

            {/* No Google button here, assuming registration is email/pass only */}

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                {error && <p className={styles.errorText}>{error}</p>}
                {successMessage && <p className={styles.successText}>{successMessage}</p>} {/* Display success */}

                <input
                    type="email"
                    placeholder="name@email.com"
                    value={email}
                    onChange={handleEmailChange}
                    className={styles.input}
                    required
                    disabled={loading}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    className={styles.input}
                    required
                    minLength={8} // Example: Enforce minimum password length
                    disabled={loading}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className={styles.input}
                    required
                    disabled={loading}
                />
                <button type="submit" className={styles.emailButton} disabled={loading}>
                    {loading ? 'Registering...' : 'Create Account'}
                </button>
            </form>

            <p className={styles.switchForm}> {/* Style for switching forms */}
                Already have an account?{' '}
                <button onClick={switchToLogin} className={styles.switchButton}>
                    Log In
                </button>
            </p>

            <p className={styles.terms}>
                By continuing, you agree to our Terms and Usage policy, and acknowledge our Privacy Policy
            </p>
        </div>
    );
};

export default RegisterForm;