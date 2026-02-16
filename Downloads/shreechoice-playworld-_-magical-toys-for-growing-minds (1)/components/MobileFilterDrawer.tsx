
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AGE_GROUPS } from '../constants';
import { Brand, Category } from '../types';
import { XIcon, ChevronDownIcon } from './icons/Icon';

interface MobileFilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCategories: string[];
    handleCategoryChange: (category: string) => void;
    priceRange: number;
    setPriceRange: (value: number) => void;
    brands: Brand[];
    selectedBrands: string[];
    handleBrandChange: (brand: string) => void;
    selectedAges: string[];
    handleAgeChange: (age: string) => void;
    categories: Category[];
    clearFilters: () => void;
    productCount: number;
}

const FilterSection = ({ title, children, defaultOpen = true }: { 
    title: string; 
    children?: React.ReactNode; 
    defaultOpen?: boolean; 
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    useEffect(() => {
        if(defaultOpen) setIsOpen(true);
    }, [defaultOpen]);

    return (
        <div className="border-b border-gray-100 last:border-0">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full py-6 px-2 flex justify-between items-center bg-transparent focus:outline-none group"
            >
                <span className={`text-sm font-bold uppercase tracking-wide font-brand transition-colors ${isOpen ? 'text-brand-primary' : 'text-slate-800'}`}>
                    {title}
                </span>
                <span className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-primary' : ''}`}>
                    <ChevronDownIcon className="w-6 h-6"/>
                </span>
            </button>
            
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="pb-8 pt-2">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const MobileFilterDrawer = ({
    isOpen,
    onClose,
    selectedCategories,
    handleCategoryChange,
    priceRange,
    setPriceRange,
    brands,
    selectedBrands,
    handleBrandChange,
    selectedAges,
    handleAgeChange,
    categories,
    clearFilters,
    productCount
}: MobileFilterDrawerProps) => {

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
    
    // Calculate background gradient for slider
    const sliderPercentage = ((priceRange - 100) / (5000 - 100)) * 100;
    const sliderStyle = {
        background: `linear-gradient(to right, #0284c7 ${sliderPercentage}%, #e2e8f0 ${sliderPercentage}%)`
    };

    const hasActiveFilters = selectedCategories.length > 0 || selectedBrands.length > 0 || selectedAges.length > 0 || priceRange < 5000;

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
                        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 w-full h-[85vh] z-[61] bg-white rounded-t-[2rem] shadow-[0_-10px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                            <h2 className="text-xl font-bold text-slate-800 font-brand">Filters</h2>
                            <button 
                                onClick={onClose}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                            >
                                <XIcon className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            
                            {/* Price Filter */}
                            <FilterSection title="Price Range">
                                <div className="px-2">
                                    <input 
                                        type="range" 
                                        min="100" 
                                        max="5000" 
                                        step="100"
                                        value={priceRange} 
                                        onChange={(e) => setPriceRange(Number(e.target.value))}
                                        style={sliderStyle}
                                        className="w-full h-2 rounded-lg appearance-none cursor-pointer mb-8"
                                    />
                                    <div className="flex justify-between items-center">
                                        <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 shadow-sm text-center min-w-[80px]">
                                            <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Min</span>
                                            <div className="text-sm font-bold text-slate-700">₹100</div>
                                        </div>
                                        <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-lg px-4 py-2 shadow-sm text-center min-w-[80px]">
                                            <span className="text-[10px] text-brand-primary/60 block uppercase font-bold tracking-wider">Max</span>
                                            <div className="text-sm font-bold text-brand-primary">₹{priceRange}</div>
                                        </div>
                                    </div>
                                </div>
                            </FilterSection>

                            {/* Categories */}
                            <FilterSection title="Categories" defaultOpen={true}>
                                <div className="space-y-4">
                                    {categories.map(cat => (
                                        <label key={cat.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-transparent active:border-brand-primary active:bg-blue-50 transition-all cursor-pointer">
                                            <span className={`text-base font-medium ${selectedCategories.includes(cat.name) ? 'text-brand-primary font-bold' : 'text-slate-600'}`}>
                                                {cat.name}
                                            </span>
                                            <div className="relative flex items-center">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedCategories.includes(cat.name)}
                                                    onChange={() => handleCategoryChange(cat.name)}
                                                    className="peer appearance-none w-6 h-6 border-2 border-slate-300 rounded-lg bg-white checked:bg-brand-primary checked:border-brand-primary transition-all"
                                                />
                                                <svg className="absolute w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 left-1 top-1 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </FilterSection>

                            {/* Age Group */}
                            <FilterSection title="Age Group" defaultOpen={true}>
                                <div className="flex flex-wrap gap-4">
                                    {AGE_GROUPS.map(age => (
                                        <label key={age} className="cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedAges.includes(age)}
                                                onChange={() => handleAgeChange(age)}
                                                className="hidden peer"
                                            />
                                            <div className="px-6 py-3 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-bold text-slate-600 active:scale-95 transition-all peer-checked:bg-brand-primary peer-checked:text-white peer-checked:border-brand-primary peer-checked:shadow-lg peer-checked:shadow-brand-primary/30">
                                                {age}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </FilterSection>

                            {/* Brands */}
                            <FilterSection title="Brands" defaultOpen={selectedBrands.length > 0}>
                                <div className="space-y-4">
                                    {brands.map(brand => (
                                        <label key={brand.id} className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                            <div className="relative flex items-center">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedBrands.includes(brand.name)}
                                                    onChange={() => handleBrandChange(brand.name)}
                                                    className="peer appearance-none w-6 h-6 border-2 border-slate-300 rounded-md bg-white checked:bg-brand-primary checked:border-brand-primary transition-all"
                                                />
                                                <svg className="absolute w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 left-1 top-1 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            </div>
                                            <span className={`ml-4 text-base font-medium ${selectedBrands.includes(brand.name) ? 'text-brand-primary font-bold' : 'text-slate-600'}`}>
                                                {brand.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </FilterSection>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex gap-4 pb-safe">
                            <button 
                                onClick={clearFilters}
                                disabled={!hasActiveFilters}
                                className="flex-1 py-4 px-6 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                            >
                                Reset
                            </button>
                            <button 
                                onClick={onClose}
                                className="flex-[2] py-4 px-6 rounded-xl bg-brand-primary text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-brand-primary/30 active:scale-95 transition-transform"
                            >
                                Show {productCount} Results
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
