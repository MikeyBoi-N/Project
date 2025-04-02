import React from 'react';

interface GoogleGIconProps extends React.SVGProps<SVGSVGElement> {
  // Allow standard SVG props like width, height, className, etc.
}

const GoogleGIcon: React.FC<GoogleGIconProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      width="20" // Default size, can be overridden by props
      height="20" // Default size, can be overridden by props
      {...props} // Spread any additional props
    >
      <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9.18v3.49h4.79c-.2 1.12-.84 2.08-1.79 2.71v2.26h2.92c1.71-1.57 2.69-3.89 2.69-6.62z"/>
      <path fill="#34A853" d="M9.18 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-2.99.86-2.3 0-4.25-1.56-4.95-3.65H1.16v2.33C2.63 16.16 5.67 18 9.18 18z"/>
      <path fill="#FBBC05" d="M4.23 10.84c-.15-.45-.23-.93-.23-1.41s.08-.96.23-1.41V5.69H1.16C.42 7.01 0 8.55 0 10.2s.42 3.19 1.16 4.51l3.07-2.34z"/>
      <path fill="#EA4335" d="M9.18 3.56c1.32 0 2.51.46 3.45 1.35l2.59-2.59C13.65.88 11.61 0 9.18 0 5.67 0 2.63 1.84 1.16 4.51l3.07 2.34c.7-2.09 2.65-3.65 4.95-3.65z"/>
    </svg>
  );
};

export default GoogleGIcon;