
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Order } from '../types';
import { PageHeader } from '../components/ui/PageHeader';
import { useRouter } from '../contexts/RouterContext';
import { formatCurrency } from '../lib/utils';
import { ChevronLeftIcon, MapPinIcon, PackageIcon, TruckIcon, CheckCircleIcon, ClockIcon } from '../components/icons/Icon';
import { FullScreenLoader } from '../components/ui/FullScreenLoader';

// Icons for the timeline
const CheckIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
);

const OrderTimeline = ({ status }: { status: string }) => {
    const steps = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];
    
    // Map status to index. Note: 'Order Accepted' maps to Processing step visually if needed, or we normalize it.
    // For simplicity: Placed -> 0, Accepted/Processing -> 1, Shipped -> 2, Delivered -> 3
    let currentStep = 0;
    if (status === 'Order Placed') currentStep = 0;
    else if (status === 'Order Accepted' || status === 'Processing') currentStep = 1;
    else if (status === 'Shipped') currentStep = 2;
    else if (status === 'Delivered') currentStep = 3;
    else if (status === 'Cancelled') currentStep = -1;

    if (currentStep === -1) {
        return <div className="bg-red-50 text-red-600 font-bold p-4 rounded-xl text-center border border-red-100 mb-8">This order has been cancelled.</div>;
    }

    return (
        <div className="w-full py-6 mb-8">
            <div className="flex items-center justify-between relative">
                {/* Connecting Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-0"></div>
                <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-primary -z-0 transition-all duration-500"
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                ></div>

                {steps.map((step, index) => {
                    const isCompleted = index <= currentStep;
                    const isCurrent = index === currentStep;

                    return (
                        <div key={step} className="relative z-10 flex flex-col items-center group">
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${isCompleted ? 'bg-brand-primary border-brand-primary text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                                {isCompleted ? <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5" /> : <div className="w-2 h-2 rounded-full bg-gray-300" />}
                            </div>
                            <span className={`absolute top-12 text-[10px] sm:text-xs font-bold uppercase tracking-wide w-24 text-center transition-colors ${isCompleted ? 'text-brand-primary' : 'text-gray-400'}`}>
                                {step}
                            </span>
                        </div>
                    );
                })}
            </div>
            <div className="h-6"></div> {/* Spacer for text labels */}
        </div>
    );
};

const OrderDetailsPage = ({ orderId }: { orderId: string }) => {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const { onNavigate } = useRouter();

    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single();
            
            if (error || !data) {
                console.error("Error fetching order:", error);
                // Optionally redirect or show error
            } else {
                setOrder(data);
            }
            setLoading(false);
        };

        if (orderId) fetchOrder();
    }, [orderId]);

    if (loading) return <FullScreenLoader />;
    if (!order) return (
        <div className="min-h-screen pt-40 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-gray-800">Order not found</h2>
            <button onClick={() => onNavigate('/profile')} className="mt-4 text-brand-primary font-bold hover:underline">Back to Orders</button>
        </div>
    );

    const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const savings = order.items.reduce((acc, item) => acc + ((item.original_price || item.price) - item.price) * item.quantity, 0);

    return (
        <div className="pt-40 pb-12 min-h-screen bg-transparent">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                <button 
                    onClick={() => onNavigate('/profile')} 
                    className="flex items-center gap-2 text-slate-500 font-bold hover:text-brand-primary mb-6 transition-colors"
                >
                    <ChevronLeftIcon className="w-5 h-5" /> Back to Orders
                </button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-brand text-brand-primary">Order #{order.id.slice(0, 8)}</h1>
                        <p className="text-slate-500 font-medium mt-1">
                            Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                    {order.tracking_number && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-3">
                            <TruckIcon className="w-5 h-5 text-brand-primary" />
                            <div>
                                <div className="text-xs text-blue-600 font-bold uppercase">Tracking Number</div>
                                <div className="font-mono font-bold text-slate-800">{order.tracking_number}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Status Timeline */}
                <div className="clay-panel p-6 sm:p-10 mb-8">
                    <OrderTimeline status={order.status} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="clay-panel p-6">
                            <h2 className="text-xl font-bold font-brand mb-6 flex items-center gap-2">
                                <PackageIcon className="w-5 h-5 text-brand-primary" /> Order Items
                            </h2>
                            <div className="space-y-6">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 sm:gap-6 items-start border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-xl border border-gray-100 p-2 flex-shrink-0">
                                            <img src={item.image_url} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-bold text-slate-800 text-base sm:text-lg leading-tight mb-1">{item.name}</h3>
                                            <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium mb-2">
                                                <span>Qty: {item.quantity}</span>
                                                {item.original_price && item.original_price > item.price && (
                                                    <span className="text-green-600 font-bold">Saved {formatCurrency((item.original_price - item.price) * item.quantity)}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-brand-primary text-lg">{formatCurrency(item.price * item.quantity)}</div>
                                            <div className="text-xs text-slate-400">{formatCurrency(item.price)} / each</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Address & Summary */}
                    <div className="space-y-6">
                        {/* Shipping Address */}
                        <div className="clay-panel p-6">
                            <h2 className="text-lg font-bold font-brand mb-4 flex items-center gap-2">
                                <MapPinIcon className="w-5 h-5 text-brand-primary" /> Shipping Details
                            </h2>
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm">
                                <p className="font-bold text-slate-800 text-base mb-1">{order.shipping_address.full_name}</p>
                                <p className="text-slate-600 leading-relaxed">
                                    {order.shipping_address.street}<br/>
                                    {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.zip_code}<br/>
                                    {order.shipping_address.country}
                                </p>
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <span className="text-slate-500">Phone: </span>
                                    <span className="font-bold text-slate-700">{order.shipping_address.phone}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="clay-panel p-6">
                            <h2 className="text-lg font-bold font-brand mb-4">Payment Summary</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span className="font-bold">{formatCurrency(subtotal)}</span>
                                </div>
                                {savings > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Total Savings</span>
                                        <span className="font-bold">-{formatCurrency(savings)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-slate-600">
                                    <span>Shipping</span>
                                    <span className="font-bold text-green-600">FREE</span>
                                </div>
                                <div className="border-t border-dashed border-gray-200 pt-3 mt-3 flex justify-between items-center">
                                    <span className="font-bold text-slate-800 text-lg">Total Paid</span>
                                    <span className="font-bold text-brand-primary text-xl">{formatCurrency(order.total)}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-800 leading-relaxed font-medium">
                            Need help with this order? <a href="mailto:support@shreechoice.com" className="underline font-bold">Contact Support</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
