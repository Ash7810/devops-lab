
import React, { useState, useEffect } from 'react';
import { Order } from '../../types';
import { XIcon } from '../icons/Icon';
import { formatCurrency } from '../../lib/utils';

interface OrderDetailsModalProps {
    order: Order;
    onClose: () => void;
    // Returns true if save was successful, false otherwise
    onSave: (id: string, details: { status: Order['status']; tracking_number?: string | null }) => Promise<boolean>;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose, onSave }) => {
    const [status, setStatus] = useState<Order['status']>(order.status);
    const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || '');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        const success = await onSave(order.id, { 
            status, 
            // Send null if not shipped or empty to comply with UNIQUE constraint in DB
            tracking_number: status === 'Shipped' ? (trackingNumber || null) : null
        });
        setIsSaving(false);
        
        // Only close if the save was successful, otherwise keep open to show state/allow retry
        if (success) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={onClose}>
            <div className="bg-white p-8 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-bounce-in" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Order Details</h2>
                        <p className="text-sm text-slate-500 font-mono">ID: {order.id}</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center"><XIcon className="w-5 h-5 text-slate-500"/></button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Info & Actions */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Order Info</h3>
                            <div className="text-sm space-y-3">
                                <p><span className="font-bold text-slate-600">Date:</span> {new Date(order.created_at).toLocaleString()}</p>
                                <p><span className="font-bold text-slate-600">Total:</span> {formatCurrency(order.total)}</p>
                                <div className="space-y-2">
                                    <label className="font-bold text-slate-600 block">Status:</label>
                                    <select value={status} onChange={(e) => setStatus(e.target.value as Order['status'])} className="w-full p-2 rounded-xl text-sm font-bold border-2 appearance-none bg-white focus:ring-2 focus:ring-brand-primary outline-none">
                                        <option>Order Placed</option>
                                        <option>Order Accepted</option>
                                        <option>Shipped</option>
                                        <option>Delivered</option>
                                        <option>Cancelled</option>
                                    </select>
                                </div>
                                {status === 'Shipped' && (
                                     <div className="space-y-2 animate-fade-in">
                                        <label className="font-bold text-slate-600 block">Tracking Number:</label>
                                        <input 
                                            type="text"
                                            value={trackingNumber}
                                            onChange={(e) => setTrackingNumber(e.target.value)}
                                            className="w-full p-2 rounded-xl text-sm font-bold border-2 border-slate-200 focus:ring-2 focus:ring-brand-primary outline-none"
                                            placeholder="Enter tracking number"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Shipping Address</h3>
                            <div className="text-sm space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <p className="font-bold text-base text-slate-800">{order.shipping_address.full_name}</p>
                                <p className="text-slate-600">{order.shipping_address.street}</p>
                                <p className="text-slate-600">{order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.zip_code}</p>
                                <p className="text-slate-600">{order.shipping_address.country}</p>
                                <p className="mt-2 font-mono text-slate-600">Phone: {order.shipping_address.phone}</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Column: Items */}
                    <div>
                         <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Items Ordered ({order.items.length})</h3>
                         <div className="space-y-3 max-h-96 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-slate-50">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex gap-4 items-center bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                                    <img src={item.image_url} alt={item.name} className="w-14 h-14 object-cover rounded-md border" />
                                    <div className="flex-grow">
                                        <p className="text-sm font-bold text-slate-800 leading-tight">{item.name}</p>
                                        <p className="text-xs text-slate-500">{formatCurrency(item.price)} x {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-bold text-slate-700">{formatCurrency(item.price * item.quantity)}</p>
                                </div>
                            ))}
                         </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 border-t border-slate-200 pt-6">
                    <button onClick={onClose} className="px-5 py-2.5 font-bold text-slate-500 rounded-xl hover:bg-slate-100">Cancel</button>
                    <button onClick={handleSave} disabled={isSaving} className="px-6 py-2.5 bg-brand-primary text-white font-bold rounded-xl disabled:opacity-50 shadow-lg shadow-brand-primary/20">{isSaving ? 'Saving...' : 'Save Changes'}</button>
                </div>
            </div>
        </div>
    );
};
