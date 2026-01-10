// store/useCartStore.ts
import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  // This action will be used to load data manually
  setCart: (items: CartItem[], total: number) => void; 
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  removeItemCompletely: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalAmount: 0,

  // Manual helper to load saved data
  setCart: (items, totalAmount) => set({ items, totalAmount }),

  addItem: (newItem) => {
    const { items } = get();
    const existingIndex = items.findIndex((item) => item.id === newItem.id);
    let updatedItems;

    if (existingIndex >= 0) {
      updatedItems = [...items];
      updatedItems[existingIndex] = {
        ...items[existingIndex],
        quantity: items[existingIndex].quantity + newItem.quantity,
      };
    } else {
      updatedItems = [...items, newItem];
    }

    const newTotal = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    set({ items: updatedItems, totalAmount: newTotal });
  },removeItemCompletely: (id) => {
    const { items } = get();
    const updatedItems = items.filter((item) => item.id !== id);
    const newTotal = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    set({ items: updatedItems, totalAmount: newTotal });
  },

removeItem: (id: string) => {
  const { items } = get();
  const existingItem = items.find((item) => item.id === id);
  
  if (!existingItem) return;

  let updatedItems;

  if (existingItem.quantity === 1) {
    // If quantity is 1, remove completely
    updatedItems = items.filter((item) => item.id !== id);
  } else {
    // Decrease quantity by 1
    updatedItems = items.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity - 1 } : item
    );
  }

  // Recalculate total
  const newTotal = updatedItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  );

  set({ items: updatedItems, totalAmount: newTotal });
},
  clearCart: () => set({ items: [], totalAmount: 0 }),
}));