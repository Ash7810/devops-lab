
import React from 'react';

const StarIcon = React.memo<{ filled: boolean }>(({ filled }) => (
    <svg className={`w-4 h-4 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
    </svg>
));


interface StarRatingProps {
    rating: number;
    showLabel?: boolean;
}

export const StarRating = React.memo<StarRatingProps>(({ rating, showLabel = true }) => {
    const fullStars = Math.round(rating);
    return (
        <div className="flex items-center justify-center gap-1">
            <div className="flex">
                {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < fullStars} />)}
            </div>
            {showLabel && (
                <span className="text-xs text-gray-500 font-medium ml-1">{rating.toFixed(1)}</span>
            )}
        </div>
    );
});