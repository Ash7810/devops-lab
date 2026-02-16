import React from 'react';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    actionText?: string;
    onAction?: () => void;
    center?: boolean;
}

export const SectionHeader = React.memo<SectionHeaderProps>(({ title, subtitle, actionText, onAction, center = true }) => (
  <div className={`mb-12 ${center ? 'text-center' : 'flex justify-between items-end'} px-4 max-w-7xl mx-auto relative z-10`}>
     <div className={center ? 'mx-auto' : ''}>
         <h2 className="text-3xl md:text-5xl font-heading font-bold text-brand-dark relative inline-block">
           {title}
           {/* Decorative underline */}
           <svg className="absolute -bottom-2 left-0 w-full h-3 text-brand-secondary/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
           </svg>
         </h2>
         {subtitle && <p className="text-slate-500 mt-4 text-lg font-medium max-w-2xl mx-auto">{subtitle}</p>}
     </div>
     
     {actionText && (
       <button onClick={onAction} className="text-brand-primary font-bold hover:underline hidden md:flex items-center gap-1 text-base transition-transform hover:translate-x-1">
          {actionText} <span>→</span>
       </button>
     )}
  </div>
));