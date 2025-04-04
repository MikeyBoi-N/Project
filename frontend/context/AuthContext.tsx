import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/router';

// Define the shape of the user object (adjust as needed based on your backend response)
interface User {
    id: number;
    email: string;
    is_active: boolean;
    is_superuser: boolean;
    is_verified: boolean;
    // Add other user properties if available
}

// Define the shape of the context state
interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    fetchUser: () => Promise<void>; // Expose fetchUser to refresh state if needed
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the provider
interface AuthProviderProps {
    children: ReactNode;
}

// Create the provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true); // Start loading initially
    const router = useRouter();

    // Function to fetch user data
    const fetchUser = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/users/me', { // Assuming proxy is set up or using relative path
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include', // Important for sending cookies
            });

            if (response.ok) {
                const userData: User = await response.json();
                setUser(userData);
                setIsAuthenticated(true);
            } else {
                // User not logged in or session expired
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    // Fetch user on initial mount
    useEffect(() => {
        fetchUser();
    }, []);

    // Login function
    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const formData = new URLSearchParams();
            formData.append('username', email); // FastAPI OAuth2PasswordRequestForm expects 'username'
            formData.append('password', password);

            const response = await fetch('/api/auth/token', { // Use relative path or proxy
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
                credentials: 'include',
            });

            if (response.ok) {
                // Login successful, fetch user data to update context
                await fetchUser(); // This will set loading to false eventually
                router.push('/djinn'); // Redirect after successful login and user fetch
            } else {
                const errorData = await response.json();
                console.error('Login failed:', errorData);
                // Handle specific error display in the component
                throw new Error(errorData.detail || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
            throw error; // Re-throw error to be caught in the component
        }
        // No finally setLoading(false) here, fetchUser handles it
    };

    // Register function
    const register = async (email: string, password: string) => {
        setLoading(true);
        try {
            const response = await fetch('/api/auth/register', { // Use relative path or proxy
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include', // Include credentials if needed by backend during registration
            });

            if (response.ok || response.status === 201) {
                // Registration successful, maybe log them in automatically or prompt
                // For now, just indicate success, let them log in separately
                console.log('Registration successful');
                // Optionally call login() here or redirect to login with a success message
                // await login(email, password); // Example: Auto-login after register
            } else {
                const errorData = await response.json();
                console.error('Registration failed:', errorData);
                throw new Error(errorData.detail || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            throw error; // Re-throw error
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/auth/logout', { // Use relative path or proxy
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                // Log error but proceed with frontend logout anyway
                console.error('Backend logout failed:', response.statusText);
            }
        } catch (error) {
            console.error('Logout request failed:', error);
        } finally {
            // Clear state regardless of backend response
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
            router.push('/login'); // Redirect to login page
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, login, register, logout, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};