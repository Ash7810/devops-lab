
/**
 * Global Theme Configuration
 * 
 * Use this file to manage the look and feel of your application.
 * You can change background colors, images, fonts, and border radius (shapes) here.
 */

export const THEME = {
    // Global Defaults
    global: {
        backgroundColor: "bg-white",
        textColor: "text-slate-800",
        fontHeading: "font-heading",
        fontBody: "font-sans",
        // Tighter spacing on mobile (my-12), spacious on desktop (my-24)
        sectionMargin: "my-12 md:my-16 lg:my-24",
        sectionPadding: "py-10 md:py-16 lg:py-20",
    },

    // 01. Hero Section (Top Banner)
    hero: {
        backgroundClass: "bg-white", 
        backgroundImage: "", 
        titleColor: "text-brand-primary",
        textColor: "text-slate-700",
        
        // Reduced min-height for mobile to avoid scrolling too much before content
        minHeight: "min-h-[550px] md:min-h-[600px] lg:min-h-[750px]", 
        // Optimized padding: Increased top padding (pt-36) for header clearance.
        // Increased bottom padding (pb-48) on mobile to prevent buttons from being covered by category cards.
        padding: "pt-36 pb-48 md:pt-40 md:pb-40 lg:pt-48 lg:pb-56", 
        contentMaxWidth: "max-w-4xl",
        
        imageShape: "rounded-3xl", 
        abstractShapeColor: "bg-[#E6C682]", 
    },

    // 02. Trending / Featured Section
    featured: {
        backgroundClass: "bg-white",
        cardShape: "rounded-2xl",
        // optimized card width: smaller on mobile to show 'peek' of next card
        cardWidth: "min-w-[170px] w-[45vw] sm:w-[220px] md:w-[260px] lg:w-[290px]",
        
        // Spacing
        padding: "py-4", 
        margin: "mt-0", 
    },

    // 03. Shop By Brand Section
    brands: {
        sectionBackground: "bg-white",
        cardBackground: "bg-white",
        cardBorder: "border-slate-100",
        cardShape: "rounded-2xl",
        cardHoverBorder: "border-brand-primary/20",
        
        // Increased sizes for better brand visibility
        cardSize: "w-44 h-24 md:w-56 md:h-32 lg:w-72 lg:h-40",
        
        padding: "py-12 md:py-16 lg:py-24",
        margin: "mb-0",
    },

    // 04. Shop By Age Section
    ageGroup: {
        cards: [
            { range: '0-12', unit: 'Months', filterValue: '0-12m', bg: 'bg-[#E3F2FD]', text: 'text-[#1565C0]' }, 
            { range: '1-3', unit: 'Years', filterValue: '1-3y', bg: 'bg-[#E8F5E9]', text: 'text-slate-800' },   
            { range: '3-5', unit: 'Years', filterValue: '3-5y', bg: 'bg-[#FCE4EC]', text: 'text-[#C2185B]' },   
            { range: '5-8', unit: 'Years', filterValue: '5-8y', bg: 'bg-[#FFF3E0]', text: 'text-[#EF6C00]' },   
            { range: '8-14', unit: 'Years', filterValue: '8-14y', bg: 'bg-[#F3E5F5]', text: 'text-[#7B1FA2]' }, 
            { range: '14+', unit: 'Years', filterValue: '14+', bg: 'bg-[#ECEFF1]', text: 'text-[#455A64]' },   
        ],
        cardShape: "rounded-full", 
        cardSize: "w-full aspect-square", 
        
        padding: "py-12 md:py-16 lg:py-24",
        margin: "my-8 md:my-16 lg:my-20",
    },

    // 05. Promo Banner
    promo: {
        backgroundClass: "bg-brand-primary", 
        backgroundImage: "", 
        textColor: "text-white",
        buttonColor: "bg-brand-secondary", 
        buttonTextColor: "text-white",
        shape: "rounded-[1.5rem] md:rounded-[2.5rem]",
        
        // Compact padding on mobile
        padding: "py-10 px-6 md:px-12 lg:px-16 lg:py-24",
        margin: "my-12 md:my-20 lg:my-32",
        
        // Shorter height on mobile
        minHeight: "min-h-[350px] lg:min-h-[500px]",
        textMaxWidth: "max-w-3xl",
        
        circle1Color: "bg-white/10",
        circle2Color: "bg-white/5",
    },

    // 06. Reviews Section
    reviews: {
        backgroundClass: "bg-white",
        backgroundImage: "", 
        cardBackground: "bg-white",
        cardShape: "rounded-3xl",
        cardWidth: "min-w-[260px] sm:min-w-[300px] lg:min-w-[380px]",
        
        padding: "py-12 md:py-20 lg:py-24",
        margin: "my-0",
    },

    // 07. Contact Form Section
    contact: {
        formBackground: "bg-slate-50",
        formShape: "rounded-2xl md:rounded-3xl",
        inputShape: "rounded-xl",
        buttonShape: "rounded-xl",
        
        padding: "container-custom",
        margin: "my-0",
    },

    // 08. Footer
    footer: {
        backgroundClass: "bg-white",
        borderTop: "border-transparent",
    }
};
