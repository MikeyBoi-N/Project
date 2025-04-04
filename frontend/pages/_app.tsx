import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider, useAuth } from '../context/AuthContext';
import React, { useEffect } from 'react'; // Import useEffect
import { useRouter } from 'next/router'; // Import useRouter

// Define public paths that don't require authentication
const publicPaths = ['/login', '/']; // Add root path '/' and potentially others like '/about' if needed

// Simple full-page loading indicator component
const LoadingIndicator: React.FC = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2em' }}>
    Loading...
  </div>
);

// Component that contains the main app structure and protection logic
const AppContent: React.FC<{ Component: React.ElementType, pageProps: any }> = ({ Component, pageProps }) => {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only run redirect logic once loading is complete
    if (!loading) {
      const pathIsProtected = !publicPaths.includes(router.pathname);

      if (!isAuthenticated && pathIsProtected) {
        // If user is not logged in and trying to access a protected page, redirect
        router.push('/login');
      }
      // Optional: Redirect logged-in users away from the login page
      // else if (isAuthenticated && router.pathname === '/login') {
      //   router.push('/djinn'); // Or default logged-in page
      // }
    }
  }, [loading, isAuthenticated, router]); // Dependencies ensure effect runs on change


  // Basic inline styles for the header
  const headerStyle: React.CSSProperties = {
    padding: '10px 20px',
    borderBottom: '1px solid #ccc',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };
  const userInfoStyle: React.CSSProperties = { fontSize: '0.9em' };
  const logoutButtonStyle: React.CSSProperties = {
    padding: '5px 10px', cursor: 'pointer', backgroundColor: '#f44336',
    color: 'white', border: 'none', borderRadius: '4px',
  };

  // Determine if the page requires authentication
  const pathIsProtected = !publicPaths.includes(router.pathname);

  // Show loading indicator while auth state is loading OR
  // if user is not authenticated and trying to access a protected page (avoids flash of content)
  if (loading || (!isAuthenticated && pathIsProtected)) {
    return <LoadingIndicator />;
  }

  // Render the actual content (header + page)
  return (
    <>
      <header style={headerStyle}>
        <div>Selkie App</div>
        <div>
          {isAuthenticated && user ? (
            <>
              <span style={userInfoStyle}>Logged in as: {user.email}</span>
              <button onClick={logout} style={{ ...logoutButtonStyle, marginLeft: '15px' }}>
                Logout
              </button>
            </>
          ) : (
             // Optionally show something else, or nothing, if not logged in and not on login page
             router.pathname !== '/login' && <span></span> // Example: show nothing
          )}
        </div>
      </header>
      <main style={{ padding: '20px' }}> {/* Add padding for content */}
        <Component {...pageProps} />
      </main>
    </>
  );
};


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </AuthProvider>
  );
}

export default MyApp;