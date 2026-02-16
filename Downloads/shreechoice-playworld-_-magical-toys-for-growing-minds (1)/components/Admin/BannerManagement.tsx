
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Banner } from '../../types';
import { useImageUpload } from '../../hooks/useImageUpload';
import { useToast } from '../../contexts/ToastContext';
import { CheckCircleIcon, RotateCcwIcon, UploadCloudIcon, TrashIcon } from '../icons/Icon';

interface BannerManagementProps {
    banners: Banner[];
    onDataChange: () => void;
}

const DEFAULT_BANNERS: Record<string, Partial<Banner>> = {
    'home-promo': {
        slug: 'home-promo',
        title: 'Big Smiles, Bigger Savings!',
        subtitle: 'Get up to 50% OFF on selected educational toys and building blocks.',
        button_text: 'Shop The Sale',
        button_link: '/shop?tag=deals',
        text_color: '#FFFFFF',
        background_color: '#000000',
        is_active: true,
        image_url: ''
    },
    'shop-promo': {
        slug: 'shop-promo',
        title: 'Grab Up to 50% Off On Selected Toys',
        subtitle: 'Limited Time Offer',
        button_text: 'Shop Sale Items',
        button_link: '/shop?tag=deals',
        text_color: '#FFFFFF',
        background_color: '#8B5CF6', // Violet
        is_active: true,
        image_url: ''
    }
};

