
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ProductGrid } from '../components/ProductGrid';
import { FilterSidebar } from '../components/FilterSidebar';
import { MobileFilterDrawer } from '../components/MobileFilterDrawer';
import { Pagination } from '../components/ui/Pagination';
import { EmptyBoxIcon, ChevronDownIcon } from '../components/icons/Icon';
import { SkeletonCard } from '../components/SkeletonCard';
import { useData } from '../contexts/DataContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import { THEME } from '../theme.config';

const FilterChip = ({ label, active, onClick, hasDropdown }: { label: string; active?: boolean; onClick?: () => void; hasDropdown?: boolean }) => (
    <button 
        onClick={onClick}
        className={`
            flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-all whitespace-nowrap
            ${active 
                ? 'bg-brand-primary text-white border-brand-primary shadow-md transform scale-105' 
                : 'bg-white text-slate-600 border-gray-200 hover:bg-gray-50 shadow-sm'}
        `}
    >
        {label}
        {hasDropdown && <ChevronDownIcon className={`w-3 h-3 ${active ? 'text-white' : 'text-slate-500'}`} />}
    </button>
);

const PRODUCTS_PER_PAGE = 12;

const ShopPage: React.FC<{ isHidden: boolean }> = ({ isHidden }) => {
    const { brands, categories, banners } = useData();
    useDocumentTitle('Shop All Toys');
    const topOfGridRef = useRef<HTMLDivElement>(null);

    // Initial State extractors
    const getInitialArray = (key: string) => {
        const params = new URLSearchParams(window.location.search);
        const paramValue = params.getAll(key);
        if (paramValue.length === 1 && paramValue[0].includes(',')) {
            return paramValue[0].split(',');
        }
        return paramValue;
    };

    // Filter states
    const [searchQuery, setSearchQuery] = useState(() => new URLSearchParams(window.location.search).get('q') || '');
    const [selectedCategories, setSelectedCategories] = useState<string[]>(() => getInitialArray('category'));
    const [selectedBrands, setSelectedBrands] = useState<string[]>(() => getInitialArray('brand'));
    const [selectedAges, setSelectedAges] = useState<string[]>(() => getInitialArray('age'));
    
    const [priceRange, setPriceRange] = useState<number>(() => Number(new URLSearchParams(window.location.search).get('price')) || 5000);
    const [sortBy, setSortBy] = useState(() => new URLSearchParams(window.location.search).get('sort') || 'relevance');
    const [currentPage, setCurrentPage] = useState(1);
    
    // Data states
    const [shopProducts, setShopProducts] = useState<Product[]>([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [isShopLoading, setIsShopLoading] = useState(true);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // URL Synchronization Effect
    useEffect(() => {
        const params = new URLSearchParams();
        
        if (searchQuery) params.set('q', searchQuery);
        selectedCategories.forEach(c => params.append('category', c));
        selectedBrands.forEach(b => params.append('brand', b));
        selectedAges.forEach(a => params.append('age', a));
        if (priceRange < 5000) params.set('price', priceRange.toString());
        if (sortBy !== 'relevance') params.set('sort', sortBy);

        const newSearch = params.toString();
        const newUrl = newSearch ? `${window.location.pathname}?${newSearch}` : window.location.pathname;

        if (window.location.search !== `?${newSearch}` && window.location.search !== newSearch) {
            window.history.replaceState(null, '', newUrl);
        }
    }, [searchQuery, selectedCategories, selectedBrands, selectedAges, priceRange, sortBy]);

    // Fetch Logic
    useEffect(() => {
        const fetchFilteredProducts = async () => {
            setIsShopLoading(true);
            let query = supabase.from('products').select('*', { count: 'exact' });
            
            if (searchQuery) query = query.ilike('name', `%${searchQuery}%`);
            
            if (selectedCategories.length > 0) query = query.in('category', selectedCategories);
            if (selectedBrands.length > 0) query = query.in('brand', selectedBrands);
            if (selectedAges.length > 0) query = query.in('age_group', selectedAges);
            
            query = query.lte('price', priceRange);
            
            if (sortBy === 'price-low') query = query.order('price', { ascending: true });
            else if (sortBy === 'price-high') query = query.order('price', { ascending: false });
            else if (sortBy === 'newest') query = query.order('created_at', { ascending: false });
            else query = query.order('id', { ascending: false }); 

            const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
            query = query.range(startIndex, startIndex + PRODUCTS_PER_PAGE - 1);

            const { data, count } = await query;
            setShopProducts(data as Product[] || []);
            setTotalProducts(count || 0);
            setIsShopLoading(false);
        };
        
        const timer = setTimeout(() => {
            fetchFilteredProducts();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, selectedCategories, selectedBrands, selectedAges, priceRange, sortBy, currentPage]);

    const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

    const toggleSelection = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
        if (list.includes(item)) setList(prev => prev.filter(i => i !== item));
        else setList(prev => [...prev, item]);
        setCurrentPage(1);
    };

    const handleCategoryChange = (cat: string) => toggleSelection(cat, selectedCategories, setSelectedCategories);
    const handleBrandChange = (brand: string) => toggleSelection(brand, selectedBrands, setSelectedBrands);
    const handleAgeChange = (age: string) => toggleSelection(age, selectedAges, setSelectedAges);

    const clearFilters = () => {
        setSelectedCategories([]);
        setSelectedBrands([]);
        setSelectedAges([]);
        setPriceRange(5000);
        setSearchQuery('');
        setCurrentPage(1);
    };

    // Find the shop promo banner
    const promoBanner = banners.find(b => b.slug === 'shop-promo');

    return (
        <div className="pt-40 md:pt-24 pb-12 font-sans bg-transparent min-h-screen">
            <MobileFilterDrawer 
                isOpen={showMobileFilters} 
                onClose={() => setShowMobileFilters(false)} 
                selectedCategories={selectedCategories} 
                handleCategoryChange={handleCategoryChange} 
                priceRange={priceRange} 
                setPriceRange={setPriceRange} 
                brands={brands} 
                selectedBrands={selectedBrands} 
                handleBrandChange={handleBrandChange} 
                selectedAges={selectedAges} 
                handleAgeChange={handleAgeChange} 
                categories={categories} 
                clearFilters={clearFilters} 
                productCount={totalProducts} 
            />
            
            <div className="container-custom">
                {/* Redesigned Promo Banner for Shop Page */}
                {(!promoBanner || promoBanner.is_active) && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className={`w-full ${THEME.promo.shape} relative overflow-hidden shadow-xl min-h-[300px] flex items-center justify-center mb-10`}
                        style={{
                            backgroundColor: promoBanner?.background_color || '#8B5CF6',
                            backgroundImage: promoBanner?.image_url ? `url(${promoBanner.image_url})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            color: promoBanner?.text_color || '#ffffff'
                        }}
                    >
                        {/* Overlay if image exists */}
                        {promoBanner?.image_url && <div className="absolute inset-0 bg-black/40 z-0"></div>}

                        {/* Background Pattern (Only if no image for clean look) */}
                        {!promoBanner?.image_url && (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-violet-600 bg-[length:200%_200%] animate-gradient-xy z-0"></div>
                                <div className="absolute inset-0 opacity-20 z-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                                <motion.div animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute -top-16 -right-16 w-64 h-64 border-4 border-white/20 border-dashed rounded-full z-0"></motion.div>
                            </>
                        )}
                        
                        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl">
                            <motion.span 
                                initial={{ scale: 0, rotate: -10 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", delay: 0.2 }}
                                className="inline-block py-2 px-4 rounded-xl bg-white/20 text-xs md:text-sm font-bold uppercase tracking-wider mb-4 border border-white/30 backdrop-blur-md shadow-sm"
                                style={{ color: promoBanner?.text_color || '#ffffff' }}
                            >
                                🎉 {promoBanner?.subtitle || 'Limited Time Offer'}
                            </motion.span>
                            <h1 className={`text-3xl md:text-5xl font-heading font-bold mb-6 leading-tight drop-shadow-md`} style={{ color: promoBanner?.text_color || '#ffffff' }}>
                                {promoBanner?.title || 'Grab Up to 50% Off On Selected Toys'}
                            </h1>
                            <motion.button 
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className={`bg-white text-violet-600 font-bold py-3.5 px-10 rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_30px_rgba(255,255,255,0.3)] transition-all flex items-center gap-2`}
                            >
                                {promoBanner?.button_text || 'Shop Sale Items'}
                                <ChevronDownIcon className="w-4 h-4 rotate-[-90deg]"/>
                            </motion.button>
                        </div>
                        <style>{`
                            @keyframes gradient-xy {
                                0% { background-position: 0% 0%; }
                                50% { background-position: 100% 100%; }
                                100% { background-position: 0% 0%; }
                            }
                            .animate-gradient-xy {
                                animation: gradient-xy 10s ease infinite;
                            }
                        `}</style>
                    </motion.div>
                )}

                {/* Main Layout: Sidebar + Grid */}
                <div className="flex flex-col lg:flex-row gap-8 items-start relative">
                    
                    {/* Desktop Sidebar - Sticky Logic */}
                    <div className={`hidden lg:block w-64 flex-shrink-0 sticky transition-all duration-300 z-10 h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide pb-10 ${isHidden ? 'top-4' : 'top-28'}`}>
                        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-sm border border-white/50">
                            <FilterSidebar 
                                selectedCategories={selectedCategories} 
                                handleCategoryChange={handleCategoryChange} 
                                priceRange={priceRange} 
                                setPriceRange={setPriceRange} 
                                brands={brands} 
                                selectedBrands={selectedBrands} 
                                handleBrandChange={handleBrandChange} 
                                selectedAges={selectedAges} 
                                handleAgeChange={handleAgeChange} 
                                categories={categories} 
                                clearFilters={clearFilters}
                            />
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 w-full">
                        {/* Mobile/Tablet Horizontal Filter Bar */}
                        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 bg-transparent z-30 py-2 lg:hidden">
                            <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                                <FilterChip label="Filters" active={selectedCategories.length > 0 || selectedBrands.length > 0 || selectedAges.length > 0} onClick={() => setShowMobileFilters(true)} hasDropdown={false} />
                                <FilterChip label="Category" hasDropdown active={selectedCategories.length > 0} onClick={() => setShowMobileFilters(true)} />
                                <FilterChip label="Price" hasDropdown active={priceRange < 5000} onClick={() => setShowMobileFilters(true)} />
                                <FilterChip label="Brand" hasDropdown active={selectedBrands.length > 0} onClick={() => setShowMobileFilters(true)} />
                            </div>
                            
                            <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                                <span className="text-sm font-bold text-gray-500">Sort by:</span>
                                <select 
                                    className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 font-bold text-sm text-brand-primary focus:outline-none cursor-pointer"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                     <option value="relevance">Relevance</option>
                                     <option value="price-low">Price: Low to High</option>
                                     <option value="price-high">Price: High to Low</option>
                                     <option value="newest">Newest First</option>
                                </select>
                            </div>
                        </div>

                        {/* Desktop Sort Bar */}
                        <div className="hidden lg:flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-brand-dark">Toys For You! <span className="text-base font-normal text-gray-500 ml-2">({totalProducts} items)</span></h2>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-gray-500">Sort by:</span>
                                <select 
                                    className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 font-bold text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer hover:bg-white transition-colors"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                     <option value="relevance">Relevance</option>
                                     <option value="price-low">Price: Low to High</option>
                                     <option value="price-high">Price: High to Low</option>
                                     <option value="newest">Newest First</option>
                                </select>
                            </div>
                        </div>

                        <div className="min-h-[600px]" ref={topOfGridRef}>
                            {isShopLoading ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {Array.from({ length: 9 }).map((_, index) => <SkeletonCard key={index} />)}
                                </div>
                            ) : shopProducts.length > 0 ? (
                                <ProductGrid products={shopProducts} />
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-24 bg-white/80 backdrop-blur-md rounded-[2rem] border-2 border-dashed border-gray-200 text-center"
                                >
                                     <div className="w-24 h-24 bg-brand-yellow/30 rounded-full flex items-center justify-center mb-6 text-brand-primary">
                                        <EmptyBoxIcon className="w-10 h-10" />
                                     </div>
                                     <h3 className="text-2xl font-heading font-bold text-brand-dark">Uh oh! No toys here.</h3>
                                     <p className="text-slate-500 mt-2 max-w-xs font-medium">We couldn't find any matches. Try adjusting your filters or search for something else.</p>
                                     <button 
                                        onClick={clearFilters} 
                                        className="mt-8 text-white bg-brand-primary px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-brand-primary/40 hover:-translate-y-1 transition-all active:scale-95"
                                     >
                                        Clear All Filters
                                     </button>
                                </motion.div>
                            )}
                        </div>

                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopPage;
