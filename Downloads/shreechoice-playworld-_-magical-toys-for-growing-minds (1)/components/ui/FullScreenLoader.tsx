
import React from 'react';
import { Logo } from '../Logo';

export const FullScreenLoader: React.FC = () => (
    <div className="fixed inset-0 bg-slate-50 flex flex-col items-center justify-center z-[200]">
        <div className="relative flex flex-col items-center">
            <Logo className="h-16 w-auto mb-4" />
            <div className="w-24 h-1 bg-slate-200 rounded-full overflow-hidden">
                <div 
                    className="h-1 bg-brand-primary rounded-full animate-shimmer" 
                    style={{ 
                        background: 'linear-gradient(to right, #1A56DB 20%, #F43F5E 50%, #1A56DB 80%)', 
                        backgroundSize: '400% 100%' 
                    }}
                ></div>
            </div>
        </div>
    </div>
);
