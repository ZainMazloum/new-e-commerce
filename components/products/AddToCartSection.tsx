"use client";
import { useState, useContext } from "react";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/cart-context-zustand";
import { NotificationContext } from "@/store/notification-context";
import { Product } from "@/helpers/api-util";

// Option 1: Use Product directly
interface Props {
  product: Product;  // ← Use the imported Product interface
}
export default function AddToCartSection({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
 const addItem = useCartStore((state) => state.addItem);
  const notificationCtx = useContext(NotificationContext);

  const addToCartHandler = () => {
    // Loop to add the specific quantity
    for (let i = 0; i < quantity; i++) {
     addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    notificationCtx.showNotification({
      title: "Added to Cart",
      message: `${quantity}x ${product.name} added!`,
      status: "success",
    });
  };

  return (
    <div className="mt-8 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        {/* Quantity Selector */}
        <div className="flex items-center rounded-full border border-gray-300">
          <button 
            onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
            className="p-3 hover:text-blue-700"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-4 font-bold text-slate-900">{quantity}</span>
          <button 
            onClick={() => setQuantity((prev) => prev + 1)}
            className="p-3 hover:text-blue-700"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

      </div>

      <button 
        onClick={addToCartHandler}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-slate-800 hover:scale-[1.02] active:scale-95 sm:w-auto sm:px-12"
      >
        <ShoppingCart className="h-5 w-5" />
        Add to Cart
      </button>
    </div>
  );
}