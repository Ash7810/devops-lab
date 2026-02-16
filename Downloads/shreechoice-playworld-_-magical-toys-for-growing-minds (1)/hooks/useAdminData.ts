
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Order, Product, Brand, Category, SupabaseProduct, Banner } from '../types';
import { CATEGORIES } from '../constants';

export const useAdminData = () => {
    const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, pendingOrders: 0 });
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const [orderResult, productResult, brandResult, categoryResult, bannerResult] = await Promise.all([
            supabase.from('orders').select('*').order('created_at', { ascending: false }),
            supabase.from('products').select('*').order('id', { ascending: true }),
            supabase.from('brands').select('*').order('name', { ascending: true }),
            supabase.from('categories').select('*').order('id', { ascending: true }),
            supabase.from('banners').select('*'),
        ]);

        if (orderResult.data) {
            setOrders(orderResult.data as Order[]);
            const totalSales = orderResult.data.reduce((acc, curr) => acc + curr.total, 0);
            const pending = orderResult.data.filter(o => o.status === 'Order Placed' || o.status === 'Order Accepted').length;
            setStats({ totalSales, totalOrders: orderResult.data.length, pendingOrders: pending });
        }
        if (productResult.data) {
            const mappedProducts = productResult.data.map((p: SupabaseProduct) => ({
                ...p,
                image_url: p.image_url || p.image || '',
            })) as Product[];
            setProducts(mappedProducts);
        }
        if (brandResult.data) {
            setBrands(brandResult.data as Brand[]);
        }
        
        // Check for error OR empty data. If the table is empty, we likely want the default categories to show up in Admin so the user can see *something*.
        if (categoryResult.error || !categoryResult.data || categoryResult.data.length === 0) {
            console.warn('Admin Hook: Could not fetch categories from Supabase (or table empty). Falling back to local constant data.', categoryResult.error?.message);
            setCategories(CATEGORIES);
        } else {
            setCategories(categoryResult.data as Category[]);
        }

        if (bannerResult.data) {
            setBanners(bannerResult.data as Banner[]);
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { stats, orders, products, brands, categories, banners, loading, setLoading, refreshData: fetchData };
};
