
import React, { useState, useEffect, Suspense, lazy, useCallback, useMemo } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { supabase } from './lib/supabase';
import { Header } from './components/Header';
import { SiteFooter } from './components/SiteFooter';
import { MobileSidebar } from './components/MobileSidebar'; 
import { RouterContext } from './contexts/RouterContext';

// Providers
import { ToastProvider } from './contexts/ToastContext';
import { CartProvider, useCart } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { DataProvider, useData } from './contexts/DataContext';

// UI
import { FullScreenLoader } from './components/ui/FullScreenLoader';
import { SearchOverlay } from './components/ui/SearchOverlay';
import { StickySearchButton } from './components/ui/StickySearchButton';
import { AnimatedBackground } from './components/ui/AnimatedBackground';

// Types
import type { Product } from './types';

// Define a minimal User type locally to avoid import issues with specific ESM environments
export interface User {
  id: string;
  email?: string;
  user_metadata: {
    full_name?: string;
    [key: string]: any;
  };
  aud: string;
  created_at: string;
}

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AdminPage = lazy(() => import('./pages/admin/AdminPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const OrderDetailsPage = lazy(() => import('./pages/OrderDetailsPage'));

const Router: React.FC<{
    currentPath: string;
    searchParams: string;
    locationKey: number;
    user: User | null;
    isHidden: boolean;
}> = React.memo((props) => {
    const { products } = useData();
    const path = props.currentPath;

    if (path.startsWith('/admin')) {
        return <AdminPage user={props.user} />;
    }

    if (path.startsWith('/product/')) {
        const id = path.split('/')[2];
        const product = products.find(p => p.id === parseInt(id, 10));
        return product ? <ProductPage product={product} /> : <NotFoundPage />;
    }

    if (path.startsWith('/order/')) {
        const id = path.split('/')[2];
        if (!props.user) return <LoginPage />;
        return <OrderDetailsPage orderId={id} />;
    }

    switch (path) {
        case '/': return <HomePage />;
        // Composite key ensures ShopPage remounts on history navigation OR when global search params change
        case '/shop': return <ShopPage key={`${props.locationKey}-${props.searchParams}`} isHidden={props.isHidden} />;
        case '/wishlist': return <WishlistPage />;
        case '/cart': return <CartPage />;
        case '/checkout': return <CheckoutPage user={props.user} />;
        case '/login': return <LoginPage />;
        case '/register': return <RegisterPage />;
        case '/profile': return props.user ? <ProfilePage user={props.user} /> : <LoginPage />;
        default: return <NotFoundPage />;
    }
});

const AppContent = () => {
    const [currentPath, setCurrentPath] = useState(window.location.pathname.replace(/\/$/, '') || '/');
    const [searchParams, setSearchParams] = useState(window.location.search);
    const [locationKey, setLocationKey] = useState(0); // Used to force updates on popstate
    const [user, setUser] = useState<User | null>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
    
    const [isHidden, setIsHidden] = useState(false);
    const { scrollY } = useScroll();
    const [lastY, setLastY] = useState(0);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const diff = latest - lastY;
        if (diff > 0 && latest > 60) {
            setIsHidden(true);
        } else if (diff < 0 || latest < 50) {
            setIsHidden(false);
        }
        setLastY(latest);
    });

    useEffect(() => {
        const onPopState = () => {
            setCurrentPath(window.location.pathname.replace(/\/$/, '') || '/');
            setSearchParams(window.location.search);
            setLocationKey(prev => prev + 1); 
        };
        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, []);
    
    const onNavigate = useCallback((path: string) => {
        try {
            if (path.startsWith('/')) {
                window.history.pushState({}, '', path);
            } else {
                window.location.href = path;
                return;
            }
        } catch (e) {
            console.warn("History pushState failed", e);
        }
        
        const [pathname, hash] = path.split('#');
        setCurrentPath(pathname.split('?')[0].replace(/\/$/, '') || '/');
        
        const questionMarkIndex = pathname.indexOf('?');
        const newSearch = questionMarkIndex !== -1 ? pathname.substring(questionMarkIndex) : '';
        setSearchParams(newSearch);

        if (hash) {
            setTimeout(() => {
                document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
            }, 0);
        } else {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
    }, []);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser((session?.user as User) ?? null);
        };

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = (session?.user as User) ?? null;
            setUser(currentUser);
            if (_event === 'SIGNED_OUT') {
                onNavigate('/');
            }
        });
        
        return () => subscription?.unsubscribe();
    }, [onNavigate]);
    
    // Memoize router context value
    const routerContextValue = useMemo(() => ({ onNavigate }), [onNavigate]);
    
    const isAppPage = !currentPath.startsWith('/admin');
    
    return (
        <RouterContext.Provider value={routerContextValue}>
            <div className="font-sans text-brand-text min-h-screen flex flex-col bg-transparent relative overflow-x-hidden">
                
                <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
                <MobileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} user={user} />

                {isAppPage && <AnimatedBackground />}

                {isAppPage && (
                    <Header 
                        currentPath={currentPath} 
                        user={user} 
                        isHidden={isHidden} 
                        onSearchClick={() => setIsSearchOpen(true)} 
                        onMenuClick={() => setIsSidebarOpen(true)}
                    />
                )}

                <main className={`flex-grow relative ${isAppPage ? 'z-30' : ''}`}>
                    <Suspense fallback={<FullScreenLoader />}>
                        <Router 
                            currentPath={currentPath} 
                            user={user} 
                            isHidden={isHidden} 
                            searchParams={searchParams} 
                            locationKey={locationKey} 
                        />
                    </Suspense>
                </main>

                {isAppPage && (
                    <>
                        <SiteFooter />
                        <StickySearchButton isVisible={isHidden} onClick={() => setIsSearchOpen(true)} />
                    </>
                )}
            </div>
        </RouterContext.Provider>
    );
};

export default function App() {
    return (
        <ToastProvider>
            <WishlistProvider>
                <CartProvider>
                    <DataProvider>
                        <AppContent />
                    </DataProvider>
                </CartProvider>
            </WishlistProvider>
        </ToastProvider>
    );
}
