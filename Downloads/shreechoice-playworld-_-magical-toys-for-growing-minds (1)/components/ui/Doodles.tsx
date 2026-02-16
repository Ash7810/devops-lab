
import React from 'react';
import { motion } from 'framer-motion';

// A playful dotted path with a paper plane
export const PaperPlaneDoodle = () => (
  <div className="w-full h-24 relative overflow-hidden pointer-events-none opacity-60">
    <svg className="absolute w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 100">
      <path
        d="M0,80 C300,90 400,10 600,50 S900,90 1200,20"
        fill="none"
        stroke="#CBD5E1"
        strokeWidth="2"
        strokeDasharray="8 8"
      />
    </svg>
    <motion.div
        className="absolute top-0 left-0"
        animate={{ 
            offsetDistance: ["0%", "100%"],
            opacity: [0, 1, 1, 0] 
        }}
        transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "linear"
        }}
        style={{ 
            offsetPath: `path("M0,80 C300,90 400,10 600,50 S900,90 1200,20")`,
            width: '40px',
            height: '40px'
        }}
    >
        <svg viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 rotate-90">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
    </motion.div>
  </div>
);

// Scattered shapes like confetti
export const ConfettiDoodle = () => (
    <div className="w-full h-16 relative overflow-hidden pointer-events-none opacity-70">
        <div className="absolute top-2 left-[10%] text-yellow-400">
            <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="currentColor" /></svg>
        </div>
        <div className="absolute top-8 left-[15%] text-pink-400 rotate-12">
            <svg width="20" height="20" viewBox="0 0 20 20"><rect width="15" height="15" fill="currentColor" /></svg>
        </div>
        <div className="absolute top-4 left-[85%] text-blue-400 rotate-45">
            <svg width="24" height="24" viewBox="0 0 24 24"><polygon points="12 2 22 22 2 22" fill="currentColor" /></svg>
        </div>
        <div className="absolute top-10 left-[90%] text-green-400">
            <svg width="18" height="18" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="3" /></svg>
        </div>
        <div className="absolute top-2 left-[50%] text-purple-300">
             <svg width="40" height="10" viewBox="0 0 40 10"><path d="M0,5 Q10,0 20,5 T40,5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
        </div>
    </div>
);

// A bouncing line divider
export const SpringDoodle = () => (
    <div className="w-full h-12 flex items-center justify-center opacity-40 pointer-events-none overflow-hidden">
        <svg width="100%" height="40" preserveAspectRatio="none">
            <path d="M0,20 Q20,5 40,20 T80,20 T120,20 T160,20 T200,20 T240,20 T280,20 T320,20 T360,20 T400,20 T440,20 T480,20 T520,20 T560,20 T600,20 T640,20 T680,20 T720,20 T760,20 T800,20 T840,20 T880,20 T920,20 T960,20 T1000,20 T1040,20 T1080,20 T1120,20 T1160,20 T1200,20" 
                  fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
        </svg>
    </div>
);

// New: ZigZag Divider
export const ZigZagDoodle = () => (
    <div className="w-full flex justify-center opacity-30 pointer-events-none overflow-hidden my-4">
        <svg width="100%" height="30" preserveAspectRatio="none" viewBox="0 0 1200 30">
             <path d="M0,15 L20,5 L40,25 L60,5 L80,25 L100,5 L120,25 L140,5 L160,25 L180,5 L200,25 L220,5 L240,25 L260,5 L280,25 L300,5 L320,25 L340,5 L360,25 L380,5 L400,25 L420,5 L440,25 L460,5 L480,25 L500,5 L520,25 L540,5 L560,25 L580,5 L600,25 L620,5 L640,25 L660,5 L680,25 L700,5 L720,25 L740,5 L760,25 L780,5 L800,25 L820,5 L840,25 L860,5 L880,25 L900,5 L920,25 L940,5 L960,25 L980,5 L1000,25 L1020,5 L1040,25 L1060,5 L1080,25 L1100,5 L1120,25 L1140,5 L1160,25 L1180,5 L1200,25"
                   fill="none" stroke="#F472B6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </div>
);

