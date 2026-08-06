import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
  src?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = 'w-12 h-12',
  src
}) => {
  const logoSrc = src || '/logo.png';

  return (
    <div className={`${className} flex-shrink-0 relative rounded-full overflow-hidden shadow-sm flex items-center justify-center select-none bg-white p-0.5`}>
      <img
        src={logoSrc}
        alt="Kumite Karate Klubs Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
};
