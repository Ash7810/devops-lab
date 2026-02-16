
import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import type { Product, Brand, Category, SupabaseProduct, Banner } from '../types';
import { ALL_PRODUCTS, CATEGORIES } from '../constants';

interface DataContextType {
    products: Product[];
    brands: Brand[];
    categories: Category[];
    banners: Banner[];
    isLoading: boolean;
    fetchData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            // Don't set loading to true here for silent refreshes if called manually later
            const [productResult, brandResult, categoryResult, bannerResult] = await Promise.all([
                supabase.from('products').select('*').order('id', { ascending: true }), 
                supabase.from('brands').select('*'),
                supabase.from('categories').select('*').order('id', { ascending: true }),
                supabase.from('banners').select('*'),
            ]);
            
            // --- Products Handling ---
            if (productResult.error || !productResult.data || productResult.data.length === 0) {
                if (productResult.error) {
                    console.warn('Supabase Products Error:', productResult.error.message);
                }
                console.info('Falling back to local constant data for Products.');
                setProducts(ALL_PRODUCTS);
            } else if (productResult.data) {
                // Sanitizing data to ensure no null values crash the UI
                setProducts(productResult.data.map((p: SupabaseProduct) => ({
                    ...p,
                    image_url: p.image_url || p.image || '',
                    images: p.images || [],
                    tags: p.tags || [],
                    colors: p.colors || [],
                    rating: Number(p.rating) || 0,
                    reviews: Number(p.reviews) || 0,
                    price: Number(p.price) || 0,
                    original_price: p.original_price ? Number(p.original_price) : undefined,
                    stock_quantity: Number(p.stock_quantity) || 0,
                    description: p.description || ''
                } as Product)));
            }
        
            // --- Brands Handling ---
            if (brandResult.error) {
                console.error('Error fetching brands:', brandResult.error.message || brandResult.error);
                setBrands([]); 
            } else if (brandResult.data) {
                setBrands(brandResult.data as Brand[]);
            }

            // --- Categories Handling ---
            if (categoryResult.error) {
                console.error('Error fetching categories:', categoryResult.error.message);
                setCategories(CATEGORIES as Category[]); // Fallback to constant
            } else if (categoryResult.data) {
                setCategories(categoryResult.data as Category[]);
            }

            // --- Banners Handling ---
            if (bannerResult.data) {
                setBanners(bannerResult.data as Banner[]);
            }

        } catch (error) {
            console.error('Critical Data Fetch Error (Network/API):', error);
            // Complete Fallback Strategy
            setProducts(ALL_PRODUCTS);
            setCategories(CATEGORIES as Category[]);
            
            // Generate temporary brands from ALL_PRODUCTS since we don't have a Brands constant
            const derivedBrands = Array.from(new Set(ALL_PRODUCTS.map(p => p.brand))).map((name, idx) => ({
                id: idx + 1,
                name: name,
                logo_url: '', // No logo in product data
                is_featured: idx < 4
            }));
            setBrands(derivedBrands);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        setIsLoading(true);
        fetchData();
    }, [fetchData]);

    const value = useMemo(() => ({
        products, brands, categories, banners, isLoading, fetchData
    }), [products, brands, categories, banners, isLoading, fetchData]);

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
