
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCartIcon, SearchIcon, UserIcon, ChevronDownIcon, StarIcon, MenuIcon } from './icons/Icon';
import { Logo } from './Logo';
import { Link } from '../lib/router';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useData } from '../contexts/DataContext';
import { useRouter } from '../contexts/RouterContext';
import { formatCurrency } from '../lib/utils';

interface HeaderProps {
  user: any | null;
  currentPath: string;
  isHidden: boolean;
  onSearchClick: () => void;
  onMenuClick: () => void;
}

const NavLink = ({ href, active, children }: { href: string; active: boolean; children?: React.ReactNode }) => (
  <Link 
    href={href} 
    className={`
      text-sm font-bold transition-colors duration-200 flex items-center gap-1
      ${active ? 'text-brand-primary' : 'text-slate-600 hover:text-brand-primary'}
    `}
  >
    {children}
  </Link>
);

export const Header = ({ user, currentPath, isHidden, onSearchClick, onMenuClick }: HeaderProps) => {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { categories, products } = useData();
  const { onNavigate } = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
              setIsSearchFocused(false);
          }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
          onNavigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
          setIsSearchFocused(false);
      }
  };

  const filteredProducts = useMemo(() => {
      if (!searchQuery.trim()) return [];
      return products.filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
  }, [searchQuery, products]);

  return (
      <motion.nav 
        variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }} 
        animate={isHidden ? "hidden" : "visible"} 
        transition={{ duration: 0.3, ease: "easeInOut" }} 
        className="fixed top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300"
      >
        <div className="container-custom flex flex-col md:block">
            {/* Top Row: Brand, Menu, Icons */}
            <div className="flex items-center justify-between h-16 md:h-20 gap-4">
                
                {/* Left Section: Menu (Mobile) & Logo */}
                <div className="flex-shrink-0 flex items-center gap-2 md:gap-4">
                    {/* Mobile Menu Trigger */}
                    <button 
                        onClick={onMenuClick} 
                        className="md:hidden p-2 -ml-2 text-slate-700 hover:text-brand-primary active:scale-95 transition-all rounded-full hover:bg-gray-100"
                        aria-label="Open Menu"
                    >
                        <MenuIcon className="w-7 h-7" />
                    </button>

                    <Link href="/" className="relative z-10 block">
                        <Logo className="h-8 md:h-10 w-auto" />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-8">
                    {/* Categories Dropdown */}
                    <div 
                        className="relative group"
                        onMouseEnter={() => setIsCategoryOpen(true)}
                        onMouseLeave={() => setIsCategoryOpen(false)}
                    >
                        <Link href="/shop" className="flex items-center gap-1 text-sm font-bold text-slate-800 cursor-pointer hover:text-brand-primary py-4">
                            Categories <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`}/>
                        </Link>
                        
                        <AnimatePresence>
                            {isCategoryOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute top-[80%] left-0 w-56 bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden py-2 z-50"
                                >
                                    {categories.slice(0, 8).map(cat => (
                                        <Link 
                                            key={cat.id} 
                                            href={`/shop?category=${encodeURIComponent(cat.name)}`}
                                            className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-primary font-medium transition-colors"
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                    <div className="border-t border-gray-100 mt-2 pt-2">
                                        <Link href="/shop" className="block px-4 py-2 text-xs font-bold text-brand-primary hover:underline text-center">
                                            View All Categories
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <NavLink href="/shop?tag=deals" active={currentPath.includes('deals')}>Deals</NavLink>
                    <NavLink href="/shop?tag=new" active={currentPath.includes('new')}>What's New</NavLink>
                    <NavLink href="/track-order" active={false}>Track Order</NavLink>
                </div>

                {/* Search Bar - Desktop Only */}
                <div className="hidden md:flex flex-1 max-w-md relative h-full items-center" ref={searchContainerRef}>
                    <form onSubmit={handleSearchSubmit} className="w-full relative z-20">
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            placeholder="Search for toys..." 
                            className={`w-full bg-gray-100 text-sm font-medium py-3 pl-5 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all border border-transparent ${isSearchFocused ? 'bg-white border-brand-primary/20 shadow-lg' : ''}`}
                        />
                        <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-brand-primary transition-colors">
                            <SearchIcon className="w-4 h-4" />
                        </button>
                    </form>

                    {/* Desktop Search Suggestions */}
                    <AnimatePresence>
                        {isSearchFocused && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-16 left-0 right-0 bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-30 p-4"
                            >
                                {searchQuery.trim() ? (
                                    <>
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Suggestions</h3>
                                        <div className="space-y-2">
                                            {filteredProducts.length > 0 ? (
                                                filteredProducts.map(product => (
                                                    <Link 
                                                        key={product.id} 
                                                        href={`/product/${product.id}`}
                                                        onClick={() => setIsSearchFocused(false)}
                                                        className="flex items-center gap-4 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                                                    >
                                                        <div className="w-12 h-12 bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1">
                                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-bold text-slate-700 truncate group-hover:text-brand-primary transition-colors">{product.name}</h4>
                                                            <div className="flex items-center gap-1 mt-0.5">
                                                                <StarIcon className="w-3 h-3 text-yellow-400 fill-current" />
                                                                <span className="text-[10px] text-gray-500 font-medium">{product.rating}</span>
                                                            </div>
                                                        </div>
                                                        <div className="font-bold text-sm text-brand-primary">
                                                            {formatCurrency(product.price)}
                                                        </div>
                                                    </Link>
                                                ))
                                            ) : (
                                                <div className="text-center py-4 text-sm text-gray-500 font-medium">No products found</div>
                                            )}
                                            {filteredProducts.length > 0 && (
                                                <Link href={`/shop?q=${encodeURIComponent(searchQuery)}`} onClick={() => setIsSearchFocused(false)} className="block text-center text-xs font-bold text-brand-primary hover:underline pt-2">
                                                    View all results
                                                </Link>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Popular Categories</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {categories.slice(0, 6).map((cat) => (
                                                <div 
                                                    key={cat.id} 
                                                    onClick={() => {
                                                        onNavigate(`/shop?category=${encodeURIComponent(cat.name)}`);
                                                        setIsSearchFocused(false);
                                                    }}
                                                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
                                                >
                                                    <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                        <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-700 group-hover:text-brand-primary transition-colors line-clamp-1">{cat.name}</p>
                                                        <p className="text-[10px] text-gray-400 font-medium">
                                                            {Math.floor(cat.id * 34 + 12)} items available
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Icons / Account */}
                <div className="flex items-center gap-4 sm:gap-6">
                    <Link href="/profile" className="hidden sm:flex items-center gap-2 text-slate-700 hover:text-brand-primary transition-colors group">
                        <div className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <UserIcon className="w-5 h-5"/>
                        </div>
                        <span className="text-sm font-bold">Account</span>
                    </Link>
                    
                    <Link href="/cart" className="flex items-center gap-2 text-slate-700 hover:text-brand-primary transition-colors group relative">
                        <div className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <ShoppingCartIcon className="w-5 h-5"/>
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 bg-brand-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                        <span className="text-sm font-bold hidden sm:block">Cart</span>
                    </Link>
                </div>
            </div>

            {/* Mobile Search Bar - Visible only on mobile */}
            <div className="md:hidden px-4 pb-4">
                <button 
                    onClick={onSearchClick} 
                    className="w-full bg-gray-100 text-slate-500 font-medium py-3 px-4 rounded-xl flex items-center gap-3 hover:bg-gray-200 transition-colors border border-transparent focus:border-brand-primary/30"
                >
                    <SearchIcon className="w-5 h-5 text-slate-400" />
                    <span className="text-sm">Search for products...</span>
                </button>
            </div>
        </div>
      </motion.nav>
  );
};
