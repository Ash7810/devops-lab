
import React from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from '../components/HeroSlider';
import { FeaturedSection } from '../components/FeaturedSection';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { ContactForm } from '../components/ContactForm';
import { CustomerReviews } from '../components/CustomerReviews';
import { ShopByAge } from '../components/ShopByAge';
import { SectionHeader } from '../components/SectionHeader';
import { ShopByBrand } from '../components/ShopByBrand';
import { useData } from '../contexts/DataContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { THEME } from '../theme.config';
import { 
    PaperPlaneDoodle, 
    ConfettiDoodle, 
    SpringDoodle, 
    ZigZagDoodle, 
    StarBurstDoodle, 
    CurvedLineDoodle,
    CrossPatternDoodle,
    LoopDoodle
} from '../components/ui/Doodles';

const HomePage: React.FC = () => {
    const { isLoading, products, brands, banners } = useData();
    useDocumentTitle(); 
    
    // Get trending/bestselling products
    const trendingProducts = React.useMemo(() => {
        let trending = products.filter(p => p.tags.includes('trending') || p.tags.includes('bestseller'));
        if (trending.length < 4) {
            trending = [...products].sort((a, b) => b.id - a.id).slice(0, 8);
        }
        return trending;
    }, [products]);

    // Find the home promo banner
    const promoBanner = banners.find(b => b.slug === 'home-promo');

    return (
        // Global background is white, but we use explicit bg-white wrappers for consistency and z-index management
        <div className="animate-fade-in bg-white w-full overflow-x-hidden relative">
            
            {/* 01: Hero Section */}
            <HeroSection />
            
            {/* 02: Trending Toys 
                Optimization: Adjusted pt to pt-36 on mobile (from pt-28) to clear the lowered category cards (which are now at -bottom-28).
            */}
            <div className="relative bg-white z-10 pt-36 pb-8 md:pt-40 md:pb-12">
                <div className="hidden lg:block absolute -top-12 right-0 w-full opacity-60 pointer-events-none"><PaperPlaneDoodle /></div>
                <div className="container-custom">
                    <FeaturedSection 
                        isLoading={isLoading} 
                        products={trendingProducts} 
                        title="Todays Best Deals For You!"
                    />
                </div>
            </div>

            {/* Doodle Divider - Reduced vertical margin on mobile */}
            <div className="my-8 md:my-16 opacity-50 relative z-0"><SpringDoodle /></div>

            {/* 03: Shop By Brand - Pure White Background */}
            <section className={`${THEME.brands.sectionBackground} py-10 md:py-20 relative z-10 overflow-hidden`}>
                <div className="container-custom relative z-10">
                        <SectionHeader 
                        title="Our Trusted Brands" 
                        subtitle="We only partner with the safest and most reliable toy makers."
                        center={true}
                        />
                        <ShopByBrand brands={brands} />
                </div>
            </section>

            {/* Doodle Divider */}
            <div className="my-8 md:my-12 opacity-50 relative z-0"><ZigZagDoodle /></div>

            {/* 04: Shop By Age */}
            <section className={`relative py-10 md:py-20 bg-white z-10`}>
                <div className="container-custom">
                    <div className="absolute -top-20 w-full opacity-60 pointer-events-none hidden md:block"><ConfettiDoodle /></div>
                    <SectionHeader 
                        title="Shop by Age" 
                        subtitle="Find the perfect toy for every stage of development."
                        center={true}
                    />
                    <ShopByAge />
                </div>
            </section>
            
            {/* Doodle Divider */}
            <div className="my-8 md:my-12 relative z-0"><StarBurstDoodle /></div>

            {/* 05: Promo Banner (Redesigned) - Only show if active */}
            {(!promoBanner || promoBanner.is_active) && (
                <section className={`container-custom my-12 md:my-24 z-10 relative`}>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className={`relative w-full ${THEME.promo.minHeight} rounded-[2.5rem] overflow-hidden shadow-2xl flex items-center justify-center`}
                        style={{
                            backgroundColor: promoBanner?.background_color || '#000',
                            backgroundImage: promoBanner?.image_url ? `url(${promoBanner.image_url})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        {/* Overlay if image exists */}
                        {promoBanner?.image_url && <div className="absolute inset-0 bg-black/40 z-0"></div>}

                        {/* --- Dynamic Background Elements (Only if no image, to keep it clean) --- */}
                        {!promoBanner?.image_url && (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary via-purple-600 to-brand-primary bg-[length:200%_100%] animate-gradient-x opacity-90"></div>
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -top-12 -left-12 w-48 h-48 border-4 border-white/10 border-dashed rounded-full"></motion.div>
                                <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute -bottom-24 -right-12 w-64 h-64 border-[6px] border-white/5 border-dotted rounded-full"></motion.div>
                            </>
                        )}

                        {/* Content Container */}
                        <div className={`relative z-10 flex flex-col items-center justify-center text-center ${THEME.promo.padding} w-full`} style={{ color: promoBanner?.text_color || '#fff' }}>
                            
                            {/* Sticker Badge */}
                            <motion.div 
                                initial={{ scale: 0, rotate: -15 }}
                                whileInView={{ scale: 1, rotate: -3 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
                                className="bg-brand-secondary text-white text-xs md:text-sm font-bold px-4 py-2 rounded-lg shadow-[4px_4px_0px_rgba(0,0,0,0.2)] mb-6 transform -rotate-3 border-2 border-white/20"
                            >
                                ✨ LIMITED TIME OFFER
                            </motion.div>

                            <h2 
                                className={`text-3xl md:text-5xl lg:text-7xl font-heading font-bold mb-6 leading-tight md:leading-[1.1] ${THEME.promo.textMaxWidth} drop-shadow-sm`}
                                style={{ color: promoBanner?.text_color || '#fff' }}
                            >
                                {promoBanner?.title || 'Big Smiles, Bigger Savings!'}
                            </h2>
                            
                            <p className="opacity-90 text-base md:text-xl mb-10 max-w-xl md:max-w-2xl mx-auto leading-relaxed font-medium px-4">
                                {promoBanner?.subtitle || 'Get up to 50% OFF on selected educational toys and building blocks.'}
                            </p>
                            
                            <motion.a 
                                href={promoBanner?.button_link || "/shop?tag=deals"}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className={`bg-white text-brand-primary inline-flex items-center gap-3 font-bold py-4 px-10 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.3)] transition-all duration-300 text-lg group`}
                            >
                                {promoBanner?.button_text || 'Shop The Sale'}
                                <div className="bg-brand-primary text-white rounded-full p-1 group-hover:rotate-45 transition-transform duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                </div>
                            </motion.a>
                        </div>
                    </motion.div>
                    <style>{`
                        @keyframes gradient-x {
                            0%, 100% { background-position: 0% 50%; }
                            50% { background-position: 100% 50%; }
                        }
                        .animate-gradient-x {
                            animation: gradient-x 8s ease infinite;
                        }
                    `}</style>
                </section>
            )}
            
            {/* Doodle Divider */}
            <div className="my-10 md:my-16 relative z-0"><CurvedLineDoodle /></div>

            {/* 06: Services / Why Choose Us */}
            <section className={`relative py-10 md:py-20 bg-white z-10`}>
                <WhyChooseUs />
            </section>

            {/* New Doodle Divider */}
            <div className="my-8 md:my-12 relative z-0"><CrossPatternDoodle /></div>

            {/* 07: Reviews */}
            <section className={`${THEME.reviews.backgroundClass} py-10 md:py-20 relative z-10`} style={THEME.reviews.backgroundImage ? { backgroundImage: `url(${THEME.reviews.backgroundImage})` } : {}}>
                 <div className="container-custom">
                     <SectionHeader title="What Parents Say" center={true} />
                     <CustomerReviews />
                 </div>
            </section>

            {/* New Doodle Divider */}
            <div className="my-8 md:my-12 relative z-0"><LoopDoodle /></div>

            {/* 08: Contact */}
            <section className={`py-12 md:py-24 mb-0 relative z-10 bg-white`}>
                <div className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none">
                    <svg viewBox="0 0 100 100" fill="none" stroke="#F59E0B" strokeWidth="2"><circle cx="50" cy="50" r="40" strokeDasharray="10 10" /></svg>
                </div>
                <div className={THEME.contact.padding}>
                    <ContactForm />
                </div>
            </section>
        </div>
    );
};

export default HomePage;