export const BannerManagement: React.FC<BannerManagementProps> = ({ banners, onDataChange }) => {
    const [selectedSlug, setSelectedSlug] = useState('home-promo');
    const [formData, setFormData] = useState<Partial<Banner>>({});
    const { isUploading, uploadImage } = useImageUpload();
    const { showToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    // Load data from props into local state
    useEffect(() => {
        const existingBanner = banners.find(b => b.slug === selectedSlug);
        if (existingBanner) {
            setFormData(existingBanner);
        } else {
            // Initialize with default template if not found in DB
            setFormData(DEFAULT_BANNERS[selectedSlug] || { slug: selectedSlug });
        }
        setIsDirty(false);
    }, [selectedSlug, banners]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setIsDirty(true);
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIsDirty(true);
            const url = await uploadImage(e.target.files[0]);
            if (url) {
                setFormData(prev => ({ ...prev, image_url: url }));
            }
        }
    };

    const handleRemoveImage = () => {
        setIsDirty(true);
        setFormData(prev => ({ ...prev, image_url: '' }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        
        // Prepare payload: Remove ID to avoid conflicts if creating, relies on onConflict='slug'
        // We cast to any because we want to be flexible with the ID handling during upsert
        const { id, created_at, ...payload } = formData as any;
        
        // Ensure slug is set
        payload.slug = selectedSlug;

        const { data, error } = await supabase
            .from('banners')
            .upsert(payload, { onConflict: 'slug' })
            .select();

        if (error) {
            console.error('Banner Save Error:', error);
            alert('Failed to save banner. Please ensure the "banners" table exists and you have admin permissions. \n\nError: ' + error.message);
        } else {
            showToast(`${selectedSlug === 'home-promo' ? 'Home' : 'Shop'} banner updated!`);
            setIsDirty(false);
            onDataChange(); // Refresh global data
        }
        setIsSaving(false);
    };

    const handleDiscard = () => {
        if (window.confirm('Are you sure you want to discard unsaved changes?')) {
            const existingBanner = banners.find(b => b.slug === selectedSlug);
            setFormData(existingBanner || DEFAULT_BANNERS[selectedSlug] || { slug: selectedSlug });
            setIsDirty(false);
            showToast('Changes discarded.');
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-12">
            {/* Tab Switcher */}
            <div className="mb-8 flex gap-4 overflow-x-auto pb-2 border-b border-gray-200">
                {Object.keys(DEFAULT_BANNERS).map(slug => (
                    <button 
                        key={slug}
                        onClick={() => setSelectedSlug(slug)}
                        className={`px-6 py-3 rounded-t-xl font-bold text-sm whitespace-nowrap transition-colors border-t border-x border-b-0 relative top-[1px] ${selectedSlug === slug ? 'bg-white text-brand-primary border-gray-200' : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'}`}
                    >
                        {slug === 'home-promo' ? 'Home Page Banner' : 'Shop Page Banner'}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-b-2xl rounded-tr-2xl shadow-sm border border-gray-200 p-6 md:p-8 -mt-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Edit {selectedSlug === 'home-promo' ? 'Home' : 'Shop'} Banner</h2>
                        <p className="text-sm text-gray-500 mt-1">Configure the look and content of your promotional banner.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                        <span className="text-sm font-bold text-slate-600">Active</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                name="is_active" 
                                checked={formData.is_active ?? true} 
                                onChange={handleChange} 
                                className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Form Fields */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Headline</label>
                            <textarea name="title" rows={2} value={formData.title || ''} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none font-bold text-lg" placeholder="e.g. Big Summer Sale!"/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Subtitle</label>
                            <textarea name="subtitle" rows={3} value={formData.subtitle || ''} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none text-sm" placeholder="e.g. Get 50% off on all items..."/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Button Label</label>
                                <input type="text" name="button_text" value={formData.button_text || ''} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl outline-none text-sm font-medium" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Link URL</label>
                                <input type="text" name="button_link" value={formData.button_link || ''} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl outline-none text-sm font-medium" />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Text Color</label>
                                <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-xl">
                                    <input type="color" name="text_color" value={formData.text_color || '#ffffff'} onChange={handleChange} className="w-8 h-8 rounded cursor-pointer border-none bg-transparent p-0" />
                                    <span className="text-xs font-mono text-gray-500 uppercase">{formData.text_color}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">BG Color</label>
                                <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-xl">
                                    <input type="color" name="background_color" value={formData.background_color || '#000000'} onChange={handleChange} className="w-8 h-8 rounded cursor-pointer border-none bg-transparent p-0" />
                                    <span className="text-xs font-mono text-gray-500 uppercase">{formData.background_color}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Background Image</label>
                            <div className="flex gap-3 items-center">
                                <div className="relative flex-grow">
                                    <input type="text" name="image_url" value={formData.image_url || ''} onChange={handleChange} placeholder="https://..." className="w-full p-3 border border-gray-200 rounded-xl outline-none text-sm"/>
                                </div>
                                <label className={`cursor-pointer bg-slate-100 hover:bg-slate-200 px-4 py-3 rounded-xl font-bold text-sm text-slate-700 whitespace-nowrap flex items-center gap-2 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <UploadCloudIcon className="w-4 h-4" />
                                    {isUploading ? '...' : 'Upload'}
                                    <input type="file" hidden accept="image/*" onChange={handleImageChange} disabled={isUploading} />
                                </label>
                                {formData.image_url && (
                                    <button onClick={handleRemoveImage} className="p-3 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl" title="Remove Image">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1">Leave empty to use the solid background color.</p>
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="flex flex-col">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 text-center">Live Preview</h3>
                        <div className="bg-gray-100 p-4 rounded-2xl border border-gray-200 flex-grow flex items-center justify-center">
                            
                            {/* The Simulated Banner */}
                            <div 
                                className="w-full aspect-[16/9] md:aspect-[2/1] rounded-3xl relative overflow-hidden shadow-xl flex flex-col items-center justify-center text-center p-6 transition-all duration-500"
                                style={{ 
                                    backgroundColor: formData.background_color || '#000',
                                    backgroundImage: formData.image_url ? `url(${formData.image_url})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    color: formData.text_color || '#fff'
                                }}
                            >
                                {/* Overlay for readability if image exists */}
                                {formData.image_url && <div className="absolute inset-0 bg-black/40 transition-opacity"></div>}
                                
                                <div className="relative z-10 max-w-md">
                                    <span className="inline-block py-1 px-3 rounded-lg bg-white/20 text-[10px] font-bold uppercase tracking-wider mb-3 border border-white/30 backdrop-blur-sm">
                                        Limited Offer
                                    </span>
                                    <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3 leading-tight drop-shadow-md">
                                        {formData.title || 'Your Title Here'}
                                    </h2>
                                    <p className="text-xs md:text-sm opacity-90 mb-6 font-medium leading-relaxed drop-shadow-sm">
                                        {formData.subtitle || 'Your subtitle goes here. Describe the offer.'}
                                    </p>
                                    <button className="bg-white text-slate-900 px-6 py-2.5 rounded-full text-xs font-bold shadow-lg transform hover:-translate-y-0.5 transition-transform">
                                        {formData.button_text || 'Shop Now'}
                                    </button>
                                </div>
                            </div>

                        </div>
                        <p className="text-center text-xs text-gray-400 mt-3">This is an approximation. Actual rendering depends on the device.</p>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-4">
                    {isDirty && (
                        <button 
                            onClick={handleDiscard}
                            disabled={isSaving}
                            className="px-6 py-3 rounded-xl font-bold text-slate-500 border border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all flex items-center gap-2"
                        >
                            <RotateCcwIcon className="w-4 h-4" /> Discard Changes
                        </button>
                    )}
                    <button 
                        onClick={handleSave} 
                        disabled={isSaving || !isDirty}
                        className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 ${isDirty ? 'bg-brand-primary text-white hover:bg-opacity-90' : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'}`}
                    >
                        {isSaving ? 'Saving...' : <><CheckCircleIcon className="w-5 h-5"/> Save Banner</>}
                    </button>
                </div>
            </div>
        </div>
    );
};
