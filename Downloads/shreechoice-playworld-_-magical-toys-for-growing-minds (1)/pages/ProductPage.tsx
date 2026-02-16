
import React, { useState, useEffect } from 'react';
import type { Product } from '../types';
import { TruckIcon, ShieldCheckIcon, StarIcon, HeartIcon, ShareIcon, CheckCircleIcon, TagIcon, PackageIcon } from '../components/icons/Icon';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ProductGrid } from '../components/ProductGrid';
import { QuantityInput } from '../components/ui/QuantityInput';
import { useCart } from '../contexts/CartContext';
import { useRouter } from '../contexts/RouterContext';
import { useData } from '../contexts/DataContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from '../contexts/ToastContext';
import { formatCurrency } from '../lib/utils';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const ProductPage: React.FC<{ product: Product }> = ({ product }) => {
    const { products } = useData();
    useDocumentTitle(product.name);
    
    // Derived state for Images
    const allImages = React.useMemo(() => {
        return [...new Set([product.image_url, ...(product.images || [])].filter(Boolean))];
    }, [product]);

    const [mainImage, setMainImage] = useState(allImages[0]);
    const [quantity, setQuantity] = useState(1);
    // Fake color data if none exists, to match the UI prompt
    const displayColors = product.colors && product.colors.length > 0 ? product.colors : ['Multi-Color'];
    const [selectedColor, setSelectedColor] = useState(displayColors[0]);
    
    const { addToCart } = useCart();
    const { toggleWishlist, isWishlisted } = useWishlist();
    const { onNavigate } = useRouter();
    const { showToast } = useToast();
    
    useEffect(() => {
        setMainImage(allImages[0]);
        setQuantity(1);
        setSelectedColor(displayColors[0]);
        window.scrollTo(0, 0);
    }, [product, allImages]);

    const handleAddToCart = () => addToCart(product, quantity);
    const handleBuyNow = () => { addToCart(product, quantity); onNavigate('/checkout'); };
    const handleWishlistToggle = () => toggleWishlist(product.id);
    
    const handleShare = async () => {
        const shareData = {
            title: product.name,
            text: `Check out ${product.name} on ShreeChoice Playworld!`,
            url: window.location.href,
        };
        
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                showToast('Link copied to clipboard!');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const isLoved = isWishlisted(product.id);
    const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 5);
    const discountPercentage = product.original_price && product.original_price > product.price
        ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
        : 0;

    return (
        <div className="pt-32 pb-16 bg-white min-h-screen font-sans">
            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
            <div className="container-custom">
                <div className="mb-4">
                    <Breadcrumbs crumbs={[{ label: 'Home', href: '/' }, { label: product.category, href: `/shop?category=${encodeURIComponent(product.category)}` }, { label: product.name }]} />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                    {/* Left Column: Image Gallery (5 cols) */}
                    <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-28 h-fit self-start">
                        {/* Main Image */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-4 aspect-[4/5] sm:aspect-square flex items-center justify-center relative group overflow-hidden">
                            <img src={mainImage} alt={product.name} className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
                            
                            <div className="absolute top-4 right-4 flex flex-col gap-3 z-10">
                                <button 
                                    onClick={handleShare}
                                    className="p-2.5 bg-white rounded-full shadow-md border border-gray-100 hover:bg-gray-50 text-gray-500"
                                >
                                    <ShareIcon className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={handleWishlistToggle}
                                    className="p-2.5 bg-white rounded-full shadow-md border border-gray-100 hover:bg-gray-50"
                                >
                                    <HeartIcon className={`w-5 h-5 transition-colors ${isLoved ? 'text-red-500 fill-current' : 'text-gray-400'}`}/>
                                </button>
                            </div>
                        </div>
                        
                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x px-1">
                                {allImages.map((img, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => setMainImage(img)} 
                                        onMouseEnter={() => setMainImage(img)}
                                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-white border-2 flex-shrink-0 snap-start flex items-center justify-center p-1 ${mainImage === img ? 'border-brand-primary shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <img src={img} className="max-w-full max-h-full object-contain" alt={`View ${idx + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Details (7 cols) */}
                    <div className="lg:col-span-7 flex flex-col">
                        {/* Title & Brand */}
                        <h1 className="text-2xl sm:text-3xl font-medium text-slate-900 mb-1 leading-tight">{product.name}</h1>
                        <a href={`/shop?brand=${encodeURIComponent(product.brand)}`} className="text-sm text-blue-600 font-medium mb-3 hover:underline w-fit">
                            Visit the {product.brand} Store
                        </a>

                        {/* Ratings */}
                        <div className="flex items-center gap-4 mb-4 border-b border-gray-100 pb-4">
                            <div className="flex items-center gap-1">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-current' : 'text-gray-200'}`} />
                                    ))}
                                </div>
                                <span className="text-sm font-medium text-blue-600 ml-1 hover:underline cursor-pointer">{product.reviews} ratings</span>
                            </div>
                            <div className="h-4 w-px bg-gray-300"></div>
                            <span className="text-sm text-gray-500">100+ bought in past month</span>
                        </div>

                        {/* Price Block */}
                        <div className="mb-6">
                            <div className="flex items-center gap-3">
                                {discountPercentage > 0 && (
                                    <span className="text-red-500 text-2xl font-light">-{discountPercentage}%</span>
                                )}
                                <div className="flex items-start">
                                    <span className="text-sm font-medium mt-1">₹</span>
                                    <span className="text-4xl font-medium text-slate-900">{product.price}</span>
                                </div>
                            </div>
                            {product.original_price && product.original_price > product.price && (
                                <div className="text-sm text-gray-500 mt-1 font-medium">
                                    M.R.P.: <span className="line-through">₹{product.original_price}</span>
                                </div>
                            )}
                            <div className="text-sm text-slate-800 font-bold mt-1">Inclusive of all taxes</div>
                        </div>

                        {/* Offers */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <TagIcon className="w-4 h-4 text-brand-primary" />
                                <span className="font-bold text-slate-800 text-sm">Offers</span>
                            </div>
                            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                                <div className="min-w-[160px] p-3 border border-gray-200 rounded-xl shadow-sm bg-white hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="text-xs font-bold text-slate-800 mb-1">Bank Offer</div>
                                    <div className="text-xs text-slate-600 leading-snug">Upto ₹500 discount on HDFC Credit Cards</div>
                                </div>
                                <div className="min-w-[160px] p-3 border border-gray-200 rounded-xl shadow-sm bg-white hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="text-xs font-bold text-slate-800 mb-1">Partner Offer</div>
                                    <div className="text-xs text-slate-600 leading-snug">Get GST invoice and save up to 28% on business purchases.</div>
                                </div>
                                <div className="min-w-[160px] p-3 border border-gray-200 rounded-xl shadow-sm bg-white hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="text-xs font-bold text-slate-800 mb-1">No Cost EMI</div>
                                    <div className="text-xs text-slate-600 leading-snug">Avail No Cost EMI on select cards for orders above ₹3000.</div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 my-4"></div>

                        {/* Variant Selection */}
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Color: <span className="text-slate-900 normal-case">{selectedColor}</span></h3>
                            <div className="flex flex-wrap gap-2">
                                {displayColors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`px-3 py-1.5 border rounded-md text-sm font-medium transition-all ${selectedColor === color ? 'border-brand-primary bg-brand-primary/5 text-brand-primary ring-1 ring-brand-primary' : 'border-gray-300 hover:border-gray-400 text-slate-700'}`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Description & Features */}
                        <div className="mb-8">
                            <h3 className="text-base font-bold text-slate-900 mb-2">About this item</h3>
                            <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-700 leading-relaxed marker:text-gray-400">
                                <li><strong>Brand:</strong> {product.brand}</li>
                                <li><strong>Category:</strong> {product.category}</li>
                                <li><strong>Age Group:</strong> {product.age_group}</li>
                                <li>{product.description}</li>
                                <li>Premium quality materials ensure durability and safety for your child.</li>
                                <li>Promotes creativity, motor skills, and imaginative play.</li>
                            </ul>
                        </div>

                        {/* Delivery & Stock - Box Style */}
                        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
                            {product.in_stock ? (
                                <div className="text-green-700 font-bold text-lg mb-2">In Stock</div>
                            ) : (
                                <div className="text-red-600 font-bold text-lg mb-2">Currently Unavailable</div>
                            )}
                            
                            <div className="text-sm text-slate-600 mb-4">
                                <span className="text-gray-400">Sold by</span> <span className="text-blue-600 font-medium hover:underline cursor-pointer">{product.brand} Retailers</span> <span className="text-gray-400">and</span> <span className="text-blue-600 font-medium hover:underline cursor-pointer">Fulfilled by ShreeChoice</span>.
                            </div>

                            <div className="flex items-center gap-4 mb-6 text-sm text-slate-700">
                                <div className="flex items-center gap-1.5"><TruckIcon className="w-4 h-4 text-brand-primary"/> Free Delivery</div>
                                <div className="flex items-center gap-1.5"><ShieldCheckIcon className="w-4 h-4 text-brand-primary"/> 7 Day Replacement</div>
                                <div className="flex items-center gap-1.5"><PackageIcon className="w-4 h-4 text-brand-primary"/> Secure Transaction</div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="w-32 flex-shrink-0">
                                    <QuantityInput initialQuantity={quantity} onQuantityChange={setQuantity} maxQuantity={product.stock_quantity} />
                                </div>
                                <button 
                                    onClick={handleAddToCart}
                                    disabled={!product.in_stock}
                                    className="flex-1 bg-[#FFD814] hover:bg-[#F7CA00] text-black border border-[#FCD200] font-medium py-3 rounded-full shadow-sm transition-colors text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Add to Cart
                                </button>
                                <button 
                                    onClick={handleBuyNow}
                                    disabled={!product.in_stock}
                                    className="flex-1 bg-[#FA8900] hover:bg-[#E57E00] text-white border border-[#FA8900] font-medium py-3 rounded-full shadow-sm transition-colors text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-20 border-t border-gray-200 pt-12">
                        <div className="flex items-end justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">Products related to this item</h2>
                            <button onClick={() => onNavigate('/shop')} className="text-sm font-medium text-blue-600 hover:underline">See more</button>
                        </div>
                        <ProductGrid products={relatedProducts} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductPage;
