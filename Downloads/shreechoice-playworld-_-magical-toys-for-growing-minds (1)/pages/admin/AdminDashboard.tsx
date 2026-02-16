
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
// FIX: The User type is not available in the assumed Supabase JS version. Replaced with `any`.
// import { User } from '@supabase/supabase-js';
import type { Order, Product, Brand, Category } from '../../types';
import { GridIcon, ShoppingCartIcon, PackageIcon, PlusIcon, StarIcon, BuildingStorefrontIcon, LogOutIcon, ExternalLinkIcon, TagIcon, UploadCloudIcon, ShareIcon } from '../../components/icons/Icon';
import { OrderDetailsModal } from '../../components/Admin/OrderDetailsModal';
import { BrandManagement } from '../../components/Admin/BrandManagement';
import { CategoryManagement } from '../../components/Admin/CategoryManagement';
import { FeaturedManagement } from '../../components/Admin/FeaturedManagement';
import { BannerManagement } from '../../components/Admin/BannerManagement';
import { Logo } from '../../components/Logo';
import { ProductModal } from '../../components/Admin/ProductModal';
import { useAdminData } from '../../hooks/useAdminData';
import { useRouter } from '../../contexts/RouterContext';
import { useToast } from '../../contexts/ToastContext';
import { formatCurrency } from '../../lib/utils';
import CatalogImporterPage from './CatalogImporterPage';

type AdminView = 'overview' | 'orders' | 'products' | 'categories' | 'brands' | 'featured' | 'catalog' | 'banners';

interface AdminDashboardProps {
    user: any;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
    const [view, setView] = useState<AdminView>('overview');
    const { onNavigate } = useRouter();
    const { showToast } = useToast();

    const { stats, orders, products, brands, categories, banners, loading, setLoading, refreshData } = useAdminData();
    
