
import React from 'react';
import { Link } from '../lib/router';
import { THEME } from '../theme.config';

export const ShopByAge: React.FC = () => {
    return (
        <div className="flex justify-center">
            {/* 
                Grid Layout:
                Mobile: 2 columns
                Tablet: 3 columns
                Desktop: 6 columns (Flex wrap with gap handles similar to 6 cols)
            */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap lg:justify-center gap-4 sm:gap-6 lg:gap-10 w-full max-w-5xl">
                {THEME.ageGroup.cards.map(age => (
                    <Link 
                        key={age.range} 
                        href={`/shop?age=${age.filterValue}`}
                        className={`
                            group flex flex-col items-center justify-center 
                            w-full aspect-square md:w-40 md:h-40 lg:w-44 lg:h-44 
                            ${THEME.ageGroup.cardShape}
                            transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border-4 border-white shadow-md
                            ${age.bg}
                        `}
                    >
                        <span className={`text-2xl md:text-3xl font-heading font-bold ${age.text}`}>{age.range}</span>
                        <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider mt-1 opacity-80 ${age.text}`}>{age.unit}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}
