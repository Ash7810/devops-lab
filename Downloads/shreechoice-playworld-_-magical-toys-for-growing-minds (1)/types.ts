
export interface Product {
  id: number;
  name: string;
  price: number;
  original_price?: number;
  image_url: string;
  images: string[];
  description: string;
  category: string;
  age_group: string;
  brand: string;
  tags: string[];
  rating: number;
  reviews: number;
  in_stock: boolean;
  stock_quantity: number;
  colors?: string[];
}

// Represents the raw data from Supabase, which might have a legacy 'image' field
export interface SupabaseProduct extends Omit<Product, 'image_url'> {
    image_url?: string;
    image?: string; // Legacy field
}


export interface CartItem extends Product {
  quantity: number;
  isGift?: boolean;
  giftMessage?: string;
  giftWrap?: boolean;
}

export interface Category {
  id: number;
  name:string;
  image_url: string;
}

export interface Brand {
  id: number;
  name: string;
  logo_url: string;
  is_featured?: boolean;
}

export interface Banner {
    id: number;
    slug: string;
    title: string;
    subtitle: string;
    button_text: string;
    button_link: string;
    image_url: string;
    text_color: string;
    background_color: string;
    is_active: boolean;
}

// FIX: Added optional user_id and created_at properties to align with the data structure from Supabase, resolving destructuring errors in CheckoutPage.tsx.
export interface Address {
    id: string;
    full_name: string;
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    phone: string;
    is_default: boolean;
    user_id?: string;
    created_at?: string;
}

export interface ShippingInfo {
    full_name: string;
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    phone: string;
}

export interface Order {
    id: string;
    user_id?: string | null;
    customer_email?: string;
    created_at: string;
    items: CartItem[];
    total: number;
    status: 'Order Placed' | 'Order Accepted' | 'Shipped' | 'Delivered' | 'Cancelled';
    shipping_address: ShippingInfo;
    tracking_number?: string | null;
}

export interface UserProfile {
    id: string;
    email: string;
    role: 'user' | 'admin';
}