    const [productModalOpen, setProductModalOpen] = useState(false);
    const [currentTargetProduct, setCurrentTargetProduct] = useState<Partial<Product> | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        showToast('Logged out successfully.');
    };

    const updateOrderDetails = async (id: string, details: { status: Order['status']; tracking_number?: string | null }) => {
        const { error } = await supabase.from('orders').update(details).eq('id', id);
        if (error) {
            showToast(`Update Failed: ${error.message}. Please check RLS policies.`);
            return false;
        } else {
            showToast('Order updated successfully!');
            await refreshData();
            return true;
        }
    };

    const handleEditProduct = (product: Product) => {
        setCurrentTargetProduct(product);
        setProductModalOpen(true);
    };

    const handleAddProduct = () => {
        setCurrentTargetProduct({
            name: '', price: 0, original_price: 0, category: categories[0]?.name || 'Toys', in_stock: true, image_url: '', description: '',
            images: [], tags: [], age_group: '1-3y', brand: brands[0]?.name || '', rating: 4.5, reviews: 0, stock_quantity: 0
        });
        setProductModalOpen(true);
    };

    const handleCloseModal = () => {
        setProductModalOpen(false);
        setCurrentTargetProduct(null);
    };

    const handleSaveProduct = async (productData: Partial<Product>) => {
        if (!productData.name || !productData.price) {
            alert("Name and Price are required.");
            return;
        }
        setLoading(true);

        const promise = productData.id 
            ? supabase.from('products').update(productData).eq('id', productData.id)
            : supabase.from('products').insert([productData]);

        const { error } = await promise;
        if (error) {
            alert(error.message);
        } else {
            await refreshData();
            handleCloseModal();
        }
        setLoading(false);
    };

    const handleDeleteProduct = async (productId: number) => {
        if (window.confirm("Are you sure you want to delete this product permanently?")) {
            setLoading(true);
            await supabase.from('products').delete().eq('id', productId);
            await refreshData();
            setLoading(false);
        }
    };

    const StatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
        const baseClass = "px-4 py-2 rounded-full text-xs font-bold";
        const statusClasses = {
            'Delivered': 'bg-green-100 text-green-700',
            'Cancelled': 'bg-red-100 text-red-700',
            'Shipped': 'bg-blue-100 text-blue-700',
            'Order Accepted': 'bg-purple-100 text-purple-700',
            'Order Placed': 'bg-yellow-100 text-yellow-700'
        };
        return <span className={`${baseClass} ${statusClasses[status]}`}>{status}</span>;
    };

    return (
        <div className="flex min-h-screen bg-slate-100 font-sans">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col">
                <div className="p-6 border-b border-slate-200"><Logo className="h-10 w-auto" /></div>
                <nav className="flex-1 px-4 py-4 space-y-2">
                    <NavItem icon={<GridIcon className="w-5 h-5"/>} label="Dashboard" active={view === 'overview'} onClick={() => setView('overview')} />
                    <NavItem icon={<ShoppingCartIcon className="w-5 h-5"/>} label="Orders" active={view === 'orders'} onClick={() => setView('orders')} />
                    <NavItem icon={<PackageIcon className="w-5 h-5"/>} label="Products" active={view === 'products'} onClick={() => setView('products')} />
                    <NavItem icon={<UploadCloudIcon className="w-5 h-5"/>} label="Catalog Importer" active={view === 'catalog'} onClick={() => setView('catalog')} />
                    <NavItem icon={<TagIcon className="w-5 h-5"/>} label="Categories" active={view === 'categories'} onClick={() => setView('categories')} />
                    <NavItem icon={<BuildingStorefrontIcon className="w-5 h-5"/>} label="Brands" active={view === 'brands'} onClick={() => setView('brands')} />
                    <NavItem icon={<ShareIcon className="w-5 h-5"/>} label="Banners" active={view === 'banners'} onClick={() => setView('banners')} />
                    <NavItem icon={<StarIcon className="w-5 h-5"/>} label="Featured" active={view === 'featured'} onClick={() => setView('featured')} />
                </nav>
                <div className="p-4 border-t border-slate-200">
                     <div className="mb-2">
                        <NavItem icon={<ExternalLinkIcon className="w-5 h-5"/>} label="View Store" active={false} onClick={() => onNavigate('/')} />
                    </div>
                    <button onClick={handleLogout} className="w-full text-left flex items-center gap-4 text-slate-500 hover:text-red-500 text-sm font-bold p-4 hover:bg-red-50 rounded-xl transition-colors">
                        <LogOutIcon className="w-5 h-5"/> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 sm:p-8 overflow-y-auto pb-24 md:pb-8">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 capitalize">{view.replace('-', ' ')}</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <div className="font-bold text-slate-700 text-sm">{user.user_metadata?.full_name || user.email}</div>
                            <div className="text-xs text-slate-500">Administrator</div>
                        </div>
                        <div className="w-10 h-10 bg-brand-primary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <button onClick={handleLogout} className="md:hidden p-2 rounded-full text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors">
                            <LogOutIcon className="w-6 h-6"/>
                        </button>
                    </div>
                </header>

                {view === 'overview' && <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Total Sales" value={formatCurrency(stats.totalSales)} icon={<div className="w-12 h-12 rounded-full bg-blue-100 text-brand-primary flex items-center justify-center"><ShoppingCartIcon className="w-6 h-6"/></div>} />
                    <StatCard title="Total Orders" value={stats.totalOrders.toString()} icon={<div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><PackageIcon className="w-6 h-6"/></div>} />
                    <StatCard title="Pending Orders" value={stats.pendingOrders.toString()} icon={<div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center"><StarIcon className="w-6 h-6"/></div>} />
                </div>}

                {view === 'orders' && <div>
                    {/* Mobile Order Cards */}
                    <div className="md:hidden space-y-4">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white rounded-xl shadow-sm border p-4 text-sm">
                                <div className="flex justify-between items-start pb-2 mb-2 border-b">
                                    <div>
                                        <div className="font-bold text-slate-800">{order.shipping_address.full_name}</div>
                                        <div className="text-xs text-slate-500 font-mono">#{order.id.slice(0, 8)}</div>
                                    </div>
                                    <div className="font-bold text-brand-primary">{formatCurrency(order.total)}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <StatusBadge status={order.status} />
                                    <button onClick={() => setSelectedOrder(order)} className="text-brand-primary hover:underline font-bold text-xs">View Details</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Desktop Order Table */}
                    <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto"><table className="w-full text-left min-w-[800px]"><thead className="bg-slate-50 text-slate-500 text-xs uppercase"><tr className="border-b border-slate-200"><th className="p-4 font-semibold">Order ID</th><th className="p-4 font-semibold">Customer</th><th className="p-4 font-semibold">Date</th><th className="p-4 font-semibold">Total</th><th className="p-4 font-semibold">Status</th><th className="p-4 font-semibold">Actions</th></tr></thead><tbody>{orders.map(order => (<tr key={order.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 text-sm"><td className="p-4 font-mono text-slate-500">#{order.id.slice(0,8)}</td><td className="p-4 font-bold text-slate-700">{order.shipping_address.full_name}</td><td className="p-4 text-slate-600">{new Date(order.created_at).toLocaleDateString()}</td><td className="p-4 font-bold text-slate-700">{formatCurrency(order.total)}</td><td className="p-4"><StatusBadge status={order.status} /></td><td className="p-4"><button onClick={() => setSelectedOrder(order)} className="text-brand-primary hover:underline font-bold">View Details</button></td></tr>))}</tbody></table></div>
                </div>}

                {view === 'products' && <div>
                    <div className="flex justify-end mb-8"><button onClick={handleAddProduct} className="bg-brand-primary text-white font-bold py-4 px-6 rounded-xl flex items-center gap-2 hover:bg-opacity-90 shadow-lg shadow-brand-primary/20"><PlusIcon className="w-4 h-4"/> Add Product</button></div>
                     {/* Mobile Product Cards */}
                     <div className="md:hidden space-y-4">
                         {products.map(product => (
                             <div key={product.id} className="bg-white rounded-xl shadow-sm border p-4 flex gap-4">
                                <img src={product.image_url} className="w-16 h-16 rounded-lg object-contain bg-white border p-2 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-800 text-sm truncate">{product.name}</p>
                                    <p className="font-bold text-brand-primary text-sm mt-2">{formatCurrency(product.price)}</p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className={`px-4 py-1 rounded-full text-[10px] font-bold ${product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{product.in_stock ? 'In Stock' : 'Out of Stock'}</span>
                                        <div className="space-x-4">
                                            <button onClick={() => handleEditProduct(product)} className="text-brand-primary hover:underline font-bold text-xs">EDIT</button>
                                            <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:underline font-bold text-xs">DELETE</button>
                                        </div>
                                    </div>
                                </div>
                             </div>
                         ))}
                     </div>
                    {/* Desktop Product Table */}
                    <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto"><table className="w-full text-left min-w-[800px]"><thead className="bg-slate-50 text-slate-500 text-xs uppercase"><tr className="border-b border-slate-200"><th className="p-4 font-semibold">ID</th><th className="p-4 font-semibold">Image</th><th className="p-4 font-semibold">Name</th><th className="p-4 font-semibold">Price</th><th className="p-4 font-semibold">Stock Qty</th><th className="p-4 font-semibold">Status</th><th className="p-4 font-semibold">Actions</th></tr></thead><tbody>{products.map(product => (<tr key={product.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 text-sm"><td className="p-4 font-mono text-slate-500">{product.id}</td><td className="p-4"><img src={product.image_url} className="w-12 h-12 rounded-lg object-contain bg-white border p-2"/></td><td className="p-4 font-bold text-slate-700">{product.name}</td><td className="p-4 font-bold text-slate-700">{formatCurrency(product.price)}</td><td className="p-4 font-bold text-slate-700">{product.stock_quantity}</td><td className="p-4"><span className={`px-4 py-1 rounded-full text-xs font-bold ${product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{product.in_stock ? 'In Stock' : 'Out of Stock'}</span></td><td className="p-4 space-x-4"><button onClick={() => handleEditProduct(product)} className="text-brand-primary hover:underline font-bold">Edit</button><button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:underline font-bold">Delete</button></td></tr>))}</tbody></table></div>
                </div>}
                
                {view === 'catalog' && <CatalogImporterPage brands={brands} categories={categories} onImportSuccess={refreshData} />}
                {view === 'categories' && <CategoryManagement categories={categories} onDataChange={refreshData} />}
                {view === 'brands' && <BrandManagement brands={brands} onDataChange={refreshData} />}
                {view === 'featured' && <FeaturedManagement products={products} onDataChange={refreshData} />}
                {view === 'banners' && <BannerManagement banners={banners} onDataChange={refreshData} />}
                
                {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onSave={updateOrderDetails} />}
                <ProductModal isOpen={productModalOpen} onClose={handleCloseModal} product={currentTargetProduct} brands={brands} categories={categories} onSave={handleSaveProduct} />
            </main>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-white border-t border-slate-100 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)]">
                <div className="flex justify-around items-center h-16">
                    <AdminMobileNavItem icon={<GridIcon/>} label="Dashboard" active={view === 'overview'} onClick={() => setView('overview')} />
                    <AdminMobileNavItem icon={<ShoppingCartIcon/>} label="Orders" active={view === 'orders'} onClick={() => setView('orders')} />
                    <AdminMobileNavItem icon={<PackageIcon/>} label="Products" active={view === 'products'} onClick={() => setView('products')} />
                    <AdminMobileNavItem icon={<ShareIcon/>} label="Banners" active={view === 'banners'} onClick={() => setView('banners')} />
                </div>
            </div>
        </div>
    );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = React.memo(({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`flex items-center gap-4 w-full px-4 py-4 rounded-xl font-bold transition-colors text-sm ${active ? 'bg-brand-primary/10 text-brand-primary' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
        {icon} {label}
    </button>
));

const AdminMobileNavItem: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = React.memo(({ icon, label, active, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center gap-2 w-full h-full">
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: `w-6 h-6 ${active ? 'text-brand-primary' : 'text-slate-400'}` })}
        <span className={`text-[10px] font-bold ${active ? 'text-brand-primary' : 'text-slate-500'}`}>{label}</span>
    </button>
));

const StatCard: React.FC<{title: string; value: string; icon: React.ReactNode}> = React.memo(({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-6">
        {icon}
        <div>
            <div className="text-slate-500 text-sm font-bold uppercase tracking-wider">{title}</div>
            <div className="text-3xl font-bold text-slate-800">{value}</div>
        </div>
    </div>
));
