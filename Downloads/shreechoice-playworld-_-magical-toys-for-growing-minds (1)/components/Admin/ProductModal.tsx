
import React, { useState, useEffect } from 'react';
import type { Product, Brand, Category } from '../../types';
import { XIcon, TrashIcon } from '../icons/Icon';
import { useImageUpload } from '../../hooks/useImageUpload';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (productData: Partial<Product>) => Promise<void>;
    product: Partial<Product> | null;
    brands: Brand[];
    categories: Category[];
}

const ModalInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, id, ...props }) => {
    const inputId = id || props.name || label.replace(/\s+/g, '-').toLowerCase();
    return (
        <div>
            <label htmlFor={inputId} className="text-xs font-bold text-slate-500 uppercase">{label}</label>
            <input id={inputId} {...props} className="w-full border-slate-200 border rounded-xl p-2.5 mt-1" />
        </div>
    );
};

const ModalSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({ label, id, children, ...props }) => {
    const selectId = id || props.name || label.replace(/\s+/g, '-').toLowerCase();
    return (
         <div>
            <label htmlFor={selectId} className="text-xs font-bold text-slate-500 uppercase">{label}</label>
            <select id={selectId} {...props} className="w-full border-slate-200 border rounded-xl p-2.5 mt-1 bg-white">
                {children}
            </select>
        </div>
    );
};

const ModalTextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, id, ...props }) => {
    const textAreaId = id || props.name || label.replace(/\s+/g, '-').toLowerCase();
    return (
         <div>
            <label htmlFor={textAreaId} className="text-xs font-bold text-slate-500 uppercase">{label}</label>
            <textarea id={textAreaId} {...props} className="w-full border-slate-200 border rounded-xl p-2.5 mt-1 h-24" />
        </div>
    );
};

