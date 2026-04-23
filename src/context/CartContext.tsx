'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Gender = 'Men' | 'Women' | 'Unisex';
export type WatchBrand =
  | 'Rolex'
  | 'Rado'
  | 'Omega'
  | 'Patek Philippe'
  | 'Audemars Piguet'
  | 'Tag Heuer'
  | 'Cartier'
  | 'Tissot';
export type WatchStyle = 'Dress' | 'Sport' | 'Diver' | 'Chronograph';
export type ProductTag = 'new' | 'bestseller' | 'editors-pick' | 'rare';

export interface Product {
  id: string;
  title: string;
  pricePKR: number;
  priceUSD: number;
  description: string;
  images: string[];
  category: string;
  brand: WatchBrand;
  gender: Gender;
  style: WatchStyle;
  tags?: ProductTag[];
  reference?: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalPricePKR: number;
  totalPriceUSD: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('shop-ash-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);

  // Save cart to local storage on change
  useEffect(() => {
    localStorage.setItem('shop-ash-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalPricePKR = cart.reduce((total, item) => total + item.pricePKR * item.quantity, 0);
  const totalPriceUSD = cart.reduce((total, item) => total + item.priceUSD * item.quantity, 0);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPricePKR,
        totalPriceUSD,
        cartCount,
      }}
    >
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
