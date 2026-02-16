
import React, { createContext, useState, useCallback, useContext, ReactNode } from 'react';
import { Toast } from '../components/Toast';

interface ToastContextType {
    showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = useCallback((message: string) => {
        setToastMessage(message);
    }, []);

    const closeToast = () => {
        setToastMessage(null);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Toast message={toastMessage || ''} isVisible={!!toastMessage} onClose={closeToast} />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
