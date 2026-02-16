
import React, { useState } from 'react';

interface LogoProps {
  className?: string;
}

export const Logo = React.memo<LogoProps>(({ className }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    // Fallback Vector Logo if the image file is not found
    return (
      <svg viewBox="0 0 500 120" className={className} xmlns="http://www.w3.org/2000/svg" aria-label="ShreeChoice Playworld">
         <defs>
            <style>
            {`
                @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Quicksand:wght@700&display=swap');
            `}
            </style>
        </defs>
        <text x="50%" y="45" fontSize="42" textAnchor="middle" fill="#1A56DB" fontWeight="bold" style={{fontFamily: '"Fredoka", cursive'}}>SHREECHOICE</text>
        <g transform="translate(65, 100)" style={{fontFamily: '"Quicksand", sans-serif'}} fontSize="60" textAnchor="middle" fontWeight="bold">
            <text x="0" y="0" fill="#F43F5E">P</text>
            <text x="40" y="0" fill="#60A5FA">L</text>
            <text x="80" y="0" fill="#34D399">A</text>
            <text x="125" y="0" fill="#FBBF24">Y</text>
            <text x="180" y="0" fill="#F43F5E">W</text>
            <text x="240" y="0" fill="#60A5FA">O</text>
            <text x="290" y="0" fill="#34D399">R</text>
            <text x="330" y="0" fill="#F43F5E">L</text>
            <text x="370" y="0" fill="#FBBF24">D</text>
        </g>
      </svg>
    );
  }

  return (
    <img 
      src="/logo.png" 
      alt="ShreeChoice Playworld" 
      className={className}
      onError={() => setHasError(true)}
    />
  );
});
