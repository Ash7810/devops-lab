
import React, { useRef } from 'react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ChevronLeftIcon, ChevronRightIcon } from './icons/Icon';
import { SkeletonCard } from './SkeletonCard';
import { THEME } from '../theme.config';

interface FeaturedSectionProps {
    products: Product[]; 
    isLoading?: boolean;
    title?: string;
    className?: string;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({ products, isLoading, title = "Trending Products", className = "" }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = 350;
            current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    if (isLoading) {
        return (
            <div className="w-full">
                <div className="flex justify-between items-end mb-8">
                     <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            </div>
        );
    }

    return (
        <section className={`relative ${className}`}>
            <div className="w-full relative z-10">
                <div className="flex justify-between items-end mb-8">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading text-brand-dark leading-tight">
                        {title}
                    </h2>
                    
                    <div className="hidden md:flex gap-3">
                        <button onClick={() => scroll('left')} aria-label="Scroll left" className="w-12 h-12 rounded-full bg-white hover:bg-brand-primary hover:text-white border border-slate-200 flex items-center justify-center transition-all shadow-sm group">
                            <ChevronLeftIcon className="w-5 h-5 group-hover:scale-110 transition-transform"/>
                        </button>
                        <button onClick={() => scroll('right')} aria-label="Scroll right" className="w-12 h-12 rounded-full bg-white hover:bg-brand-primary hover:text-white border border-slate-200 flex items-center justify-center transition-all shadow-sm group">
                            <ChevronRightIcon className="w-5 h-5 group-hover:scale-110 transition-transform"/>
                        </button>
                    </div>
                </div>
                
                {/* Horizontal Scroll Container */}
                <div 
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto pb-8 -mx-4 px-4 snap-x snap-mandatory scroll-smooth md:mx-0 md:px-0 scrollbar-hide"
                >
                    {products.map(p => (
                        <div key={p.id} className={`${THEME.featured.cardWidth} snap-start flex-shrink-0 h-auto`}>
                            <ProductCard product={p} />
                        </div>
                    ))}
                </div>
            </div>
            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
        </section>
    );
};
