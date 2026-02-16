
import React, { memo } from 'react';
import type { Product } from '../types';
import { HeartIcon, StarIcon, ShoppingCartIcon, CheckCircleIcon } from './icons/Icon';
import { Link } from '../lib/router';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { formatCurrency } from '../lib/utils';

interface ProductCardProps {
  product: Product;
}

const ProductCardBase = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const isProductWishlisted = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    toggleWishlist(product.id);
  };

  const discountPercentage = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="group relative bg-white rounded-xl border border-gray-200 flex flex-col h-full hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] hover:border-brand-primary/30 transition-all duration-300 overflow-hidden">
        <Link href={`/product/${product.id}`} className="flex flex-col h-full w-full">
            
            {/* Image Area */}
            <div className="relative aspect-[1/1] w-full bg-white p-4 flex items-center justify-center overflow-hidden">
                <img 
                    src={product.image_url} 
                    alt={product.name} 
                    loading="lazy" 
                    decoding="async"
                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" 
                />
                
                {/* Wishlist Button - Floating Top Right */}
                <button 
                    onClick={handleToggleWishlist} 
                    className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-gray-100 hover:bg-red-50 hover:border-red-100 transition-colors z-10"
                    aria-label={isProductWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <HeartIcon className={`w-4 h-4 transition-colors ${isProductWishlisted ? 'fill-current text-red-500' : 'text-gray-400'}`} />
                </button>
                
                {/* Status Tags - Floating Top Left */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {!product.in_stock && (
                        <span className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">Sold Out</span>
                    )}
                    {product.in_stock && product.tags?.includes('bestseller') && (
                        <span className="bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">Bestseller</span>
                    )}
                </div>
            </div>

            {/* Content Container */}
            <div className="flex flex-col flex-grow p-3 sm:p-4 border-t border-gray-50">
                
                {/* Brand Name */}
                <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">
                    {product.brand}
                </p>

                {/* Product Title */}
                <h3 className="font-medium text-slate-800 text-sm sm:text-[15px] leading-snug line-clamp-2 min-h-[2.5em] group-hover:text-brand-primary transition-colors mb-1.5" title={product.name}>
                    {product.name}
                </h3>
                
                {/* Rating & Reviews */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded gap-0.5">
                        {product.rating} <StarIcon className="w-2.5 h-2.5 fill-current" />
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">({product.reviews})</span>
                    {/* Trusted Badge (Visual Trust) */}
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Twitter_Verified_Badge.svg" className="w-3 h-3 opacity-50" alt="verified" />
                </div>

                {/* Spacer to push price to bottom */}
                <div className="flex-grow"></div>

                {/* Price Section - Amazon Style */}
                <div className="flex items-baseline flex-wrap gap-x-2 mb-3">
                     <span className="text-lg sm:text-xl font-bold text-slate-900">{formatCurrency(product.price)}</span>
                     {discountPercentage > 0 && (
                        <>
                            <span className="text-xs text-gray-500 line-through decoration-gray-400">{formatCurrency(product.original_price!)}</span>
                            <span className="text-xs font-bold text-green-600">{discountPercentage}% off</span>
                        </>
                     )}
                </div>

                {/* Add to Cart Button */}
                <button 
                    onClick={handleAddToCart}
                    disabled={!product.in_stock}
                    className={`
                        w-full py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2
                        ${product.in_stock 
                            ? 'bg-yellow-400 text-brand-dark hover:bg-yellow-500 shadow-sm active:translate-y-0.5' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'}
                    `}
                >
                    {!product.in_stock ? 'Out of Stock' : (
                        <>
                            <ShoppingCartIcon className="w-4 h-4" />
                            <span>Add to Cart</span>
                        </>
                    )}
                </button>
            </div>
        </Link>
    </div>
  );
};

export const ProductCard = memo(ProductCardBase);
export default ProductCard;
