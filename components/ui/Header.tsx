"use client";
import Link from "next/link";
import { ShoppingCart, User, Search, LogOut, Menu, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useContext, useState } from "react";
import { CartContext } from "@/store/cart-context";
import { useRouter } from "next/navigation"; // 1. Import useRouter

const Header = () => {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // 2. Add State for Search
  const [query, setQuery] = useState(""); 
  const router = useRouter(); 
  const cartCtx = useContext(CartContext);

  // 3. The Function that runs when you press Enter
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim() !== "") {
      // Go to shop page with the search term in the URL
      router.push(`/shop?search=${encodeURIComponent(query)}`);
      setIsMobileMenuOpen(false); // Close mobile menu if open
    }
  };

  const getUserName = () => {
    if (session?.user?.email) {
      return session.user.email.split("@")[0];
    }
    return "User";
  };

  const totalCartItems = cartCtx.items.reduce((total, item) => 
    total + item.quantity, 0  
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b-2 border-gray-100 bg-white/95 backdrop-blur py-6 mb-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center">
            <Link href="/" className="text-3xl font-black tracking-tighter text-slate-950">
              NEXT<span className="text-blue-700">STORE</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-10 text-base font-bold text-slate-800">
            <Link href="/shop" className="hover:text-blue-700 transition-colors">Shop All</Link>
          </nav>

          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* DESKTOP SEARCH BAR */}
            <div className="relative hidden lg:block">
               <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
               <input 
                 type="search" 
                 placeholder="Search products..." 
                 className="h-10 w-72 rounded-full border-2 border-gray-200 bg-gray-50 pl-10 text-sm focus:border-blue-500 focus:outline-none"
                 // Connect the input to our logic:
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
                 onKeyDown={handleSearch}
               />
            </div>

            <Link href="/cart" className="relative p-2 text-slate-900 hover:bg-gray-100 rounded-full">
              <ShoppingCart className="h-7 w-7" />
              {totalCartItems > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-blue-700 text-[11px] font-bold text-white flex items-center justify-center animate-bounce-short">
                  {totalCartItems}
                </span>
              )}
            </Link>

            <div className="hidden md:flex ml-4 border-l-2 border-gray-200 pl-6 items-center gap-6">
              {status === "loading" && (
                 <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              )}

              {status === "authenticated" && (
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex sm:flex-col sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-gray-500">Hello,</span>
                    <span className="text-sm font-bold text-slate-900 leading-none">
                      {getUserName()}
                    </span>
                  </div>
                  <Link href="/profile" className="p-2 hover:bg-gray-100 rounded-full text-slate-900">
                    <User className="h-6 w-6" />
                  </Link>
                  <button 
                    onClick={() => signOut()}
                    className="p-2 hover:bg-red-50 rounded-full text-red-500 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-6 w-6" />
                  </button>
                </div>
              )}

              {status === "unauthenticated" && (
                <div className="flex items-center gap-6">
                  <Link href="/login" className="text-sm font-bold text-slate-950 hover:text-blue-700">Sign In</Link>
                  <Link href="/register" className="bg-slate-950 text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-slate-800">Join Now</Link>
                </div>
              )}
            </div>

            <button 
              className="md:hidden p-2 text-slate-900 hover:bg-gray-100 rounded-full cursor-pointer"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-7 w-7" />
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-60 flex justify-end">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          <div className="relative h-full w-[80%] max-w-sm bg-white shadow-2xl p-6 flex flex-col gap-8 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-slate-900">Menu</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-slate-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* MOBILE SEARCH BAR */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                type="search" 
                placeholder="Search products..." 
                className="h-12 w-full rounded-xl border-2 border-gray-100 bg-gray-50 pl-10 text-base focus:border-blue-500 focus:outline-none"
                // Connect the input here too:
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>

            <nav className="flex flex-col gap-4">
              <Link 
                href="/" 
                className="text-lg font-bold text-slate-800 py-2 border-b border-gray-50 hover:text-blue-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/shop" 
                className="text-lg font-bold text-slate-800 py-2 border-b border-gray-50 hover:text-blue-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Shop All
              </Link>
            </nav>

            <div className="mt-auto border-t border-gray-100 pt-6">
              {status === "authenticated" ? (
                <div className="flex flex-col gap-4">
                   <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                        {getUserName().charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{getUserName()}</p>
                        <p className="text-xs text-slate-500">{session?.user?.email}</p>
                      </div>
                   </div>
                   <Link 
                     href="/profile"
                     className="w-full flex justify-center items-center gap-2 rounded-xl bg-slate-100 py-3 font-bold text-slate-900"
                     onClick={() => setIsMobileMenuOpen(false)}
                   >
                     <User className="h-5 w-5" /> My Profile
                   </Link>
                   <button 
                     onClick={() => signOut()}
                     className="w-full flex justify-center items-center gap-2 rounded-xl border-2 border-red-50 text-red-500 py-3 font-bold hover:bg-red-50"
                   >
                     <LogOut className="h-5 w-5" /> Sign Out
                   </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                   <Link 
                     href="/login"
                     className="w-full text-center rounded-xl border-2 border-slate-200 py-3 font-bold text-slate-900"
                     onClick={() => setIsMobileMenuOpen(false)}
                   >
                     Sign In
                   </Link>
                   <Link 
                     href="/register"
                     className="w-full text-center rounded-xl bg-blue-700 py-3 font-bold text-white shadow-lg shadow-blue-200"
                     onClick={() => setIsMobileMenuOpen(false)}
                   >
                     Join Now
                   </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;