
import React, { useEffect, useRef, useState } from 'react';
import { Brand } from '../types';
import { Link } from '../lib/router';
import { THEME } from '../theme.config';

interface ShopByBrandProps {
    brands: Brand[];
}

export const ShopByBrand: React.FC<ShopByBrandProps> = ({ brands }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);

    // Duplicate brands to create seamless loop illusion
    const displayBrands = brands.length > 0 ? [...brands, ...brands, ...brands, ...brands] : [];

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer || displayBrands.length === 0) return;

        let animationFrameId: number;
        
        const scroll = () => {
            if (!isPaused && scrollContainer) {
                // If scrolled past half the content (the original set), reset to 0 to loop
                if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
                     scrollContainer.scrollLeft = 0;
                } else {
                    scrollContainer.scrollLeft += 0.5; 
                }
            }
            animationFrameId = requestAnimationFrame(scroll);
        };

        animationFrameId = requestAnimationFrame(scroll);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isPaused, displayBrands.length]);

    if (brands.length === 0) return null;

    return (
        <div className="w-full relative group">
             <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

            <div 
                ref={scrollRef}
                className="flex overflow-x-auto gap-6 py-4 scrollbar-hide items-center cursor-grab active:cursor-grabbing w-full"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                style={{ scrollBehavior: 'auto', WebkitOverflowScrolling: 'touch' }} 
            >
                {displayBrands.map((brand, idx) => (
                    <Link 
                        key={`brand-${idx}`} 
                        href={`/shop?brand=${encodeURIComponent(brand.name)}`} 
                        className="flex-shrink-0 group/card"
                        draggable="false"
                    >
                        <div className={`${THEME.brands.cardSize} ${THEME.brands.cardBackground} ${THEME.brands.cardShape} flex items-center justify-center p-6 lg:p-8 border border-slate-200 shadow-sm transition-all duration-300 group-hover/card:-translate-y-2 group-hover/card:shadow-lg group-hover/card:border-brand-primary/30 relative overflow-hidden bg-white`}>
                            {/* Hover Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                            
                            <img 
                                src={brand.logo_url} 
                                alt={brand.name} 
                                className="w-full h-full object-contain transition-all duration-300 relative z-10" 
                                draggable="false"
                            />
                        </div>
                        <p className="text-center mt-3 font-bold text-slate-600 group-hover/card:text-brand-primary transition-colors text-sm opacity-0 group-hover/card:opacity-100 transform translate-y-2 group-hover/card:translate-y-0 duration-300">
                            {brand.name}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
};
