
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AGE_GROUPS } from '../constants';
import { Brand, Category } from '../types';
import { ChevronDownIcon } from './icons/Icon';

interface FilterSidebarProps {
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
}

const FilterSection: React.FC<{ 
    title: string; 
    children: React.ReactNode; 
    defaultOpen?: boolean; 
}> = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-gray-200 py-4 last:border-0">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex justify-between items-center bg-transparent group focus:outline-none"
            >
                <span className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                    {title}
                </span>
                <span className={`text-slate-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDownIcon className="w-4 h-4"/>
                </span>
            </button>
            
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-3 pb-1">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
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
    clearFilters
}) => {
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-800">Filters</h2>
                <button onClick={clearFilters} className="text-xs text-red-500 font-bold hover:underline">Clear All</button>
            </div>

            <FilterSection title="Category" defaultOpen={true}>
                <div className="space-y-2">
                    {categories.map(cat => (
                        <label key={cat.id} className="flex items-center cursor-pointer group">
                            <input 
                                type="checkbox" 
                                checked={selectedCategories.includes(cat.name)}
                                onChange={() => handleCategoryChange(cat.name)}
                                className="w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
                            />
                            <span className={`ml-3 text-sm ${selectedCategories.includes(cat.name) ? 'font-bold text-brand-primary' : 'text-slate-600'}`}>
                                {cat.name}
                            </span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            <FilterSection title="Price">
                <input 
                    type="range" 
                    min="100" 
                    max="5000" 
                    step="100"
                    value={priceRange} 
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
                <div className="flex justify-between mt-2 text-xs font-bold text-slate-600">
                    <span>₹100</span>
                    <span>₹{priceRange}</span>
                </div>
            </FilterSection>

            <FilterSection title="Brand" defaultOpen={false}>
                 <div className="space-y-2">
                    {brands.map(brand => (
                        <label key={brand.id} className="flex items-center cursor-pointer group">
                            <input 
                                type="checkbox" 
                                checked={selectedBrands.includes(brand.name)}
                                onChange={() => handleBrandChange(brand.name)}
                                className="w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
                            />
                            <span className="ml-3 text-sm text-slate-600">{brand.name}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>
            
            <FilterSection title="Age" defaultOpen={false}>
                 <div className="flex flex-wrap gap-2">
                    {AGE_GROUPS.map(age => (
                        <label key={age} className="cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={selectedAges.includes(age)}
                                onChange={() => handleAgeChange(age)}
                                className="hidden peer"
                            />
                            <div className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs font-bold text-slate-600 active:scale-95 transition-all peer-checked:bg-brand-primary peer-checked:text-white peer-checked:border-brand-primary">
                                {age}
                            </div>
                        </label>
                    ))}
                </div>
            </FilterSection>
        </div>
    );
};
