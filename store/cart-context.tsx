/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { createContext, useState} from "react";
// 1. Define what a Cart Item looks like
export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  totalAmount: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void; // Removes ONE quantity
  clearCart: () => void; // Removes ALL items
  removeItemCompletely: (id: string) => void; // <--- NEW: Removes ALL quantities of specific item
};

// Create the context with initial empty values
export const CartContext = createContext<CartContextType>({
  items: [],
  totalAmount: 0,
  addItem: (item) => {},
  removeItem: (id) => {},
  clearCart: () => {},
  removeItemCompletely: (id) => {}, // <--- NEW
});

export function CartContextProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Calculate total price dynamically
  const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);

  // 2. The Logic to Add an Item
  function addItemHandler(item: CartItem) {
    setItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id);
      const existingItem = prevItems[existingItemIndex];

      let updatedItems;

      if (existingItem) {
        // If it exists, just increase quantity
        const updatedItem = {
          ...existingItem,
          quantity: existingItem.quantity + 1,
        };
        updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = updatedItem;
      } else {
        // If it's new, add it to the list with quantity 1
        updatedItems = [...prevItems, { ...item, quantity: 1 }];
      }
      return updatedItems;
    });
  }

  // Remove ALL items from cart
  function clearCartHandler() {
    setItems([]); 
  }

  // 3. The Logic to Remove ONE quantity of an Item
  function removeItemHandler(id: string) {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.id === id);
      const existingItem = prevItems[existingItemIndex];
      
      if (!existingItem) return prevItems; // Safety check

      let updatedItems;

      if (existingItem.quantity === 1) {
        // If quantity is 1, remove it completely
        updatedItems = prevItems.filter((item) => item.id !== id);
      } else {
        // If quantity > 1, decrease it by 1
        const updatedItem = { ...existingItem, quantity: existingItem.quantity - 1 };
        updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = updatedItem;
      }

      return updatedItems;
    });
  }

  // 4. NEW FUNCTION: Remove ALL quantities of a specific item
  function removeItemCompletelyHandler(id: string) {
    setItems((prevItems) => {
      // Filter out the item with the matching id
      const updatedItems = prevItems.filter((item) => item.id !== id);
      return updatedItems;
    });
  }

  const contextValue: CartContextType = {
    items: items,
    totalAmount: totalAmount,
    addItem: addItemHandler,
    removeItem: removeItemHandler,
    clearCart: clearCartHandler,
    removeItemCompletely: removeItemCompletelyHandler, // <--- NEW
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}