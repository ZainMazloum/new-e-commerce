"use client";
import { useEffect, useRef } from 'react';
import { useCartStore } from '@/store/cart-context-zustand';

export default function CartSync() {
  const { items, setCart } = useCartStore();
  const isFirstRender = useRef(true);

  // 1. Load from LocalStorage on Mount (Client-side only)
  useEffect(() => {
    const savedData = localStorage.getItem("cart-storage");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Update the store with the data found in LS
        setCart(parsedData.items, parsedData.totalAmount);
      } catch (error) {
        console.error("Failed to parse cart data" , error);
      }
    }
    isFirstRender.current = false;
  }, [setCart]);

  // 2. Save to LocalStorage whenever 'items' changes
  useEffect(() => {
    // Don't save empty state on the very first render before we loaded the data!
    if (isFirstRender.current) return;

    const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    
    const dataToSave = {
      items: items,
      totalAmount: totalAmount
    };
    
    localStorage.setItem("cart-storage", JSON.stringify(dataToSave));
  }, [items]);

  return null; // This component renders nothing, it just runs logic
}