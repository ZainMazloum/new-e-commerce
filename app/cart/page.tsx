"use client";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Lock } from "lucide-react";

// 1. Import only what you need from Zustand
import { useCartStore, CartItem } from "@/store/cart-context-zustand"; 

export default function CartPage() {
  const { status } = useSession();
const items = useCartStore((state) => state.items);
  const totalAmountVal = useCartStore((state) => state.totalAmount);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const removeItemCompletely = useCartStore((state) => state.removeItemCompletely);
  const hasItems = items.length > 0;
const totalAmount = `$${totalAmountVal.toFixed(2)}`;
const cartItemAddHandler = (item: CartItem) => {
    addItem({ ...item, quantity: 1 });
  };

  const cartItemRemoveHandler = (id: string) => {
    removeItem(id);
  };

  const cartRemoveAllitems = (id: string) => {
    removeItemCompletely(id);
  };
  if (!hasItems) {
    return (
      <div className="flex min-h-[calc(100vh-150px)] w-full flex-col items-center justify-center px-4 text-center bg-white">
        <div className="mb-6 rounded-full bg-slate-50 p-10 animate-in zoom-in duration-300">
          <ShoppingBag className="h-16 w-16 text-slate-300" />
        </div>
        <h2 className="text-3xl font-black text-slate-900">Your cart is empty</h2>
        <p className="mt-3 text-slate-500 max-w-sm text-lg">
          Time to fill it with some amazing electronics!
        </p>
        <Link 
          href="/" 
          className="mt-10 rounded-full bg-blue-700 px-10 py-4 font-bold text-white transition-all hover:bg-blue-800 hover:scale-105 cursor-pointer shadow-lg shadow-blue-200"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black text-slate-950 mb-12 tracking-tight">
        Your Shopping Bag
      </h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-16 lg:items-start">
        {/* Left Side: Items */}
        <section className="lg:col-span-7">
          <ul className="divide-y divide-slate-100 border-t border-slate-100">
            {items.map((item) => (
              <li key={item.id} className="flex py-8 transition-colors hover:bg-slate-50/50 px-2 rounded-xl">
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 sm:h-40 sm:w-40">
                  <Image
                    src={`${item.image}.jpg`} 
                    alt={item.name}
                    fill
                    className="object-cover object-center"
                  />
                </div>

                <div className="ml-6 flex flex-1 flex-col">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-950">
                        <Link href={`/products/${item.id}`} className="hover:text-blue-700 cursor-pointer transition-colors">
                          {item.name}
                        </Link>
                      </h3>
                      <p className="mt-1 text-xl font-black text-blue-700">${item.price.toFixed(2)}</p>
                    </div>
                    
                    <button 
                      onClick={() => cartRemoveAllitems(item.id)}
                      className="text-slate-400 hover:text-red-500 cursor-pointer p-2 transition-colors"
                    >
                      <Trash2 className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center bg-white border-2 border-slate-100 rounded-full shadow-sm">
                      <button 
                        onClick={() => cartItemRemoveHandler(item.id)}
                        className="p-2 hover:bg-slate-50 text-slate-600 rounded-l-full cursor-pointer transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-5 text-sm font-black text-slate-950">
                          {item.quantity}
                      </span>
                      <button 
                        onClick={() => cartItemAddHandler(item)}
                        className="p-2 hover:bg-slate-50 text-slate-600 rounded-r-full cursor-pointer transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Right Side: Summary Card */}
        <section className="mt-16 rounded-3xl bg-slate-950 p-8 text-white lg:col-span-5 lg:mt-0 sticky top-32">
          <h2 className="text-xl font-bold mb-8">Summary</h2>

          <div className="space-y-4">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span>{totalAmount}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Shipping</span>
              <span className="text-green-400 font-bold">FREE</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-800 pt-6 mt-6">
              <span className="text-xl font-bold">Total</span>
              <span className="text-3xl font-black">{totalAmount}</span>
            </div>
          </div>

          <div className="mt-10">
            {status === "authenticated" ? (
              <Link 
                href="/success" 
                className="w-full flex items-center justify-center rounded-xl bg-blue-600 px-6 py-5 text-lg font-black text-white shadow-xl hover:bg-blue-500 hover:-translate-y-1 transition-all cursor-pointer"
              >
                Proceed to Checkout 
                <ArrowRight className="ml-2 h-6 w-6" />
              </Link>
            ) : (
              <Link 
                href="/login?callbackUrl=/cart" 
                className="w-full flex items-center justify-center rounded-xl bg-slate-800 px-6 py-5 text-lg font-black text-white shadow-xl hover:bg-slate-700 hover:-translate-y-1 transition-all cursor-pointer"
              >
                <Lock className="mr-2 h-5 w-5 text-blue-400" />
                Sign in to Checkout 
              </Link>
            )}
            
            {status === "unauthenticated" && (
                <p className="mt-4 text-center text-xs text-slate-500 italic">
                    You must be logged in to complete your order.
                </p>
            )}
          </div>
          
          <Link 
            href="/" 
            className="block mt-6 text-center text-sm font-bold text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            ← Continue Shopping
          </Link>
        </section>
      </div>
    </main>
  );
}