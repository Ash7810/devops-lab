
import React from 'react';
import { TrashIcon, ShoppingCartIcon } from '../components/icons/Icon';
import { motion, AnimatePresence } from 'framer-motion';
import { QuantityInput } from '../components/ui/QuantityInput';
import { PageHeader } from '../components/ui/PageHeader';
import { useCart } from '../contexts/CartContext';
import { useRouter } from '../contexts/RouterContext';
import { formatCurrency } from '../lib/utils';
import { useData } from '../contexts/DataContext';
import { FeaturedSection } from '../components/FeaturedSection';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const GIFT_WRAP_COST = 20;

const CartPage = () => {
    const { cart, updateQuantity, removeFromCart, updateGiftOptions } = useCart();
    const { onNavigate } = useRouter();
    const { products, isLoading } = useData();
    useDocumentTitle('Your Shopping Cart');

    const mrpTotal = cart.reduce((acc, item) => acc + ((item.original_price || item.price) * item.quantity), 0);
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const giftWrapTotal = cart.reduce((acc, item) => acc + (item.giftWrap ? GIFT_WRAP_COST * item.quantity : 0), 0);
    const productDiscount = mrpTotal - subtotal;
    const platformFee = 25; // Dummy platform fee
    const shippingFee = 0; // Free shipping for all orders
    const total = subtotal + platformFee + shippingFee + giftWrapTotal;
    const totalSavings = productDiscount;

    const bestSellers = React.useMemo(() => {
        return products.filter(p => p.tags.includes('bestseller') || p.tags.includes('trending')).slice(0, 8);
    }, [products]);

    return (
        // Adjusted padding top for mobile to 40 (160px)
        <div className="bg-transparent pt-40 md:pt-32 pb-12 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <PageHeader title="Shopping Cart" />
                {cart.length === 0 ? (
                    <>
                        <div className="clay-panel p-8 sm:p-12 text-center flex flex-col items-center animate-fade-in">
                            <div className="relative mb-8">
                                <div className="absolute -inset-4 bg-blue-50 rounded-full animate-pulse opacity-50"></div>
                                <div className="relative w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                                    <ShoppingCartIcon className="w-12 h-12 text-blue-300"/>
                                </div>
                            </div>
                            <h2 className="text-xl font-semibold mb-4 text-brand-primary">Your cart is a wonderland waiting to happen!</h2>
                            <p className="text-text-secondary mb-8 max-w-sm">
                                Looks like you haven't added any toys yet. Start exploring to fill it with joy and laughter!
                            </p>
                            <button onClick={() => onNavigate('/shop')} className="bg-brand-primary text-white px-8 py-4 rounded-xl font-bold clay-btn shadow-lg hover:shadow-brand-primary/40 transition-shadow">
                                Start Shopping
                            </button>
                        </div>
                        <FeaturedSection 
                            className="mt-16" 
                            products={bestSellers} 
                            isLoading={isLoading} 
                            title="Explore Our Best Sellers" 
                        />
                    </>
                ) : (
                    <>
                        {totalSavings > 0 && (
                            <div className="bg-green-100 border border-green-200 text-green-800 p-4 rounded-xl font-bold text-center mb-8 text-sm sm:text-base shadow-sm animate-bounce-in">
                                🎉 You're saving a total of {formatCurrency(totalSavings)} on this order!
                            </div>
                        )}
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="w-full lg:w-2/3">
                                <div className="space-y-4">
                                    <AnimatePresence>
                                        {cart.map(item => (
                                            <motion.div key={item.id} layout initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }} className="clay-panel p-4 flex flex-col">
                                                <div className="flex items-start sm:items-center gap-4 w-full">
                                                    <img src={item.image_url} alt={item.name} className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-lg flex-shrink-0 bg-white border border-slate-100 p-2" />
                                                    <div className="flex-grow min-w-0">
                                                        <h3 className="font-bold text-brand-primary text-base leading-tight line-clamp-2">{item.name}</h3>
                                                        <p className="text-sm text-text-secondary mt-2 font-bold">{formatCurrency(item.price)} <span className="text-xs text-gray-500 line-through font-normal">{item.original_price ? formatCurrency(item.original_price) : ''}</span></p>
                                                        <div className="mt-4"><QuantityInput initialQuantity={item.quantity} onQuantityChange={(newQuantity) => updateQuantity(item.id, newQuantity)} maxQuantity={item.stock_quantity}/></div>
                                                    </div>
                                                    <div className="flex flex-col items-end justify-between self-stretch flex-shrink-0">
                                                        <p className="font-bold text-brand-primary text-lg flex-shrink-0">{formatCurrency(item.price * item.quantity)}</p>
                                                        <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-500 mt-auto p-2 -mr-2 rounded-full hover:bg-red-50 transition-colors" aria-label={`Remove ${item.name} from cart`}><TrashIcon className="w-5 h-5"/></button>
                                                    </div>
                                                </div>
                                                {/* Gift Options Section */}
                                                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                                                    <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
                                                        <input
                                                            type="checkbox"
                                                            checked={!!item.isGift}
                                                            onChange={(e) => updateGiftOptions(item.id, { isGift: e.target.checked })}
                                                            className="w-5 h-5 rounded text-brand-primary focus:ring-brand-primary/50 border-slate-300 shadow-sm"
                                                        />
                                                        <span className="text-sm font-bold text-slate-700">Is this a gift? 🎁</span>
                                                    </label>

                                                    <AnimatePresence>
                                                        {item.isGift && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                                animate={{ opacity: 1, height: 'auto', marginTop: '12px' }}
                                                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                                className="pl-8 space-y-4 overflow-hidden"
                                                            >
                                                                <textarea
                                                                    placeholder="Add a gift message (optional)"
                                                                    value={item.giftMessage || ''}
                                                                    onChange={(e) => updateGiftOptions(item.id, { giftMessage: e.target.value })}
                                                                    className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-brand-primary focus:border-brand-primary resize-none"
                                                                    rows={2}
                                                                />
                                                                <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={!!item.giftWrap}
                                                                        onChange={(e) => updateGiftOptions(item.id, { giftWrap: e.target.checked })}
                                                                        className="w-5 h-5 rounded text-brand-primary focus:ring-brand-primary/50 border-slate-300 shadow-sm"
                                                                    />
                                                                    <span className="text-sm font-bold text-slate-700">
                                                                        Add Gift Wrapping ({formatCurrency(GIFT_WRAP_COST)} per item)
                                                                    </span>
                                                                </label>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/3">
                                <div className="clay-panel p-6 sticky top-28">
                                    <h2 className="text-xl font-bold font-brand mb-6 border-b border-gray-100 pb-4">Payment Summary</h2>
                                    <div className="space-y-4 text-sm font-medium">
                                        <div className="flex justify-between"><span className="text-gray-500">MRP Total</span><span className="text-gray-800">{formatCurrency(mrpTotal)}</span></div>
                                        {productDiscount > 0 && (
                                            <div className="flex justify-between items-center bg-green-50 p-2 -mx-2 rounded">
                                                <span className="text-green-700 font-bold">Product Discount</span>
                                                <span className="font-bold text-green-700">-{formatCurrency(productDiscount)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between pt-2"><span className="text-gray-500">Subtotal</span><span className="text-gray-800">{formatCurrency(subtotal)}</span></div>
                                        {giftWrapTotal > 0 && (
                                            <div className="flex justify-between"><span className="text-gray-500">Gift Wrapping</span><span className="text-gray-800">{formatCurrency(giftWrapTotal)}</span></div>
                                        )}
                                        <div className="flex justify-between"><span className="text-gray-500">Shipping Fee</span><span className="font-bold text-green-600">FREE</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">Platform Fee</span><span className="text-gray-800">{formatCurrency(platformFee)}</span></div>
                                    </div>
                                    
                                    <div className="flex justify-between py-4 text-xl font-bold border-t border-dashed border-gray-200 mt-6">
                                        <span>Order Total</span>
                                        <span className="text-brand-primary">{formatCurrency(total)}</span>
                                    </div>
                                    
                                    <button onClick={() => onNavigate('/checkout')} className="w-full bg-brand-secondary text-white font-bold py-4 rounded-xl hover:bg-opacity-90 transition-all mt-4 clay-btn shadow-lg shadow-brand-secondary/30 active:scale-95">
                                        PROCEED TO CHECKOUT
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CartPage;
