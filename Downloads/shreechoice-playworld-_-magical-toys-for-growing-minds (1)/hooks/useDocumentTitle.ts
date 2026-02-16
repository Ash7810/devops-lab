
import { useEffect } from 'react';

const DEFAULT_TITLE = 'ShreeChoice Playworld | Magical Toys for Growing Minds';
const DEFAULT_DESCRIPTION = "India's most trusted toy store for educational, safe, and premium toys. Shop Lego, Soft Toys, and STEM kits.";

export const useDocumentTitle = (title?: string, description?: string) => {
    useEffect(() => {
        // Store original values
        const prevTitle = document.title;
        const metaDesc = document.querySelector('meta[name="description"]');
        const prevDesc = metaDesc ? metaDesc.getAttribute('content') : null;

        // Set new values
        document.title = title ? `${title} | ShreeChoice Playworld` : DEFAULT_TITLE;
        if (metaDesc) {
            metaDesc.setAttribute('content', description || DEFAULT_DESCRIPTION);
        }

        // Cleanup: restore original values on unmount
        return () => {
            document.title = prevTitle;
            if (metaDesc && prevDesc) {
                metaDesc.setAttribute('content', prevDesc);
            }
        };
    }, [title, description]);
};
