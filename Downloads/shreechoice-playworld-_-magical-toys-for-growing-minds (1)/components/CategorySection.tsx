
import React from 'react';
import { Category } from '../types';
import { Link } from '../lib/router';

interface CategorySectionProps {
    categories: Category[];
}

export const CategorySection: React.FC<CategorySectionProps> = ({ categories }) => {
    return (
        <div className="py-12 bg-white/30 backdrop-blur-md border-y border-white/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-heading text-brand-dark mb-8 text-center">Shop By Category</h2>

                <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                    {categories.map((cat) => (
                        <Link 
                            href={`/shop?category=${encodeURIComponent(cat.name)}`}
                            key={cat.id}
                            className="group flex flex-col items-center gap-3 w-28 md:w-36"
                        >
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white border-4 border-white shadow-sm group-hover:shadow-lg group-hover:-translate-y-2 transition-all duration-300 overflow-hidden relative">
                                <img 
                                    src={cat.image_url} 
                                    alt={cat.name} 
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            </div>
                            <h3 className="font-brand text-sm md:text-base text-brand-dark font-bold text-center leading-tight group-hover:text-brand-primary transition-colors">
                                {cat.name}
                            </h3>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};
