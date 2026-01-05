"use client";
import { useEffect, useContext, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CheckCircle, Loader2 } from "lucide-react";
import { CartContext } from "@/store/cart-context";

export default function SuccessPage() {
  const { status } = useSession();
  const router = useRouter();
  const cartCtx = useContext(CartContext);
  const [orderId, setOrderId] = useState<string>("");
  const isSubmittingRef = useRef(false); // Prevents double-submission

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    // LOGIC: If authenticated AND has items, save to DB
    if (status === "authenticated" && cartCtx.items.length > 0 && !isSubmittingRef.current) {
      isSubmittingRef.current = true; // Lock it immediately

      const saveOrder = async () => {
        try {
          const response = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: cartCtx.items,
              totalAmount: cartCtx.totalAmount
            }),
          });

          const data = await response.json();
          
          if (response.ok) {
            setOrderId(data.orderId);
            cartCtx.clearCart(); // Only clear AFTER it is saved
          }
        } catch (error) {
          console.error("Failed to save order", error);
        }
      };

      saveOrder();
    }
  }, [status, cartCtx, router]);

  if (status === "loading" || (status === "authenticated" && cartCtx.items.length > 0 && !orderId)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="mt-4 text-slate-500 font-medium">Processing your order...</p>
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <div className="mb-8">
        <CheckCircle className="h-24 w-24 text-green-500" />
      </div>
      
      <h1 className="text-4xl font-black text-slate-900 mb-2">
        Order Placed Successfully!
      </h1>
      
      <p className="text-slate-500 text-lg mb-8">
        Your order has been saved to your account.
      </p>

      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-10 w-full max-w-sm">
        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Order Ref</p>
        <p className="text-xl font-mono font-black text-slate-900 break-all">
          #{orderId || "Generating..."}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/profile" 
          className="flex items-center justify-center rounded-full bg-blue-600 px-8 py-4 font-bold text-white transition-all hover:bg-blue-700 cursor-pointer shadow-lg shadow-blue-200"
        >
          View My Orders
        </Link>
        <Link 
          href="/" 
          className="flex items-center justify-center rounded-full bg-slate-950 px-8 py-4 font-bold text-white transition-all hover:bg-slate-800 cursor-pointer shadow-lg"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}