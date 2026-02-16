
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '../lib/router';
import { CATEGORIES, HERO_SLIDES } from '../constants';
import { THEME } from '../theme.config';

// Geometric Shapes for the background
const Circle = ({ className, delay }: { className: string; delay: number }) => (
  <motion.div
    className={`absolute rounded-full ${className}`}
    initial={{ y: 0, opacity: 0 }}
    animate={{ 
      y: [0, -40, 0], 
      x: [0, 20, 0],
      opacity: [0.4, 0.8, 0.4] 
    }}
    transition={{ 
      duration: 6, 
      repeat: Infinity, 
      delay: delay,
      ease: "easeInOut" 
    }}
  />
);

const Square = ({ className, delay, rotate }: { className: string; delay: number; rotate: number }) => (
  <motion.div
    className={`absolute rounded-2xl ${className}`}
    initial={{ rotate: rotate, opacity: 0 }}
    animate={{ 
      rotate: [rotate, rotate + 45, rotate],
      y: [0, 30, 0],
      opacity: [0.3, 0.7, 0.3]
    }}
    transition={{ 
      duration: 8, 
      repeat: Infinity, 
      delay: delay,
      ease: "easeInOut" 
    }}
  />
);

const TetrisL = ({ className, delay }: { className: string; delay: number }) => (
  <motion.div
    className={`absolute ${className}`}
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1, rotate: [0, 10, -10, 0] }}
    transition={{ duration: 1, delay: delay }}
  >
    <div className="grid grid-cols-2 gap-1 w-16 opacity-20">
        <div className="w-7 h-7 bg-brand-primary rounded-md"></div>
        <div className="w-7 h-7 bg-transparent"></div>
        <div className="w-7 h-7 bg-brand-primary rounded-md"></div>
        <div className="w-7 h-7 bg-brand-primary rounded-md"></div>
    </div>
  </motion.div>
);

const TetrisT = ({ className, delay }: { className: string; delay: number }) => (
    <motion.div
      className={`absolute ${className}`}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1, rotate: [0, -5, 5, 0] }}
      transition={{ duration: 1.2, delay: delay }}
    >
      <div className="grid grid-cols-3 gap-1 w-24 opacity-20">
          <div className="w-7 h-7 bg-brand-secondary rounded-md col-start-2"></div>
          <div className="w-7 h-7 bg-brand-secondary rounded-md row-start-2"></div>
          <div className="w-7 h-7 bg-brand-secondary rounded-md row-start-2"></div>
          <div className="w-7 h-7 bg-brand-secondary rounded-md row-start-2"></div>
      </div>
    </motion.div>
  );

