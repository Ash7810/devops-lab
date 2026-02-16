
import React from 'react';
import { motion } from 'framer-motion';

const Shape = ({ className, delay, duration = 10, animate }: any) => (
  <motion.div
    className={`absolute ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
        opacity: [0.3, 0.6, 0.3], 
        y: [0, -30, 0],
        rotate: [0, 10, -10, 0],
        ...animate 
    }}
    transition={{ 
        duration: duration, 
        repeat: Infinity, 
        repeatType: "reverse", 
        delay: delay, 
        ease: "easeInOut" 
    }}
  />
);

const TetrisL = ({ className, delay }: { className: string; delay: number }) => (
  <motion.div
    className={`absolute ${className}`}
    initial={{ opacity: 0 }}
    animate={{ 
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
        opacity: [0.2, 0.5, 0.2]
    }}
    transition={{ duration: 8, repeat: Infinity, delay, ease: "easeInOut" }}
  >
    <div className="grid grid-cols-2 gap-1 w-12 opacity-30">
        <div className="w-5 h-5 bg-blue-400 rounded-sm"></div>
        <div className="w-5 h-5 bg-transparent"></div>
        <div className="w-5 h-5 bg-blue-400 rounded-sm"></div>
        <div className="w-5 h-5 bg-blue-400 rounded-sm"></div>
    </div>
  </motion.div>
);

const TetrisT = ({ className, delay }: { className: string; delay: number }) => (
    <motion.div
      className={`absolute ${className}`}
      initial={{ opacity: 0 }}
      animate={{ 
          y: [0, 20, 0],
          rotate: [0, -5, 5, 0],
          opacity: [0.2, 0.5, 0.2]
      }}
      transition={{ duration: 9, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      <div className="grid grid-cols-3 gap-1 w-16 opacity-30">
          <div className="w-5 h-5 bg-pink-400 rounded-sm col-start-2"></div>
          <div className="w-5 h-5 bg-pink-400 rounded-sm row-start-2"></div>
          <div className="w-5 h-5 bg-pink-400 rounded-sm row-start-2"></div>
          <div className="w-5 h-5 bg-pink-400 rounded-sm row-start-2"></div>
      </div>
    </motion.div>
);

const TetrisZ = ({ className, delay }: { className: string; delay: number }) => (
    <motion.div
      className={`absolute ${className}`}
      initial={{ opacity: 0 }}
      animate={{ 
          y: [0, -15, 0],
          rotate: [0, 10, 0],
          opacity: [0.2, 0.5, 0.2]
      }}
      transition={{ duration: 11, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      <div className="grid grid-cols-3 gap-1 w-16 opacity-30">
          <div className="w-5 h-5 bg-green-400 rounded-sm"></div>
          <div className="w-5 h-5 bg-green-400 rounded-sm"></div>
          <div className="w-5 h-5 bg-transparent"></div>
          <div className="w-5 h-5 bg-transparent col-start-2 row-start-2"></div>
          <div className="w-5 h-5 bg-green-400 rounded-sm row-start-2"></div>
          <div className="w-5 h-5 bg-green-400 rounded-sm row-start-2"></div>
      </div>
    </motion.div>
);

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-white">
        {/* Subtle Grid Texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        {/* Gradients for depth */}
        <div className="absolute top-0 left-0 w-[50vw] h-[50vh] bg-blue-50/50 rounded-full blur-[100px] mix-blend-multiply opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vh] bg-pink-50/50 rounded-full blur-[100px] mix-blend-multiply opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-yellow-50/30 rounded-full blur-[120px] mix-blend-multiply opacity-30"></div>

        {/* Floating Shapes */}
        
        {/* Top Left Area */}
        <Shape className="w-20 h-20 bg-yellow-200/40 rounded-full top-[10%] left-[5%] blur-sm" delay={0} />
        <TetrisL className="top-[15%] left-[10%]" delay={2} />
        
        {/* Middle Right */}
        <Shape className="w-16 h-16 bg-purple-200/40 rounded-xl top-[40%] right-[5%] rotate-12" delay={1} animate={{ rotate: [12, 45, 12] }} />
        <TetrisT className="top-[35%] right-[15%]" delay={4} />

        {/* Bottom Left */}
        <Shape className="w-24 h-24 bg-green-100/50 rounded-full bottom-[15%] left-[8%]" delay={3} />
        <TetrisZ className="bottom-[20%] left-[15%]" delay={1.5} />

        {/* Bottom Right - Scattered */}
        <Shape className="w-12 h-12 bg-red-100/50 rounded-lg bottom-[10%] right-[20%] rotate-45" delay={2.5} />
        <div className="absolute bottom-[5%] right-[5%] opacity-20">
             <svg width="60" height="60" viewBox="0 0 50 50" fill="none" className="text-brand-primary animate-spin-slow" style={{ animationDuration: '20s' }}>
                 <path d="M25 0L30 20L50 25L30 30L25 50L20 30L0 25L20 20L25 0Z" fill="currentColor"/>
             </svg>
        </div>

        {/* Center / Random */}
        <Shape className="w-8 h-8 bg-blue-300/30 rounded-full top-[20%] left-[40%]" delay={5} />
        <Shape className="w-10 h-10 border-4 border-orange-200/40 rounded-full top-[70%] left-[60%]" delay={0.5} />

    </div>
  );
};
