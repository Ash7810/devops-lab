import React from 'react';

interface WavyDividerProps {
  direction?: 'up' | 'down';
  className?: string;
  type?: 'wave' | 'curve' | 'slope' | 'scallop';
}

export const WavyDivider = React.memo<WavyDividerProps>(({ direction = 'down', className = 'text-white', type = 'wave' }) => {
  let pathD: string;
  
  switch (type) {
    case 'curve':
      // Gentle concave curve that "scoops" down.
      pathD = "M0,100 C400,20 800,20 1200,100 V0 H0 Z";
      break;
    case 'slope':
      // Asymmetric slope path for a sharp, modern transition.
      pathD = "M0,20 L1200,100 L1200,120 L0,120 Z";
      break;
    case 'scallop':
      // A series of semi-circles forming a scalloped edge
      pathD = "M0,50 Q15,100 30,50 T60,50 T90,50 T120,50 T150,50 T180,50 T210,50 T240,50 T270,50 T300,50 T330,50 T360,50 T390,50 T420,50 T450,50 T480,50 T510,50 T540,50 T570,50 T600,50 T630,50 T660,50 T690,50 T720,50 T750,50 T780,50 T810,50 T840,50 T870,50 T900,50 T930,50 T960,50 T990,50 T1020,50 T1050,50 T1080,50 T1110,50 T1140,50 T1170,50 T1200,50 V120 H0 Z";
      break;
    case 'wave':
    default:
      pathD = "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z";
      break;
  }
  
  return (
    <div className={`leading-none ${direction === 'up' ? 'transform rotate-180' : ''}`}>
      <svg
        className={`relative block w-full h-[60px] md:h-[100px] translate-y-[1px] ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path d={pathD} className="fill-current"></path>
      </svg>
    </div>
  );
});