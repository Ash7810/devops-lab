import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
}

export const PageHeader = React.memo<PageHeaderProps>(({ title, subtitle }) => (
    <div className="text-center mb-8 md:mb-12">
        <h1 className="text-5xl font-heading text-brand-dark relative inline-block">
            {title}
        </h1>
        {subtitle && <p className="text-slate-500 mt-3 max-w-2xl mx-auto text-base">{subtitle}</p>}
    </div>
));