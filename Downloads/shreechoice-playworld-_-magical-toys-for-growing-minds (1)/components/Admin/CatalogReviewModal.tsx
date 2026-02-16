import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Brand, Category } from '../../types';
import { ExtractedProduct } from '../../pages/admin/CatalogImporterPage';
import { useToast } from '../../contexts/ToastContext';
import { XIcon, SparklesIcon } from '../icons/Icon';
import { formatCurrency } from '../../lib/utils';

interface CatalogReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    products: ExtractedProduct[];
    brands: Brand[];
    categories: Category[];
    onImportSuccess: () => void;
}

interface ReviewProduct extends ExtractedProduct {
    price: string;
    stock_quantity: string;
    brand: string;
    final_category: string;
}

export const CatalogReviewModal: React.FC<CatalogReviewModalProps> = ({ isOpen, onClose, products, brands, categories, onImportSuccess }) => {
    const [reviewProducts, setReviewProducts] = useState<ReviewProduct[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            const initialReviewProducts = products.map(p => ({
                ...p,
                price: '',
                stock_quantity: '10', // Default stock
                brand: brands[0]?.name || '',
                final_category: categories.find(c => c.name.toLowerCase() === p.Category.toLowerCase())?.name || categories[0]?.name || ''
            }));
            setReviewProducts(initialReviewProducts);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, products, brands, categories]);

    const handleFieldChange = (sku: number, field: keyof ReviewProduct, value: string) => {
        setReviewProducts(prev => prev.map(p => p.SKU === sku ? { ...p, [field]: value } : p));
    };

    const handleSaveAll = async () => {
        setIsSaving(true);
        const productsToInsert = [];
        
        for (const p of reviewProducts) {
            const priceNum = parseFloat(p.price);
            const stockNum = parseInt(p.stock_quantity, 10);
            if (isNaN(priceNum) || priceNum <= 0) {
                alert(`Please enter a valid selling price for "${p.Name}".`);
                setIsSaving(false);
                return;
            }
             if (isNaN(stockNum) || stockNum < 0) {
                alert(`Please enter a valid stock quantity for "${p.Name}".`);
                setIsSaving(false);
                return;
            }
            
            let imageUrl = 'https://placehold.co/500x500/F1F5F9/94A3B8?text=No+Image';
            if (p.image_base64) {
                try {
                    const dataUrl = `data:image/jpeg;base64,${p.image_base64}`;
                    const response = await fetch(dataUrl);
                    const blob = await response.blob();
                    const file = new File([blob], `${p.SKU || Date.now()}.jpg`, { type: 'image/jpeg' });
                    
                    const filePath = `${Date.now()}_${file.name}`;

                    const { error: uploadError } = await supabase.storage
                        .from('product-images')
                        .upload(filePath, file);

                    if (uploadError) {
                        throw new Error(`Image upload failed for ${p.Name}: ${uploadError.message}`);
                    }

                    const { data } = supabase.storage
                        .from('product-images')
                        .getPublicUrl(filePath);
                    
                    if (data?.publicUrl) {
                        imageUrl = data.publicUrl;
                    }

                } catch (uploadError: any) {
                    console.error(uploadError);
                    showToast(`Could not upload image for ${p.Name}. Using placeholder.`);
                }
            }

            productsToInsert.push({
                name: p.Name,
                price: priceNum,
                original_price: p.MRP,
                description: p.description,
                category: p.final_category,
                brand: p.brand,
                stock_quantity: stockNum,
                in_stock: stockNum > 0,
                image_url: imageUrl,
                images: [],
                tags: ['new'],
                age_group: '1-3y',
                rating: 4.5,
                reviews: 0,
            });
        }
        
        const { error } = await supabase.from('products').insert(productsToInsert);

        if (error) {
            showToast(`Error importing products: ${error.message}`);
        } else {
            showToast(`${productsToInsert.length} products imported successfully!`);
            onImportSuccess();
            onClose();
        }

        setIsSaving(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl animate-bounce-in">
                <div className="flex justify-between items-center mb-6 flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Review & Import Products</h2>
                        <p className="text-sm text-slate-500">Confirm details and set prices before adding to your store.</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center"><XIcon className="w-5 h-5 text-slate-500"/></button>
                </div>
                
                <div className="flex-grow overflow-y-auto -mx-4 px-4">
                    <table className="w-full text-left text-sm">
                        <thead className="sticky top-0 bg-white z-10">
                            <tr className="border-b">
                                <th className="p-2 font-bold text-slate-600">Image</th>
                                <th className="p-2 font-bold text-slate-600">Product</th>
                                <th className="p-2 font-bold text-slate-600">MRP</th>
                                <th className="p-2 font-bold text-slate-600">Selling Price*</th>
                                <th className="p-2 font-bold text-slate-600">Stock*</th>
                                <th className="p-2 font-bold text-slate-600">Brand</th>
                                <th className="p-2 font-bold text-slate-600">Category</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviewProducts.map(p => (
                                <tr key={p.SKU} className="border-b hover:bg-slate-50">
                                     <td className="p-2">
                                        {p.image_base64 ? (
                                            <img src={`data:image/jpeg;base64,${p.image_base64}`} alt={p.Name} className="w-12 h-12 object-cover rounded-md border" />
                                        ) : (
                                            <div className="w-12 h-12 bg-slate-100 rounded-md text-slate-400 text-[9px] flex items-center justify-center text-center">No Img</div>
                                        )}
                                    </td>
                                    <td className="p-2">
                                        <p className="font-bold text-slate-800 truncate" title={p.Name}>{p.Name}</p>
                                        <p className="text-xs text-slate-500 font-mono">SKU: {p.SKU}</p>
                                    </td>
                                    <td className="p-2 font-mono">{formatCurrency(p.MRP)}</td>
                                    <td className="p-2">
                                        <input type="number" value={p.price} onChange={e => handleFieldChange(p.SKU, 'price', e.target.value)} className="w-24 border-slate-200 border rounded-md p-1.5" placeholder="e.g. 1499" />
                                    </td>
                                    <td className="p-2">
                                        <input type="number" value={p.stock_quantity} onChange={e => handleFieldChange(p.SKU, 'stock_quantity', e.target.value)} className="w-20 border-slate-200 border rounded-md p-1.5" />
                                    </td>
                                     <td className="p-2">
                                        <select value={p.brand} onChange={e => handleFieldChange(p.SKU, 'brand', e.target.value)} className="w-32 border-slate-200 border rounded-md p-1.5 bg-white text-xs">
                                            {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                                        </select>
                                    </td>
                                    <td className="p-2">
                                        <select value={p.final_category} onChange={e => handleFieldChange(p.SKU, 'final_category', e.target.value)} className="w-32 border-slate-200 border rounded-md p-1.5 bg-white text-xs">
                                            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex-shrink-0 flex justify-end gap-3 mt-8 pt-6 border-t">
                    <button onClick={onClose} className="px-5 py-2.5 font-bold text-slate-500 rounded-xl hover:bg-slate-100">Cancel</button>
                    <button onClick={handleSaveAll} disabled={isSaving} className="px-6 py-2.5 bg-brand-primary text-white font-bold rounded-xl disabled:opacity-50 shadow-lg shadow-brand-primary/20 flex items-center gap-2">
                        <SparklesIcon className="w-5 h-5"/>
                        {isSaving ? 'Importing...' : `Import ${reviewProducts.length} Products`}
                    </button>
                </div>
            </div>
        </div>
    );
};