// New: Star Burst Divider
export const StarBurstDoodle = () => (
    <div className="w-full h-20 relative overflow-hidden pointer-events-none opacity-60">
        <div className="absolute left-[20%] top-2 text-yellow-400 animate-pulse"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></div>
        <div className="absolute right-[20%] top-8 text-blue-400 animate-bounce" style={{animationDuration: '3s'}}><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg></div>
        <div className="absolute left-[50%] top-0 text-pink-300 animate-spin-slow" style={{animationDuration: '8s'}}><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/></svg></div>
    </div>
);

// New: Curved Dotted Line Divider
export const CurvedLineDoodle = () => (
    <div className="w-full flex justify-center opacity-40 pointer-events-none overflow-hidden my-4 text-green-400">
        <svg width="100%" height="40" preserveAspectRatio="none" viewBox="0 0 1200 40">
            <path d="M0,20 Q150,40 300,20 T600,20 T900,20 T1200,20" 
                  fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="12 12" strokeLinecap="round" />
        </svg>
    </div>
);

// New: Cross Pattern Divider
export const CrossPatternDoodle = () => (
    <div className="w-full h-16 relative overflow-hidden pointer-events-none opacity-40 text-slate-300">
        <div className="absolute top-2 left-[5%] text-xl font-bold">+</div>
        <div className="absolute top-8 left-[15%] text-2xl font-bold text-slate-200">+</div>
        <div className="absolute top-4 left-[30%] text-lg font-bold">+</div>
        <div className="absolute top-10 left-[45%] text-xl font-bold text-slate-200">+</div>
        <div className="absolute top-2 left-[60%] text-2xl font-bold">+</div>
        <div className="absolute top-8 left-[75%] text-lg font-bold text-slate-200">+</div>
        <div className="absolute top-4 left-[90%] text-xl font-bold">+</div>
    </div>
);

// New: Loop Line Divider
export const LoopDoodle = () => (
    <div className="w-full flex justify-center opacity-30 pointer-events-none overflow-hidden my-6">
        <svg width="100%" height="50" preserveAspectRatio="none" viewBox="0 0 1200 50">
             <path d="M0,25 C50,25 50,0 100,0 C150,0 150,50 200,50 C250,50 250,0 300,0 C350,0 350,50 400,50 C450,50 450,0 500,0 C550,0 550,50 600,50 C650,50 650,0 700,0 C750,0 750,50 800,50 C850,50 850,0 900,0 C950,0 950,50 1000,50 C1050,50 1050,0 1100,0 C1150,0 1150,25 1200,25"
                   fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
        </svg>
    </div>
);

export const FloatingGrid = () => (
    <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}>
    </div>
);

// A playful, hand-drawn style divider for the footer
export const FooterDoodle = () => (
    <div className="w-full h-8 md:h-16 relative -mb-1 z-30 pointer-events-none overflow-hidden text-slate-300">
         <svg className="w-[110%] -ml-[5%] h-full" viewBox="0 0 1200 40" preserveAspectRatio="none" fill="none">
            {/* Main squiggly line */}
            <path 
                d="M0,20 Q30,5 60,20 T120,20 T180,20 T240,20 T300,20 T360,20 T420,20 T480,20 T540,20 T600,20 T660,20 T720,20 T780,20 T840,20 T900,20 T960,20 T1020,20 T1080,20 T1140,20 T1200,20" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
            />
            {/* Colorful Accents */}
            <circle cx="100" cy="10" r="4" fill="#FF6B6B" opacity="0.8" />
            <circle cx="400" cy="30" r="5" fill="#FBBF24" opacity="0.8" />
            <path d="M700,10 L710,20 M710,10 L700,20" stroke="#34D399" strokeWidth="3" strokeLinecap="round" />
            <circle cx="1000" cy="15" r="4" fill="#60A5FA" opacity="0.8" />
         </svg>
    </div>
);
