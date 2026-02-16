
import React from 'react';

const ShareIcon: React.FC<React.SVGProps<SVGSVGElement>> = React.memo((props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
    </svg>
));

interface ShareButtonProps {
    shareData: {
        title: string;
        text: string;
        url: string;
    };
    showToast: (message: string) => void;
}

export const ShareButton = React.memo<ShareButtonProps>(({ shareData, showToast }) => {
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            try {
                await navigator.clipboard.writeText(shareData.url);
                showToast('Link copied to clipboard!');
            } catch (error) {
                console.error('Failed to copy:', error);
                showToast('Failed to copy link.');
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-brand-primary transition-colors"
        >
            <ShareIcon className="w-5 h-5" />
            Share
        </button>
    );
});