export const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, product, brands, categories }) => {
    const [formData, setFormData] = useState<Partial<Product> | null>(product);
    const [managedImages, setManagedImages] = useState<string[]>([]);
    const [colorsStr, setColorsStr] = useState('');
    const [tagsStr, setTagsStr] = useState('');
    const { isUploading, uploadImage } = useImageUpload();
    const [isSaving, setIsSaving] = useState(false);

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

    useEffect(() => {
        setFormData(product);
        const allImages = [...new Set([product?.image_url, ...(product?.images || [])].filter(Boolean))];
        setManagedImages(allImages);
        setTagsStr(product?.tags?.join(', ') || '');
        setColorsStr(product?.colors?.join(', ') || '');
    }, [product]);

    if (!isOpen || !formData) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        let processedValue: any = value;
        if (type === 'number') {
            const numValue = Number(value);
            // Prevent negative values
            if (numValue < 0) return;
            processedValue = value === '' ? null : numValue;
        }
        if (e.target.type === 'checkbox') {
            processedValue = (e.target as HTMLInputElement).checked;
        }

        setFormData(prev => prev ? { ...prev, [name]: processedValue } : null);
    };

    const handleImageFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return;
        const file = event.target.files[0];
        const publicUrl = await uploadImage(file);
        if (publicUrl) {
            setManagedImages(prev => [...prev, publicUrl]);
        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setManagedImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSaveClick = async () => {
        if (!formData) return;

        if (!formData.name) { return alert("Product name is required."); }
        if (formData.price == null || formData.price < 0) { return alert("A valid positive price is required."); }
        if (formData.stock_quantity == null || formData.stock_quantity < 0) { return alert("Stock quantity is required and cannot be negative."); }

        setIsSaving(true);
        const finalData = {
            ...formData,
            image_url: managedImages[0] || '',
            images: managedImages.slice(1),
            tags: tagsStr.split(',').map(s => s.trim()).filter(Boolean),
            colors: colorsStr.split(',').map(s => s.trim()).filter(Boolean),
        };
        await onSave(finalData);
        setIsSaving(false);
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-bounce-in">
                <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-slate-800">{formData.id ? 'Edit Product' : 'Add New Product'}</h2><button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center"><XIcon className="w-5 h-5 text-slate-500"/></button></div>
                <div className="space-y-4">
                    <ModalInput label="Name*" name="name" value={formData.name || ''} onChange={handleChange} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><ModalInput label="Selling Price (₹)*" name="price" type="number" min="0" value={formData.price || ''} onChange={handleChange} /><ModalInput label="MRP / Original Price (₹)" name="original_price" type="number" min="0" value={formData.original_price ?? ''} onChange={handleChange} /></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><ModalSelect label="Category" name="category" value={formData.category} onChange={handleChange}>{categories.map(c => <option key={c.id}>{c.name}</option>)}</ModalSelect><ModalSelect label="Brand" name="brand" value={formData.brand} onChange={handleChange}>{brands.map(b => <option key={b.id}>{b.name}</option>)}</ModalSelect></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><ModalSelect label="Age Group" name="age_group" value={formData.age_group} onChange={handleChange}>{['0-12m', '1-3y', '3-5y', '5-8y', '8-14y', '14+'].map(a => <option key={a}>{a}</option>)}</ModalSelect><ModalInput label="Tags (comma-separated)" name="tags" value={tagsStr} onChange={e => setTagsStr(e.target.value)} /></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><ModalInput label="Colors (comma-separated)" name="colors" value={colorsStr} onChange={e => setColorsStr(e.target.value)} /><ModalInput label="Stock Quantity" name="stock_quantity" type="number" min="0" value={formData.stock_quantity || 0} onChange={handleChange} /></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><ModalInput label="Rating (0-5)" name="rating" type="number" step="0.1" min="0" max="5" value={formData.rating || ''} onChange={handleChange} /><ModalInput label="Reviews Count" name="reviews" type="number" min="0" value={formData.reviews || ''} onChange={handleChange} /></div>
                    
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Images</label>
                        <div className="mt-2 p-3 border border-slate-200 rounded-xl bg-slate-50 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {managedImages.map((img, index) => (
                                <div key={index} className="relative group aspect-square">
                                    <img src={img} alt="Preview" className="w-full h-full rounded-lg object-contain bg-white border p-2"/>
                                    {index === 0 && <div className="absolute top-1 left-1 bg-brand-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded">Main</div>}
                                    <button onClick={() => handleRemoveImage(index)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"><TrashIcon className="w-3 h-3"/></button>
                                </div>
                            ))}
                             <label className="cursor-pointer aspect-square bg-slate-200 hover:bg-slate-300 text-slate-500 font-bold flex items-center justify-center rounded-xl border-2 border-dashed border-slate-300 transition-colors">
                                <span className="text-2xl">+</span>
                                <input type="file" hidden accept="image/*" onChange={handleImageFileChange} disabled={isUploading} />
                            </label>
                        </div>
                        {isUploading && <p className="text-xs text-slate-500 mt-2 animate-pulse">Uploading image...</p>}
                    </div>
                    
                    <ModalTextArea label="Description" name="description" value={formData.description || ''} onChange={handleChange} />
                    <label className="flex items-center gap-2"><input type="checkbox" name="in_stock" checked={formData.in_stock} onChange={handleChange} className="h-4 w-4 rounded text-brand-primary focus:ring-brand-primary"/> <span className="text-sm font-semibold text-slate-700">In Stock</span></label>
                </div>
                <div className="flex justify-end gap-3 mt-8">
                    <button onClick={onClose} className="px-5 py-2.5 font-bold text-slate-500 rounded-xl hover:bg-slate-100">Cancel</button>
                    <button onClick={handleSaveClick} disabled={isSaving || isUploading} className="px-6 py-2.5 bg-brand-primary text-white font-bold rounded-xl disabled:opacity-50 shadow-lg shadow-brand-primary/20">{isSaving ? 'Saving...' : 'Save Product'}</button>
                </div>
            </div>
        </div>
    );
};
