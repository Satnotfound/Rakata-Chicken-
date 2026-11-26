import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem } from '../types/rakata';

const CART_STORAGE_KEY = 'rakata_cart_v1';

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  lastAddedMessage: string | null;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, 'cartItemId'>) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  dismissToast: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = window.localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAddedMessage, setLastAddedMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage quota errors gracefully
    }
  }, [items]);

  useEffect(() => {
    if (!lastAddedMessage) return;
    const timer = window.setTimeout(() => {
      setLastAddedMessage(null);
    }, 3200);
    return () => window.clearTimeout(timer);
  }, [lastAddedMessage]);

  const addItem = (newItem: Omit<CartItem, 'cartItemId'>) => {
    const signature = [
      newItem.kind,
      newItem.itemId,
      newItem.sizeLabel,
      newItem.toppingName,
      newItem.sauceName,
      newItem.potatoChoice ?? '',
    ].join('|');

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.cartItemId === signature);
      if (existingIndex >= 0) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        updated[existingIndex] = {
          ...existing,
          quantity: existing.quantity + newItem.quantity,
        };
        return updated;
      }
      return [...prev, { ...newItem, cartItemId: signature }];
    });

    setLastAddedMessage(`${newItem.quantity}x ${newItem.name} ditambahkan ke keranjang`);
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        isCartOpen,
        lastAddedMessage,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        dismissToast: () => setLastAddedMessage(null),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
