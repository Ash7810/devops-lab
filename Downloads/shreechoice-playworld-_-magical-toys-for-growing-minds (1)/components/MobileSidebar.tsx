
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '../lib/router';
import { HomeIcon, GridIcon, ShoppingCartIcon, HeartIcon, UserIcon, LogOutIcon, XIcon, ChevronRightIcon } from './icons/Icon';
import { Logo } from './Logo';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { supabase } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    user: any | null;
}

const SidebarItem = ({ icon, label, href, onClick, badge }: { icon: React.ReactNode, label: string, href: string, onClick: () => void, badge?: number }) => (
    <Link href={href} onClick={onClick} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-colors group">
        <div className="flex items-center gap-4">
            <div className="text-slate-400 group-hover:text-brand-primary transition-colors">
                {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-6 h-6" })}
            </div>
            <span className="font-bold text-slate-700 group-hover:text-brand-primary transition-colors">{label}</span>
        </div>
        <div className="flex items-center gap-2">
            {badge !== undefined && badge > 0 && (
                <span className="bg-brand-secondary text-white text-xs font-bold px-2 py-0.5 rounded-full">{badge}</span>
            )}
            <ChevronRightIcon className="w-4 h-4 text-slate-300" />
        </div>
    </Link>
);

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose, user }) => {
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const { showToast } = useToast();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        showToast('Logged out successfully');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />
                    
                    {/* Sidebar Drawer */}
                    <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-white z-[70] shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 bg-brand-yellow/30 border-b border-brand-yellow flex justify-between items-center relative overflow-hidden">
                            {/* Decorative Blobs */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-brand-secondary/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                            <div className="relative z-10">
                                <Logo className="h-8 w-auto mb-2" />
                                <p className="text-sm font-bold text-slate-600">
                                    Hello, <span className="text-brand-primary">{user ? (user.user_metadata?.full_name?.split(' ')[0] || 'Friend') : 'Guest'}</span> 👋
                                </p>
                            </div>
                            <button onClick={onClose} className="relative z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white text-slate-500 shadow-sm hover:text-brand-secondary active:scale-95 transition-all">
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            <SidebarItem icon={<HomeIcon />} label="Home" href="/" onClick={onClose} />
                            <SidebarItem icon={<GridIcon />} label="Shop All Toys" href="/shop" onClick={onClose} />
                            <SidebarItem icon={<ShoppingCartIcon />} label="My Cart" href="/cart" onClick={onClose} badge={cartCount} />
                            <SidebarItem icon={<HeartIcon />} label="Wishlist" href="/wishlist" onClick={onClose} badge={wishlistCount} />
                            
                            <div className="my-4 border-t border-slate-100"></div>
                            
                            <h3 className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">My Account</h3>
                            <SidebarItem icon={<UserIcon />} label={user ? "My Profile" : "Login / Register"} href={user ? "/profile" : "/login"} onClick={onClose} />
                            
                            <div className="my-4 border-t border-slate-100"></div>
                            
                            <h3 className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Support</h3>
                            <Link href="/contact" onClick={onClose} className="block px-4 py-3 text-sm font-medium text-slate-600 hover:text-brand-primary">Contact Us</Link>
                            <Link href="/faq" onClick={onClose} className="block px-4 py-3 text-sm font-medium text-slate-600 hover:text-brand-primary">FAQs</Link>
                            <Link href="/track-order" onClick={onClose} className="block px-4 py-3 text-sm font-medium text-slate-600 hover:text-brand-primary">Track Order</Link>
                        </div>

                        {/* Footer */}
                        {user && (
                            <div className="p-4 border-t border-slate-100">
                                <button onClick={handleLogout} className="flex items-center gap-4 w-full p-4 rounded-xl text-red-500 hover:bg-red-50 font-bold transition-colors">
                                    <LogOutIcon className="w-6 h-6" />
                                    Logout
                                </button>
                            </div>
                        )}
                        {!user && (
                            <div className="p-4 border-t border-slate-100 bg-slate-50">
                                <Link href="/login" onClick={onClose} className="flex items-center justify-center w-full bg-brand-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-brand-primary/20">
                                    Login / Sign Up
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
