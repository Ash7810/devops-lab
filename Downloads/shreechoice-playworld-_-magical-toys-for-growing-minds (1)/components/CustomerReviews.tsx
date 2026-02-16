
import React from 'react';
import { REVIEWS } from '../constants';
import { StarRating } from './StarRating';
import { THEME } from '../theme.config';

export const CustomerReviews: React.FC = () => {
    return (
        <div className="w-full">
            <div className="container-custom">
                {/* Horizontal scroll container with hidden scrollbar */}
                <div className="flex overflow-x-auto pb-8 gap-6 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide snap-x snap-mandatory">
                    {REVIEWS.map(review => (
                        <div 
                            key={review.id} 
                            className={`${THEME.reviews.cardWidth} ${THEME.reviews.cardBackground} p-8 ${THEME.reviews.cardShape} border border-transparent hover:border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 snap-start`}
                        >
                            <div className="flex items-center gap-4">
                                <img src={review.avatarUrl} alt={review.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                                <div>
                                    <h4 className="font-bold text-brand-dark text-lg">{review.name}</h4>
                                    <StarRating rating={review.rating} showLabel={false} />
                                </div>
                            </div>
                            <div className="relative flex-grow">
                                <span className="absolute -top-2 -left-1 text-4xl text-brand-secondary/20 font-serif leading-none">“</span>
                                <p className="text-slate-600 text-sm italic leading-relaxed pt-2 px-2 relative z-10">
                                    {review.comment}
                                </p>
                                <span className="absolute -bottom-4 right-0 text-4xl text-brand-secondary/20 font-serif leading-none">”</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
        </div>
    );
};
