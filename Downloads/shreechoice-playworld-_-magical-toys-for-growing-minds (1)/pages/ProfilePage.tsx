
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
// FIX: The User type is not available in the assumed Supabase JS version. Replaced with `any`.
// import { User } from '@supabase/supabase-js';
import { Order, Address } from '../types';
import { useRouter } from '../contexts/RouterContext';
import { useToast } from '../contexts/ToastContext';
import { XIcon, TruckIcon, MapPinIcon, TrashIcon } from '../components/icons/Icon';
import { formatCurrency } from '../lib/utils';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

interface ProfilePageProps { user: any; }

const TabButton: React.FC<{label: string; isActive: boolean; onClick: () => void;}> = ({ label, isActive, onClick }) => (
    <button onClick={onClick} className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-bold rounded-full transition-all border ${isActive ? 'bg-brand-primary text-white border-brand-primary shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>{label}</button>
);

const AddressModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (data: Partial<Address>) => Promise<void>; address: Partial<Address> | null; error: string | null; }> = ({ isOpen, onClose, onSave, address, error }) => {
    const [formData, setFormData] = useState<Partial<Address> | null>(address);
    useEffect(() => { setFormData(address); }, [address]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !formData) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => prev ? { ...prev, [e.target.name]: e.target.value } : null);
    };
    
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-bounce-in">
                <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-slate-800">{formData.id ? 'Edit Address' : 'Add New Address'}</h2><button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center"><XIcon className="w-5 h-5 text-slate-500"/></button></div>
                {error && <div className="bg-red-50 text-red-700 p-3 rounded-xl mb-4 text-sm font-bold">{error}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input name="full_name" placeholder="Full Name *" value={formData.full_name || ''} className="clay-input" onChange={handleChange} />
                    <input name="phone" placeholder="Phone Number *" value={formData.phone || ''} className="clay-input" onChange={handleChange} />
                    <input name="street" placeholder="Street Address *" value={formData.street || ''} className="clay-input md:col-span-2" onChange={handleChange} />
                    <input name="city" placeholder="City *" value={formData.city || ''} className="clay-input" onChange={handleChange} />
                    <input name="zip_code" placeholder="ZIP Code *" value={formData.zip_code || ''} className="clay-input" onChange={handleChange} />
                    <input name="state" placeholder="State *" value={formData.state || ''} className="clay-input" onChange={handleChange} />
                    <input name="country" placeholder="Country" value={formData.country || 'India'} className="clay-input" onChange={handleChange} />
                </div>
                <div className="flex gap-3 justify-end"><button onClick={onClose} className="px-4 py-2 text-gray-600 font-bold">Cancel</button><button onClick={() => onSave(formData)} className="px-6 py-2 bg-brand-secondary text-white font-bold rounded-xl shadow">Save Address</button></div>
            </div>
        </div>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
        'Delivered': 'bg-green-100 text-green-700 border-green-200',
        'Shipped': 'bg-blue-100 text-blue-700 border-blue-200',
        'Processing': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'Cancelled': 'bg-red-100 text-red-700 border-red-200',
        'Order Placed': 'bg-gray-100 text-gray-700 border-gray-200',
    }[status] || 'bg-gray-100 text-gray-700';

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles} flex items-center gap-1.5`}>
            {status === 'Shipped' && <TruckIcon className="w-3 h-3" />}
            {status}
        </span>
    );
};

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
    const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>('profile');
    const [orders, setOrders] = useState<Order[]>([]);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(false);
    const [addressError, setAddressError] = useState<string | null>(null);
    const [addressModalOpen, setAddressModalOpen] = useState(false);
    const [currentAddress, setCurrentAddress] = useState<Partial<Address> | null>(null);
    const { onNavigate } = useRouter();
    const { showToast } = useToast();
    useDocumentTitle('My Account');

    useEffect(() => {
        if (activeTab === 'orders') fetchOrders();
        if (activeTab === 'addresses') fetchAddresses();
    }, [activeTab]);

    const handleLogout = async () => { await supabase.auth.signOut(); showToast('Logged out successfully'); };
    const fetchOrders = async () => { setLoading(true); const { data } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }); if (data) setOrders(data); setLoading(false); };
    const fetchAddresses = async () => { setLoading(true); const { data } = await supabase.from('addresses').select('*').eq('user_id', user.id).order('is_default', { ascending: false }); if (data) setAddresses(data); setLoading(false); };
    
    const openAddressModal = (address: Partial<Address> | null) => {
        setCurrentAddress(address || { country: 'India' });
        setAddressModalOpen(true);
    };
    
    const closeAddressModal = () => { setAddressModalOpen(false); setCurrentAddress(null); setAddressError(null); };

    const handleSaveAddress = async (formData: Partial<Address>) => {
        if (!formData.full_name || !formData.street || !formData.city || !formData.zip_code) { setAddressError('Please fill all required fields.'); return; }
        setAddressError(null);
        
        // If it's the first address, make it default automatically
        const isFirst = addresses.length === 0;
        
        const { id, ...updateData } = { ...formData, user_id: user.id, is_default: formData.is_default || isFirst };
        const promise = id ? supabase.from('addresses').update(updateData).eq('id', id) : supabase.from('addresses').insert([updateData]);
        const { error } = await promise;
        if (error) { setAddressError(error.message); } else { closeAddressModal(); fetchAddresses(); showToast('Address saved successfully!'); }
    };

    const handleDeleteAddress = async (id: string) => { if (window.confirm("Are you sure?")) { await supabase.from('addresses').delete().eq('id', id); fetchAddresses(); showToast('Address deleted.'); } };
    
    const handleSetDefaultAddress = async (id: string) => {
        setLoading(true);
        // Set all to false first
        await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id);
        // Set selected to true
        await supabase.from('addresses').update({ is_default: true }).eq('id', id);
        fetchAddresses();
        showToast('Default address updated');
        setLoading(false);
    };

    return (
        <div className="pt-40 pb-12 min-h-screen bg-transparent">
             <AddressModal isOpen={addressModalOpen} onClose={closeAddressModal} onSave={handleSaveAddress} address={currentAddress} error={addressError} />
            <div className="container mx-auto px-4 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header Card */}
                    <div className="clay-panel p-8 mb-8 flex flex-col md:flex-row items-center gap-6 md:gap-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-brand-primary text-4xl font-bold shadow-inner border-4 border-white">
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <h2 className="font-heading text-2xl md:text-3xl text-brand-primary">{user.user_metadata?.full_name || 'Valued Customer'}</h2>
                            <p className="text-gray-500 font-medium mt-1">{user.email}</p>
                            <div className="mt-2 text-xs font-bold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full inline-block">Member since {new Date().getFullYear()}</div>
                        </div>
                        <button onClick={handleLogout} className="bg-white border-2 border-red-100 text-red-500 font-bold px-6 py-2 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all shadow-sm">
                            Sign Out
                        </button>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex justify-center md:justify-start gap-3 mb-8 overflow-x-auto pb-2">
                        <TabButton label="My Profile" isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                        <TabButton label="Orders" isActive={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
                        <TabButton label="Addresses" isActive={activeTab === 'addresses'} onClick={() => setActiveTab('addresses')} />
                    </div>

                    <div className="bg-transparent min-h-[400px]">
                        {activeTab === 'profile' && (
                            <div className="clay-panel p-8 animate-fade-in">
                                <h2 className="text-2xl font-heading text-brand-primary mb-6 border-b border-gray-100 pb-4">Personal Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label><div className="text-lg font-bold text-gray-800 p-4 bg-gray-50 rounded-xl border border-gray-100">{user.user_metadata?.full_name || '-'}</div></div>
                                    <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label><div className="text-lg font-bold text-gray-800 p-4 bg-gray-50 rounded-xl border border-gray-100">{user.email}</div></div>
                                </div>
                                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-4 items-start">
                                    <div className="bg-white p-2 rounded-full shadow-sm">ℹ️</div>
                                    <p className="text-sm text-blue-800 font-medium mt-1">To update your password or account details, please contact our support team at <a href="mailto:support@shreechoice.com" className="underline font-bold">support@shreechoice.com</a></p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="animate-fade-in space-y-6">
                                {loading ? <p className="text-center font-bold text-gray-400">Loading orders...</p> : orders.length === 0 ? 
                                <div className="clay-panel p-12 text-center">
                                    <div className="text-6xl mb-4">🛍️</div>
                                    <h3 className="text-xl font-bold text-gray-800">No orders yet</h3>
                                    <p className="text-gray-500 mt-2">Start exploring our toys to make your first purchase!</p>
                                    <button onClick={() => onNavigate('/shop')} className="mt-6 bg-brand-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-opacity-90">Browse Shop</button>
                                </div> : 
                                orders.map(order => (
                                    <div key={order.id} className="clay-panel overflow-hidden border border-gray-100 hover:border-blue-200 transition-colors">
                                        <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
                                            <div className="flex gap-6 text-sm">
                                                <div><span className="block text-xs font-bold text-gray-500 uppercase">Order Placed</span><span className="font-bold text-gray-700">{new Date(order.created_at).toLocaleDateString()}</span></div>
                                                <div><span className="block text-xs font-bold text-gray-500 uppercase">Total</span><span className="font-bold text-gray-700">{formatCurrency(order.total)}</span></div>
                                                <div><span className="block text-xs font-bold text-gray-500 uppercase">Order ID</span><span className="font-mono text-gray-600">#{order.id.slice(0, 8)}</span></div>
                                            </div>
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                                {/* Tracking Info if Shipped */}
                                                {order.tracking_number && (
                                                    <div className="text-xs font-mono bg-white px-2 py-1 rounded border text-gray-600 hidden sm:block">
                                                        Tracking: {order.tracking_number}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-3">
                                                    <StatusBadge status={order.status} />
                                                    <button 
                                                        onClick={() => onNavigate(`/order/${order.id}`)}
                                                        className="text-xs font-bold bg-brand-primary text-white px-4 py-1.5 rounded-full hover:bg-blue-600 shadow-sm transition-transform active:scale-95"
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            {order.items.slice(0, 2).map((item: any, idx: number) => (
                                                <div key={idx} className="flex items-center gap-6 mb-4 last:mb-0">
                                                    <div className="w-16 h-16 bg-white rounded-lg border p-1 flex-shrink-0">
                                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-contain" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-gray-800 text-base">{item.name}</h4>
                                                        <p className="text-sm text-gray-500 font-medium mt-1">Quantity: {item.quantity}</p>
                                                    </div>
                                                    <div className="text-right">
                                                         <p className="font-bold text-brand-primary">{formatCurrency(item.price)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {order.items.length > 2 && (
                                                <p className="text-xs text-center text-gray-500 font-bold mt-2">+{order.items.length - 2} more items...</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="animate-fade-in">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-heading text-brand-primary">Saved Addresses</h2>
                                    <button onClick={() => openAddressModal(null)} className="clay-btn bg-brand-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-brand-primary/40 flex items-center gap-2">
                                        <span className="text-xl leading-none">+</span> Add New
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {loading ? <p>Loading...</p> : addresses.map(addr => (
                                        <div key={addr.id} className={`clay-panel p-6 border-2 relative group transition-all duration-300 ${addr.is_default ? 'border-brand-primary bg-blue-50/30' : 'border-transparent hover:border-gray-200'}`}>
                                            {addr.is_default && (
                                                <span className="absolute top-4 right-4 bg-brand-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">Default</span>
                                            )}
                                            
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className={`p-3 rounded-full ${addr.is_default ? 'bg-blue-100 text-brand-primary' : 'bg-gray-100 text-gray-500'}`}>
                                                    <MapPinIcon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-800 text-lg">{addr.full_name}</h3>
                                                    <p className="text-sm text-gray-500 font-mono mt-0.5">{addr.phone}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="pl-[60px]">
                                                <p className="text-gray-600 font-medium leading-relaxed">{addr.street}</p>
                                                <p className="text-gray-600 font-medium">{addr.city}, {addr.state} - {addr.zip_code}</p>
                                                <p className="text-gray-600 font-medium">{addr.country}</p>
                                            </div>

                                            <div className="flex items-center gap-4 mt-6 pl-[60px] pt-4 border-t border-gray-100/50">
                                                <button onClick={() => openAddressModal(addr)} className="text-sm font-bold text-gray-500 hover:text-brand-primary transition-colors">Edit</button>
                                                <div className="w-px h-4 bg-gray-300"></div>
                                                <button onClick={() => handleDeleteAddress(addr.id)} className="text-sm font-bold text-gray-500 hover:text-red-500 transition-colors">Remove</button>
                                                {!addr.is_default && (
                                                    <>
                                                        <div className="w-px h-4 bg-gray-300"></div>
                                                        <button onClick={() => handleSetDefaultAddress(addr.id)} className="text-sm font-bold text-brand-primary hover:underline">Set as Default</button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {addresses.length === 0 && !loading && (
                                        <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                            <p className="font-medium">No addresses saved yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
