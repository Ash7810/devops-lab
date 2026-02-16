
import React, { useContext } from 'react';

interface RouterContextType {
    onNavigate: (path: string) => void;
}

export const RouterContext = React.createContext<RouterContextType | null>(null);

export const useRouter = () => {
    const context = useContext(RouterContext);
    if (!context) {
        throw new Error('useRouter must be used within a RouterContext.Provider');
    }
    return context;
};
