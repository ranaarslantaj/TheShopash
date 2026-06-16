"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

type WishlistContextType = {
  wishlist: string[];
  toggle: (productId: string) => void;
  add: (productId: string) => void;
  remove: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('shop-ash-wishlist');
      if (raw) setWishlist(JSON.parse(raw));
    } catch (e) {
      console.error('Failed to load wishlist', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('shop-ash-wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist', e);
    }
  }, [wishlist]);

  const add = useCallback((productId: string) => {
    setWishlist((s) => (s.includes(productId) ? s : [...s, productId]));
  }, []);

  const remove = useCallback((productId: string) => {
    setWishlist((s) => s.filter((id) => id !== productId));
  }, []);

  const toggle = useCallback((productId: string) => {
    setWishlist((s) => (s.includes(productId) ? s.filter((id) => id !== productId) : [...s, productId]));
  }, []);

  const isWishlisted = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  return (
    <WishlistContext.Provider value={{ wishlist, toggle, add, remove, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};

export default WishlistContext;