export const HeroSection = () => {
  const slide = HERO_SLIDES[0];
  const displayCategories = CATEGORIES.slice(0, 6);
  
  // Define category card colors
  const cardStyles = [
    { bg: 'bg-[#FDF2F8]', text: 'text-pink-600', border: 'border-pink-100' }, 
    { bg: 'bg-[#FFF7ED]', text: 'text-orange-600', border: 'border-orange-100' },
    { bg: 'bg-[#F0FDF4]', text: 'text-green-600', border: 'border-green-100' },
    { bg: 'bg-[#EFF6FF]', text: 'text-blue-600', border: 'border-blue-100' },
    { bg: 'bg-[#FAF5FF]', text: 'text-purple-600', border: 'border-purple-100' },
    { bg: 'bg-[#F8FAFC]', text: 'text-slate-600', border: 'border-slate-100' }, 
  ];

  return (
    // Updated to use THEME.hero.padding to ensure proper mobile spacing
    <section className={`relative w-full flex flex-col justify-center ${THEME.hero.padding} ${THEME.hero.backgroundClass}`}>
      
      {/* --- Animated Background Elements (Clipped here instead) --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top Left Cluster */}
          <Circle className="w-32 h-32 bg-yellow-200/50 top-10 -left-10 blur-xl" delay={0} />
          <Square className="w-24 h-24 bg-blue-100 top-20 left-10" delay={1} rotate={12} />
          <TetrisL className="top-40 left-[10%]" delay={0.5} />

          {/* Top Right Cluster */}
          <Circle className="w-48 h-48 bg-pink-100/60 top-0 right-0 blur-2xl" delay={2} />
          <Square className="w-16 h-16 bg-green-100 top-32 right-20" delay={0.5} rotate={-15} />
          <TetrisT className="top-20 right-[15%]" delay={0.8} />

          {/* Bottom Center Scattered */}
          <Circle className="w-20 h-20 bg-purple-100 bottom-40 left-[30%]" delay={1.5} />
          <Square className="w-12 h-12 bg-orange-100 bottom-60 right-[25%]" delay={2.5} rotate={45} />
          
          {/* Subtle Grid Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="container-custom relative z-10 w-full flex flex-col items-center">
        {/* Main Text Content */}
        <div className={`w-full max-w-5xl flex flex-col items-center text-center z-20 px-4`}>
            
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-4 inline-block"
            >
                <span className="px-4 py-1.5 rounded-full bg-brand-yellow/50 border border-brand-primary/10 text-brand-dark text-xs font-bold uppercase tracking-wider">
                    ✨ India's Favorite Toy Store
                </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`text-5xl md:text-7xl lg:text-8xl ${THEME.global.fontHeading} text-brand-dark mb-6 leading-[1.1] tracking-tight`}
            >
              Play Begins <br/>
              <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-pink-500 to-yellow-500">Here.</span>
                  <svg className="absolute w-full h-4 -bottom-1 left-0 text-yellow-300 -z-10 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`text-lg md:text-xl lg:text-2xl text-slate-500 mb-10 max-w-2xl font-medium leading-relaxed`}
            >
              {slide.subtitle}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4 }}
              className="flex gap-4"
            >
              <Link
                href="/shop"
                className="bg-brand-primary text-white text-base md:text-lg font-bold px-8 py-4 rounded-full hover:bg-brand-dark transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 flex items-center gap-2"
              >
                Shop Now
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
              <Link
                href="/shop?tag=new"
                className="bg-white text-slate-700 border-2 border-slate-100 text-base md:text-lg font-bold px-8 py-4 rounded-full hover:border-brand-primary/20 hover:bg-brand-primary/5 transition-all active:scale-95"
              >
                New Arrivals
              </Link>
            </motion.div>
        </div>
      </div>
      
      {/* Category Overlay Cards - Floating at the bottom */}
      {/* Adjusted to -bottom-28 on mobile to avoid overlapping buttons, kept -bottom-20 on desktop */}
      <div className="absolute -bottom-28 md:-bottom-20 left-0 w-full z-30 pointer-events-none">
          <div className="container-custom pointer-events-auto">
            <div className="flex overflow-x-auto pt-8 pb-8 gap-5 lg:grid lg:grid-cols-6 scrollbar-hide snap-x snap-mandatory px-4 lg:px-0">
                {displayCategories.map((cat, idx) => {
                    const style = cardStyles[idx % cardStyles.length];
                    return (
                        <motion.div
                            key={cat.id}
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 + (idx * 0.1) }}
                            className="flex-shrink-0 snap-start"
                        >
                            <Link 
                                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                                className={`
                                    ${style.bg} border-2 ${style.border}
                                    relative overflow-hidden h-44 rounded-[2rem] p-5 flex flex-col justify-between
                                    transition-all hover:-translate-y-3 hover:shadow-xl group
                                    min-w-[160px] md:min-w-[180px] w-full
                                `}
                            >
                                <span className={`font-bold text-lg leading-tight z-10 relative ${style.text}`}>{cat.name}</span>
                                <div className="absolute bottom-2 right-2 w-24 h-24 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                                     <img 
                                        src={cat.image_url} 
                                        alt={cat.name} 
                                        className="w-full h-full object-contain mix-blend-multiply opacity-90"
                                    />
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
          </div>
      </div>
      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </section>
  );
};
