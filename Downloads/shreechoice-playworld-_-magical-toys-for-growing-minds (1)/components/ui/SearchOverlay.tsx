
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchIcon, XIcon, ChevronLeftIcon, StarIcon, ChevronRightIcon } from '../icons/Icon';
import { useRouter } from '../../contexts/RouterContext';
import { useData } from '../../contexts/DataContext';
import { formatCurrency } from '../../lib/utils';
import { Link } from '../../lib/router';

export const SearchOverlay = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) => {
    const [inputValue, setInputValue] = useState('');
    const { onNavigate } = useRouter();
    const { products, categories } = useData();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Focus input after animation
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            document.body.style.overflow = 'unset';
            setInputValue('');
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (inputValue.trim()) {
            onNavigate(`/shop?q=${encodeURIComponent(inputValue.trim())}`);
            onClose();
        }
    };

    const filteredProducts = useMemo(() => {
        if (!inputValue.trim()) return [];
        const query = inputValue.toLowerCase();
        return products.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.category.toLowerCase().includes(query) ||
            p.brand.toLowerCase().includes(query)
        ).slice(0, 6);
    }, [inputValue, products]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: 20 }} 
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-0 z-[100] bg-white flex flex-col"
                >
                    {/* Header with Input */}
                    <div className="flex items-center gap-3 p-4 border-b border-gray-100 shadow-sm bg-white z-10">
                        <button onClick={onClose} className="p-2 -ml-2 text-slate-500 hover:text-slate-800 rounded-full active:bg-slate-100">
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>
                        <form onSubmit={handleSubmit} className="flex-1 relative">
                            <input 
                                ref={inputRef}
                                type="text" 
                                value={inputValue} 
                                onChange={(e) => setInputValue(e.target.value)} 
                                placeholder="Search for toys, brands..." 
                                className="w-full bg-gray-100 text-slate-800 text-base font-medium py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:bg-white transition-all" 
                            />
                            {inputValue && (
                                <button type="button" onClick={() => setInputValue('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    <XIcon className="w-4 h-4" />
                                </button>
                            )}
                        </form>
                        <button onClick={() => handleSubmit()} className="p-2 bg-brand-primary text-white rounded-xl shadow-md active:scale-95 transition-transform">
                            <SearchIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Results Area */}
                    <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4">
                        {inputValue.trim() ? (
                            <div className="space-y-4">
                                {filteredProducts.length > 0 ? (
                                    <>
                                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                            {filteredProducts.map((product) => (
                                                <div 
                                                    key={product.id}
                                                    onClick={() => { onNavigate(`/product/${product.id}`); onClose(); }}
                                                    className="flex items-center gap-4 p-3 border-b border-gray-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer"
                                                >
                                                    <div className="w-14 h-14 bg-gray-50 rounded-lg p-1 border border-gray-100 flex-shrink-0">
                                                        <img src={product.image_url} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{product.name}</h4>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="flex items-center gap-0.5 bg-green-50 px-1.5 py-0.5 rounded text-[10px] font-bold text-green-700">
                                                                {product.rating} <StarIcon className="w-2.5 h-2.5 fill-current" />
                                                            </div>
                                                            <span className="text-xs text-gray-400">({product.reviews})</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="block font-bold text-brand-primary text-sm">{formatCurrency(product.price)}</span>
                                                        {product.original_price && (
                                                            <span className="block text-[10px] text-gray-400 line-through">{formatCurrency(product.original_price)}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            <button 
                                                onClick={() => handleSubmit()} 
                                                className="w-full py-3 text-center text-sm font-bold text-brand-primary hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                                            >
                                                See all results for "{inputValue}" <ChevronRightIcon className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <SearchIcon className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-slate-500 font-medium">No matches found for "{inputValue}"</h3>
                                        <p className="text-xs text-gray-400 mt-2">Try checking your spelling or use more general terms.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Popular Categories */}
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Popular Categories</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.slice(0, 6).map((cat) => (
                                            <button 
                                                key={cat.id} 
                                                onClick={() => { onNavigate(`/shop?category=${encodeURIComponent(cat.name)}`); onClose(); }}
                                                className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-600 hover:border-brand-primary hover:text-brand-primary transition-all shadow-sm"
                                            >
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Trending Searches - Fake Data for UI */}
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Trending</h3>
                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                        {['Lego Sets', 'Barbie Dolls', 'Remote Control Cars', 'Educational Games'].map((term, idx) => (
                                            <button 
                                                key={idx}
                                                onClick={() => { onNavigate(`/shop?q=${encodeURIComponent(term)}`); onClose(); }}
                                                className="w-full flex items-center gap-3 p-4 border-b border-gray-100 last:border-0 hover:bg-slate-50 text-left"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                                    <SearchIcon className="w-4 h-4" />
                                                </div>
                                                <span className="font-bold text-slate-700 text-sm">{term}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
