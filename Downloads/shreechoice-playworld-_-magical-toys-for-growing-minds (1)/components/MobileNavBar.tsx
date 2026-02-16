
import React from 'react';
import { HomeIcon, GridIcon, ShoppingCartIcon, UserIcon } from './icons/Icon';
import { motion } from 'framer-motion';
import { Link } from '../lib/router';

interface MobileNavBarProps {
    cartCount: number;
    currentPath: string;
}

const NavItem = ({ icon, label, href, isActive, badge }: { 
    icon: React.ReactNode; 
    label: string; 
    href: string;
    isActive: boolean;
    badge?: number;
}) => {
    return (
        <Link href={href} className="flex flex-col items-center justify-center w-full h-full relative transition-colors focus:outline-none group">
            <div className="relative flex flex-col items-center justify-center gap-1">
                 {isActive && (
                    <motion.div
                        layoutId="activeMobileTab"
                        className="absolute inset-0 bg-brand-primary/10 rounded-2xl -z-10"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                 )}
                
                <div className="relative p-1">
                    {React.cloneElement(icon as React.ReactElement<{ className?: string, fill?: string }>, { 
                        className: `w-6 h-6 transition-all duration-300 ${isActive ? 'text-brand-primary' : 'text-slate-400 group-hover:text-slate-600'}`,
                        fill: isActive ? 'currentColor' : 'none'
                    })}
                    {badge !== undefined && badge > 0 ? (
                        <span className="absolute -top-1 -right-1 bg-brand-secondary text-white text-[9px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                            {badge}
                        </span>
                    ) : null}
                </div>
            </div>
        </Link>
    );
};

export const MobileNavBar = ({ cartCount, currentPath }: MobileNavBarProps) => {
    const isPathActive = (paths: string[]) => paths.some(path => currentPath.startsWith(path) && (currentPath === path || path !== '/'));

    return (
        <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
            <div className="bg-white/90 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-[32px] h-[70px] px-2 flex justify-around items-center">
                <NavItem icon={<HomeIcon />} label="Home" href="/" isActive={currentPath === '/'} />
                <NavItem icon={<GridIcon />} label="Shop" href="/shop" isActive={isPathActive(['/shop', '/product'])} />
                <NavItem icon={<ShoppingCartIcon />} label="Cart" href="/cart" isActive={isPathActive(['/cart', '/checkout'])} badge={cartCount} />
                <NavItem icon={<UserIcon />} label="Account" href="/profile" isActive={isPathActive(['/profile', '/login', '/register'])} />
            </div>
        </div>
    );
};
