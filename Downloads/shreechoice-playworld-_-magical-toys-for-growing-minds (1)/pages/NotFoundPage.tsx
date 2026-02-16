
import React from 'react';
import { Link } from '../lib/router';
import { motion } from 'framer-motion';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';
import { HomeIcon, SearchIcon } from '../components/icons/Icon';

const NotFoundPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-slate-50 text-center px-4">
            <AnimatedBackground />
            
            <div className="relative z-10 max-w-2xl w-full">
                {/* 404 Graphic */}
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="relative h-48 md:h-64 w-full flex items-center justify-center mb-8"
                >
                    {/* Abstract '404' composed of shapes */}
                    <div className="flex items-end gap-2 md:gap-4">
                        {/* 4 */}
                        <motion.div 
                            animate={{ y: [0, -10, 0], rotate: [0, -2, 0] }} 
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="w-20 h-28 md:w-28 md:h-36 bg-brand-secondary rounded-2xl relative shadow-[4px_4px_0px_rgba(0,0,0,0.1)] flex items-center justify-center border-4 border-white"
                        >
                            <span className="text-7xl md:text-8xl font-heading font-bold text-white">4</span>
                        </motion.div>
                        
                        {/* 0 (Sad Face) */}
                        <motion.div 
                            animate={{ rotate: [0, 5, -5, 0] }} 
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                            className="w-24 h-24 md:w-32 md:h-32 bg-brand-primary rounded-full relative shadow-[4px_4px_0px_rgba(0,0,0,0.1)] flex items-center justify-center border-4 border-white mb-2"
                        >
                            <div className="flex flex-col items-center gap-3 mt-4">
                                <div className="flex gap-3">
                                    <div className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-full animate-blink"></div>
                                    <div className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-full animate-blink" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                                <svg width="40" height="12" viewBox="0 0 40 12" className="text-white fill-none stroke-current stroke-[4] stroke-round">
                                    <path d="M2 10 Q 20 0 38 10" />
                                </svg>
                            </div>
                        </motion.div>

                        {/* 4 */}
                        <motion.div 
                            animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }} 
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
                            className="w-20 h-28 md:w-28 md:h-36 bg-brand-accent rounded-2xl relative shadow-[4px_4px_0px_rgba(0,0,0,0.1)] flex items-center justify-center border-4 border-white"
                        >
                            <span className="text-7xl md:text-8xl font-heading font-bold text-white">4</span>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-6xl font-heading font-bold text-brand-dark mb-4"
                >
                    Uh-oh! Wrong Turn?
                </motion.h1>
                
                <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg md:text-xl text-slate-500 mb-10 font-medium max-w-lg mx-auto leading-relaxed"
                >
                    Looks like this page is playing hide and seek. Let's get you back to the fun stuff before the toys get lonely!
                </motion.p>

                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link href="/" className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-brand-primary/40 hover:-translate-y-1 transition-all active:scale-95 text-lg group">
                        <HomeIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Go Home
                    </Link>
                    <Link href="/shop" className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 hover:border-brand-primary/30 transition-all active:scale-95 text-lg group">
                        <SearchIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Find Toys
                    </Link>
                </motion.div>
            </div>
            
            <style>{`
                @keyframes blink {
                    0%, 100% { transform: scaleY(1); }
                    5% { transform: scaleY(0.1); }
                }
                .animate-blink {
                    animation: blink 4s infinite;
                }
            `}</style>
        </div>
    );
};

export default NotFoundPage;
