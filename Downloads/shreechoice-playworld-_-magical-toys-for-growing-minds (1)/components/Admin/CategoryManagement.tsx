import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Category } from '../../types';
import { XIcon, PlusIcon } from '../icons/Icon';
import { useImageUpload } from '../../hooks/useImageUpload';

interface CategoryManagementProps {
    categories: Category[];
    onDataChange: () => void;
}

export const CategoryManagement: React.FC<CategoryManagementProps> = ({ categories, onDataChange }) => {
    const [showModal, setShowModal] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<Partial<Category> | null>(null);
    const [loading, setLoading] = useState(false);
    const { isUploading, uploadImage } = useImageUpload();

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showModal]);

    const handleEdit = (category: Category) => {
        setCurrentCategory(category);
        setShowModal(true);
    };

    const handleAddNew = () => {
        setCurrentCategory({ name: '', image_url: '' });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentCategory(null);
    };

    const handleImageFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return;
        const file = event.target.files[0];
        const publicUrl = await uploadImage(file);
        if (publicUrl) {
            setCurrentCategory(prev => ({ ...prev, image_url: publicUrl }));
        }
    };

    const handleSave = async () => {
        if (!currentCategory) return;

        // Sanitize inputs
        const name = currentCategory.name?.trim();
        const imageUrl = currentCategory.image_url?.trim();

        if (!name) {
            return alert('Category name is required.');
        }
        if (!imageUrl) {
            return alert('Image URL is required.');
        }

        // Validate URL format
        try {
            new URL(imageUrl);
        } catch (e) {
            return alert('Please enter a valid Image URL (starting with http:// or https://).');
        }

        setLoading(true);

        const categoryData = {
            name: name,
            image_url: imageUrl,
        };

        const promise = currentCategory.id
            ? supabase.from('categories').update(categoryData).eq('id', currentCategory.id)
            : supabase.from('categories').insert([categoryData]);
        
        const { error } = await promise;
        if (error) {
            alert(error.message);
        } else {
            onDataChange();
            handleCloseModal();
        }

        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this category? This might affect products associated with it.')) {
            setLoading(true);
            await supabase.from('categories').delete().eq('id', id);
            onDataChange();
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-end mb-8">
                <button onClick={handleAddNew} className="bg-brand-primary text-white font-bold py-4 px-6 rounded-xl flex items-center gap-2 hover:bg-opacity-90 shadow-lg shadow-brand-primary/20">
                    <PlusIcon className="w-4 h-4"/> Add New Category
                </button>
            </div>

            {/* Mobile View: Cards */}
            <div className="md:hidden space-y-4">
                {categories.map(category => (
                    <div key={category.id} className="bg-white rounded-xl shadow-sm border p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <img src={category.image_url} alt={category.name} className="h-12 w-12 object-cover rounded-lg border" />
                            <span className="font-bold text-slate-700">{category.name}</span>
                        </div>
                        <div className="space-x-4">
                            <button onClick={() => handleEdit(category)} className="text-brand-primary font-bold hover:underline text-sm">Edit</button>
                            <button onClick={() => handleDelete(category.id)} className="text-red-600 font-bold hover:underline text-sm">Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                        <tr className="border-b border-slate-200">
                            <th className="p-4 font-semibold">ID</th>
                            <th className="p-4 font-semibold">Image</th>
                            <th className="p-4 font-semibold">Name</th>
                            <th className="p-4 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(category => (
                            <tr key={category.id} className="border-b border-slate-100 text-sm hover:bg-slate-50">
                                <td className="p-4 font-mono text-slate-500">{category.id}</td>
                                <td className="p-4">
                                    <img src={category.image_url} alt={category.name} className="h-12 w-12 object-cover rounded-lg border bg-slate-100" />
                                </td>
                                <td className="p-4 font-bold text-slate-700">{category.name}</td>
                                <td className="p-4 space-x-4">
                                    <button onClick={() => handleEdit(category)} className="text-brand-primary font-bold hover:underline">Edit</button>
                                    <button onClick={() => handleDelete(category.id)} className="text-red-600 font-bold hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && currentCategory && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-bounce-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">{currentCategory.id ? 'Edit Category' : 'Add New Category'}</h2>
                            <button onClick={handleCloseModal} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center"><XIcon className="w-5 h-5 text-slate-500"/></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Category Name</label>
                                <input value={currentCategory.name || ''} onChange={e => setCurrentCategory({...currentCategory, name: e.target.value})} className="w-full p-2.5 border border-slate-200 rounded-xl mt-1" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Image URL</label>
                                {currentCategory.image_url && (
                                    <div className="my-2 p-2 border border-slate-200 rounded-xl inline-block bg-slate-50">
                                        <img src={currentCategory.image_url} alt="Preview" className="h-24 w-24 object-cover rounded-md" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/F1F5F9/94A3B8?text=Invalid'; }} />
                                    </div>
                                )}
                                <div className="flex gap-2 items-center mt-1">
                                    <input value={currentCategory.image_url || ''} onChange={e => setCurrentCategory({...currentCategory, image_url: e.target.value})} className="flex-grow p-2.5 border border-slate-200 rounded-xl text-sm" placeholder="Paste image URL" />
                                    <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 px-4 rounded-xl text-sm whitespace-nowrap">
                                        {isUploading ? 'Uploading...' : 'Upload'}
                                        <input type="file" hidden accept="image/*" onChange={handleImageFileChange} disabled={isUploading} />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 mt-8">
                            <button onClick={handleCloseModal} className="px-6 py-2.5 font-bold text-slate-500 rounded-xl hover:bg-slate-100">Cancel</button>
                            <button onClick={handleSave} disabled={loading || isUploading} className="px-6 py-2.5 bg-brand-primary text-white font-bold rounded-xl disabled:opacity-50 shadow-lg shadow-brand-primary/20">{loading || isUploading ? 'Saving...' : 'Save Category'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};