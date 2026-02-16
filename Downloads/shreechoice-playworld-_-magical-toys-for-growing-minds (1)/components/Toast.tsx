
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from './icons/Icon';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const Toast = ({ message, isVisible, onClose }: ToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // Increased duration
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="fixed top-auto bottom-24 left-6 right-6 sm:bottom-auto sm:top-24 sm:left-auto z-[200]"
        >
          <div className="clay-panel bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-2xl flex items-center justify-between max-w-sm mx-auto">
            <div className="flex items-center gap-3">
                <div className="bg-play-green/20 text-play-green rounded-full p-2 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <span className="font-semibold text-sm text-brand-primary">{message}</span>
            </div>
            <button 
              onClick={onClose} 
              className="ml-4 text-gray-400 hover:text-gray-800 flex-shrink-0"
              aria-label="Close toast"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
