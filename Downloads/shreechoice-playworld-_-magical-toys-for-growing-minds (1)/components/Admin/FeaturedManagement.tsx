
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Product } from '../../types';
import { SearchIcon } from '../icons/Icon';

interface FeaturedManagementProps {
    products: Product[];
    onDataChange: () => void;
}

export const FeaturedManagement: React.FC<FeaturedManagementProps> = ({ products, onDataChange }) => {
    const [loadingProductId, setLoadingProductId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleFeatured = async (product: Product) => {
        setLoadingProductId(product.id);
        const isCurrentlyFeatured = product.tags.includes('trending');
        let newTags;
        if (isCurrentlyFeatured) {
            newTags = product.tags.filter(t => t !== 'trending');
        } else {
            newTags = [...product.tags, 'trending'];
        }

        const { error } = await supabase.from('products').update({ tags: newTags }).eq('id', product.id);
        if (error) {
            alert('Failed to update product: ' + error.message);
        } else {
            onDataChange();
        }
        setLoadingProductId(null);
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            <div className="mb-8 relative w-full max-w-sm">
                 <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"/>
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-4 pl-12 border border-slate-200 rounded-lg bg-white"
                />
            </div>
             {/* Mobile View: Cards */}
            <div className="md:hidden space-y-4">
                {filteredProducts.map(product => (
                    <div key={product.id} className="bg-white rounded-xl shadow-sm border p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                             <img src={product.image_url} alt={product.name} className="w-12 h-12 rounded-lg object-contain bg-white border p-1 flex-shrink-0" />
                             <span className="font-bold text-slate-700 truncate text-sm">{product.name}</span>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                             <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={product.tags.includes('trending')}
                                    onChange={() => toggleFeatured(product)}
                                    disabled={loadingProductId === product.id}
                                />
                                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-brand-primary/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                            </label>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                        <tr className="border-b border-slate-200">
                            <th className="p-4 font-semibold">Product</th>
                            <th className="p-4 text-center font-semibold">Featured on Homepage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.id} className="border-b border-slate-100 text-sm hover:bg-slate-50">
                                <td className="p-4 flex items-center gap-4">
                                    <img src={product.image_url} alt={product.name} className="w-12 h-12 rounded-lg object-contain bg-white border p-1" />
                                    <span className="font-bold text-slate-700">{product.name}</span>
                                </td>
                                <td className="p-4 text-center">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={product.tags.includes('trending')}
                                            onChange={() => toggleFeatured(product)}
                                            disabled={loadingProductId === product.id}
                                        />
                                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-brand-primary/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                                    </label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
