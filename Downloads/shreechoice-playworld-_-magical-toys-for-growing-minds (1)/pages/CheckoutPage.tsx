
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
// FIX: The User type is not available in the assumed Supabase JS version. Replaced with `any`.
// import { User } from '@supabase/supabase-js';
import type { Address } from '../types';
import { PageHeader } from '../components/ui/PageHeader';
import { useCart } from '../contexts/CartContext';
import { useRouter } from '../contexts/RouterContext';
import { useToast } from '../contexts/ToastContext';
import { useData } from '../contexts/DataContext';
import { formatCurrency } from '../lib/utils';
import { Link } from '../lib/router';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

interface CheckoutPageProps {
    user: any | null;
}

const FormInput: React.FC<{label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; error?: string; type?: string; placeholder?: string; required?: boolean;}> = ({ label, name, error, required = true, ...props }) => (
    <div><label htmlFor={name} className="block text-sm font-bold text-text-secondary mb-2">{label} {required && <span className="text-red-500">*</span>}</label><input id={name} name={name} className={`w-full clay-input ${error ? 'border-red-500' : ''}`} {...props} />{error && <p className="text-red-500 text-xs mt-1">{error}</p>}</div>
);

const CheckoutPage: React.FC<CheckoutPageProps> = ({ user }) => {
    const { cart, clearCart } = useCart();
    const { onNavigate } = useRouter();
    const { showToast } = useToast();
    const { fetchData } = useData();
    useDocumentTitle('Checkout');
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const total = subtotal;

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [shippingForm, setShippingForm] = useState({ fullName: '', email: '', phone: '', street: '', city: '', state: 'Maharashtra', zipCode: '' });
    const [saveAddress, setSaveAddress] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchAddresses = async () => {
                const { data } = await supabase.from('addresses').select('*').eq('user_id', user.id);
                if (data && data.length > 0) {
                    const defaultAddress = data.find(a => a.is_default) || data[0];
                    setAddresses(data);
                    setSelectedAddressId(defaultAddress.id);
                } else { setSelectedAddressId('new'); }
            };
            fetchAddresses();
        } else { setSelectedAddressId('new'); }
    }, [user]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setShippingForm(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};
        if (!user) {
            if (!shippingForm.email.trim()) errors.email = 'Email is required for order updates.';
            else if (!/\S+@\S+\.\S+/.test(shippingForm.email)) errors.email = 'Email address is invalid.';
        }
        if (!shippingForm.fullName.trim()) errors.fullName = 'Full name is required.';
        if (!shippingForm.phone.trim()) errors.phone = 'Phone number is required.';
        if (!shippingForm.street.trim()) errors.street = 'Street address is required.';
        if (!shippingForm.city.trim()) errors.city = 'City is required.';
        if (!shippingForm.zipCode.trim()) errors.zipCode = 'PIN code is required.';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlePlaceOrder = async () => {
        let finalShippingAddress: Omit<Address, 'id' | 'is_default' | 'user_id' | 'created_at'>;
        let customerEmail: string | undefined;

        if (user) {
            customerEmail = user.email;
            if (selectedAddressId === 'new') {
                if (!validateForm()) return;
                finalShippingAddress = { full_name: shippingForm.fullName, phone: shippingForm.phone, street: shippingForm.street, city: shippingForm.city, state: shippingForm.state, zip_code: shippingForm.zipCode, country: 'India' };
                if (saveAddress) {
                    const { error: saveAddrError } = await supabase.from('addresses').insert([{ ...finalShippingAddress, user_id: user.id }]);
                    if (saveAddrError) {
                        console.error("Error saving new address:", saveAddrError);
                        showToast('Could not save the new address, but proceeding with order.');
                    }
                }
            } else {
                const selectedAddr = addresses.find(a => a.id === selectedAddressId);
                if (!selectedAddr) { showToast('Please select a valid shipping address.'); return; }
                const { id, user_id, created_at, is_default, ...rest } = selectedAddr;
                finalShippingAddress = rest;
            }
        } else { // GUEST USER
            if (!validateForm()) return;
            customerEmail = shippingForm.email;
            finalShippingAddress = { full_name: shippingForm.fullName, phone: shippingForm.phone, street: shippingForm.street, city: shippingForm.city, state: shippingForm.state, zip_code: shippingForm.zipCode, country: 'India' };
        }

        if (!finalShippingAddress || !customerEmail) { showToast('Please provide all required shipping information.'); return; }

        setLoading(true);
        try {
            const productIds = cart.map(item => item.id);
            const { data: currentProductsData, error: stockCheckError } = await supabase.from('products').select('id, name, stock_quantity').in('id', productIds);
            if (stockCheckError) throw stockCheckError;

            for (const item of cart) {
                const productInDb = currentProductsData.find(p => p.id === item.id);
                if (!productInDb || productInDb.stock_quantity < item.quantity) {
                    const stock = productInDb?.stock_quantity || 0;
                    showToast(stock === 0 ? `Sorry, ${item.name} is out of stock.` : `Sorry, only ${stock} of "${item.name}" are left in stock.`);
                    setLoading(false);
                    return;
                }
            }

            const orderPayload = { user_id: user ? user.id : null, customer_email: customerEmail, items: cart, total, status: 'Order Placed', shipping_address: finalShippingAddress };
            const { error: orderInsertError } = await supabase.from('orders').insert([orderPayload]);
            if (orderInsertError) throw orderInsertError;

            const stockUpdatePromises = cart.map(item => {
                const productInDb = currentProductsData.find(p => p.id === item.id)!;
                const newStock = productInDb.stock_quantity - item.quantity;
                return supabase.from('products').update({ stock_quantity: newStock, in_stock: newStock > 0 }).eq('id', item.id);
            });
            await Promise.all(stockUpdatePromises);
            
            await fetchData();

            setOrderPlaced(true);
            setTimeout(() => { clearCart(); user ? onNavigate('/profile') : onNavigate('/'); showToast("Your order has been placed!"); }, 2000);

        } catch (err: any) {
            showToast('Order failed: ' + (err.message || 'Please try again.'));
        } finally { 
            setLoading(false); 
        }
    };
    
    if (orderPlaced) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="clay-panel p-12 text-center animate-bounce-in"><div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div><h2 className="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2><p className="text-gray-500 mb-6">Thank you for shopping with ShreeChoice Playworld.</p><p className="text-sm font-bold text-brand-primary animate-pulse">Redirecting...</p></div></div>

    return (
        <div className="bg-transparent pt-40 pb-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <PageHeader title="Checkout" />
                {cart.length === 0 ? (
                     <div className="clay-panel p-12 text-center"><h2 className="text-xl font-semibold mb-4 text-brand-primary">Your cart is empty.</h2><p className="text-sm text-text-secondary mb-6">You can't proceed to checkout without any items.</p><button onClick={() => onNavigate('/shop')} className="bg-brand-primary text-white px-6 py-2 rounded-xl font-bold clay-btn">Return to Shop</button></div>
                ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-2/3">
                        <div className="clay-panel p-6 md:p-8">
                            {!user && (
                                <div className="p-4 text-center bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl mb-6">
                                    <p className="text-sm text-blue-800/80">
                                        Already have an account? <Link href={`/login?redirect=/checkout`} className="font-bold text-brand-primary hover:underline">Log in</Link> for a faster checkout.
                                    </p>
                                </div>
                            )}
                            <h2 className="text-xl font-bold font-heading mb-6 border-b pb-2">BILLING DETAILS</h2>
                            {user && addresses.length > 0 && <div className="mb-6"><label className="block text-sm font-bold text-text-secondary mb-3">Select Saved Address</label><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{addresses.map(addr => <div key={addr.id} onClick={() => setSelectedAddressId(addr.id)} className={`p-4 border rounded-xl cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-brand-primary bg-blue-50 ring-1 ring-brand-primary' : 'border-gray-200 hover:border-blue-200'}`}><div className="font-bold">{addr.full_name}</div><div className="text-sm text-gray-600">{addr.street}, {addr.city}</div></div>)}<div onClick={() => setSelectedAddressId('new')} className={`p-4 border border-dashed rounded-xl cursor-pointer flex items-center justify-center text-gray-500 font-bold hover:bg-gray-50 transition-all ${selectedAddressId === 'new' ? 'border-brand-primary text-brand-primary bg-blue-50' : ''}`}>+ Use New Address</div></div></div>}
                            
                            {(selectedAddressId === 'new' || (user && addresses.length === 0) || !user) && 
                                <form className="grid grid-cols-1 gap-4 animate-fade-in">
                                    {!user && <FormInput label="Email Address" name="email" type="email" value={shippingForm.email} onChange={handleFormChange} error={formErrors.email} />}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><FormInput label="Full Name" name="fullName" value={shippingForm.fullName} onChange={handleFormChange} error={formErrors.fullName} /><FormInput label="Phone" name="phone" type="tel" value={shippingForm.phone} onChange={handleFormChange} error={formErrors.phone} /></div><FormInput label="Street address" name="street" value={shippingForm.street} onChange={handleFormChange} error={formErrors.street} placeholder="House number and street name" /><div className="grid grid-cols-2 gap-4"><FormInput label="Town / City" name="city" value={shippingForm.city} onChange={handleFormChange} error={formErrors.city} /><FormInput label="PIN Code" name="zipCode" value={shippingForm.zipCode} onChange={handleFormChange} error={formErrors.zipCode} /></div><div><label htmlFor="state" className="block text-sm font-bold text-text-secondary mb-2">State <span className="text-red-500">*</span></label><select id="state" name="state" value={shippingForm.state} onChange={handleFormChange} className="w-full clay-input bg-white"><option>Maharashtra</option><option>Gujarat</option><option>Karnataka</option><option>Delhi</option></select></div>
                                    {user && <div className="mt-2"><label className="flex items-center gap-3"><input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} className="h-5 w-5 rounded text-brand-primary focus:ring-brand-primary border-gray-300" /><span className="font-bold text-slate-700 text-sm">Save this address for future orders</span></label></div>}
                                </form>
                            }
                            <div className="mt-4"><label className="block text-sm font-bold text-text-secondary mb-2">Order notes (optional)</label><textarea placeholder="Notes about your order, e.g. special notes for delivery." className="w-full h-24 clay-input"></textarea></div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/3">
                        <div className="clay-panel p-6 md:p-8 sticky top-28"><h2 className="text-xl font-bold font-heading mb-6 text-center">YOUR ORDER</h2><div className="flex justify-between border-b-2 pb-2 mb-4 text-sm font-bold text-text-secondary"><span>PRODUCT</span> <span>SUBTOTAL</span></div><div className="space-y-4 mb-4 border-b pb-4 max-h-60 overflow-y-auto">{cart.map(item => (<div key={item.id} className="flex justify-between text-sm"><span className="text-text-secondary w-2/3">{item.name}  <strong className="text-text-primary">× {item.quantity}</strong></span><span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span></div>))}</div><div className="flex justify-between border-b pb-4 mb-4 text-sm"><span className="font-bold text-text-primary">Subtotal</span><span className="font-semibold text-brand-primary">{formatCurrency(subtotal)}</span></div><div className="flex justify-between border-b pb-4 mb-4 text-sm"><span className="font-bold text-text-primary">Shipping</span><span className="text-text-secondary">Free shipping</span></div><div className="flex justify-between border-b pb-4 mb-6 text-xl"><span className="font-bold text-text-primary">Total</span><span className="font-bold text-brand-primary">{formatCurrency(total)}</span></div><div className="mb-6"><div className="flex items-center mb-3 p-3 bg-gray-50/50 rounded-xl"><input type="radio" checked className="mr-3 text-brand-primary focus:ring-brand-primary" readOnly/> <span className="text-sm font-bold text-gray-700">Cash on delivery</span></div><p className="text-xs text-text-secondary px-3 mb-4">Pay with cash upon delivery.</p><div className="flex items-center p-3 border rounded-xl opacity-50"><input type="radio" disabled className="mr-3"/> <span className="text-sm font-bold text-gray-500">Credit Card / Debit Card / NetBanking</span></div></div><button onClick={handlePlaceOrder} disabled={loading || cart.length === 0} className="w-full bg-brand-secondary text-white font-bold py-4 rounded-xl hover:bg-opacity-90 transition-colors uppercase tracking-widest text-sm shadow-lg clay-btn disabled:opacity-50 disabled:cursor-not-allowed">{loading ? 'Placing Order...' : 'Place Order'}</button></div>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutPage;
