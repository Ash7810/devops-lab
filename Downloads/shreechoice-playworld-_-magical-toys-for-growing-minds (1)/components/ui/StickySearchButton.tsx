
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchIcon } from '../icons/Icon';

interface StickySearchButtonProps {
    isVisible: boolean;
    onClick: () => void;
}

export const StickySearchButton: React.FC<StickySearchButtonProps> = ({ isVisible, onClick }) => {
    return (
        <div className="md:hidden">
            <AnimatePresence>
                {isVisible && (
                    <motion.button
                        onClick={onClick}
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed top-4 right-4 z-40 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/50"
                        aria-label="Open search"
                    >
                        <SearchIcon className="w-6 h-6 text-brand-primary" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};
