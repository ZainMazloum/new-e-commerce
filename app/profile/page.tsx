"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, User, LogOut, Loader2 } from "lucide-react";
import { IOrder } from "@/helpers/api-util";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // 2. Apply the interface to your state
  const [orders, setOrders] = useState<IOrder[]>([]); 
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?callbackUrl=/profile");
    }

    if (status === "authenticated") {
      fetch("/api/orders")
        .then((res) => res.json())
        .then((data: IOrder[]) => {
          setOrders(data);
          setLoadingOrders(false);
        })
        .catch((err) => {
          console.error("Error fetching orders:", err);
          setLoadingOrders(false);
        });
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-slate-900 mb-8">My Account</h1>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* LEFT COLUMN: User Info Card */}
          <div className="lg:col-span-4">
            <div className="overflow-visible rounded-2xl bg-white shadow-sm border border-slate-100 relative">
              <div className="bg-slate-900 h-24 rounded-t-2xl"></div>
              <div className="px-6 pb-6 relative">
                {/* Profile Image - z-index and spacing fix */}
                <div className="absolute -top-12 left-6 h-24 w-24 rounded-full border-4 border-white overflow-hidden bg-slate-200 shadow-md z-20">
                  {session.user?.image ? (
                    <Image src={session.user.image} alt="Profile" fill className="object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-slate-100 text-slate-400">
                      <User className="h-10 w-10" />
                    </div>
                  )}
                </div>
                
                {/* Text section moved down to avoid overlap */}
                <div className="pt-16">
                  <h2 className="text-xl font-bold text-slate-900">{session.user?.name}</h2>
                  <p className="text-slate-500 text-sm truncate">{session.user?.email}</p>
                </div>

                <div className="mt-8 border-t border-slate-100 pt-6">
                  <Link href="/api/auth/signout" className="flex w-full items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-red-600 transition-colors">
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Real Order History using the Interface */}
          <div className="lg:col-span-8">
            <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Package className="h-6 w-6 text-blue-600" /> Order History
                </h2>
              </div>

              {loadingOrders ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-slate-300" /></div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="rounded-xl border border-slate-100 p-4 hover:bg-slate-50 transition-all">
                      <div className="flex flex-col sm:flex-row justify-between mb-4">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order ID</p>
                          <p className="font-mono text-sm text-slate-900">#{order._id.slice(-8)}</p>
                        </div>
                        <div className="mt-2 sm:mt-0 sm:text-right">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status</p>
                          <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 border-t border-slate-50 pt-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-slate-600">
                              <span className="font-bold text-slate-900">{item.quantity}x</span> {item.name}
                            </span>
                            <span className="font-medium text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex justify-between items-center border-t border-slate-50 pt-4">
                        <span className="text-xs text-slate-400">{order.date}</span>
                        <span className="text-lg font-black text-slate-900">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}

                  {orders.length === 0 && (
                    <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl">
                      No orders found. <Link href="/shop" className="text-blue-600 font-bold hover:underline ml-1">Go Shopping</Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}