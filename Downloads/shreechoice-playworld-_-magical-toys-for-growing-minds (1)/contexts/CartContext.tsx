
import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback, useMemo } from 'react';
import type { Product, CartItem } from '../types';
import { useToast } from './ToastContext';

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, quantity?: number) => void;
    updateQuantity: (productId: number, newQuantity: number) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
    cartCount: number;
    updateGiftOptions: (productId: number, options: Partial<Pick<CartItem, 'isGift' | 'giftMessage' | 'giftWrap'>>) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { showToast } = useToast();
    const [cart, setCart] = useState<CartItem[]>(() => {
        try {
            const savedCart = localStorage.getItem('shreechoice-cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('Failed to parse cart from localStorage', error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('shreechoice-cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = useCallback((product: Product, quantityToAdd: number = 1) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            const currentQuantity = existingItem ? existingItem.quantity : 0;
            const stock = product.stock_quantity;
            
            if (!product.in_stock || currentQuantity + quantityToAdd > stock) {
                if (stock === 0) {
                    showToast(`Sorry, "${product.name}" is out of stock.`);
                } else {
                    showToast(`Sorry, only ${stock} of "${product.name}" are in stock.`);
                }
                return prevCart;
            }

            showToast(`${quantityToAdd > 1 ? `${quantityToAdd}x ` : ''}${product.name} added to cart!`);

            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantityToAdd }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity: quantityToAdd }];
        });
    }, [showToast]);

    const removeFromCart = useCallback((productId: number) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
        showToast('Item removed from cart');
    }, [showToast]);

    const updateQuantity = useCallback((productId: number, newQuantity: number) => {
        if (newQuantity < 1) {
            // We call the internal logic of removeFromCart directly or via the state setter to avoid dependency cycles if possible,
            // but since removeFromCart is memoized, we can add it to deps.
            setCart(prevCart => prevCart.filter(item => item.id !== productId));
            showToast('Item removed from cart');
            return;
        }
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    }, [showToast]);

    const updateGiftOptions = useCallback((productId: number, options: Partial<Pick<CartItem, 'isGift' | 'giftMessage' | 'giftWrap'>>) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === productId
                    ? { ...item, ...options }
                    : item
            )
        );
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

    const value = useMemo(() => ({
        cart, 
        addToCart, 
        updateQuantity, 
        removeFromCart, 
        clearCart, 
        cartCount, 
        updateGiftOptions
    }), [cart, addToCart, updateQuantity, removeFromCart, clearCart, cartCount, updateGiftOptions]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
