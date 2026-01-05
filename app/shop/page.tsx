
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CategorySlider from "@/components/shop/CategorySlider"; 
import ProductCard from "@/components/products/ProductCard";
import { getAllProducts } from "@/helpers/api-util";
import { Product } from "@/helpers/api-util";

// 1. Update the Props Type: searchParams is now a Promise
type Props = {
  searchParams: Promise<{ search?: string }>;
};

export default async function ShopPage({ searchParams }: Props) {
  const allProducts = await getAllProducts();
  
  // 2. AWAIT the searchParams before using them
  const resolvedSearchParams = await searchParams;
  const searchTerm = resolvedSearchParams.search?.toLowerCase();

  // 3. Filter Logic
  let displayProducts = allProducts;
  if (searchTerm) {
    displayProducts = allProducts.filter((p) => 
      p.name.toLowerCase().includes(searchTerm) || 
      p.category?.toLowerCase().includes(searchTerm)
    );
  }

  const categories = Array.from(new Set(allProducts.map((p) => p.category || "Uncategorized")));

  return (
    <div className="min-h-screen bg-white pb-20 pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col border-b border-gray-100 pb-10 mb-2">
          <Link href="/" className="group inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 mb-6 w-max transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            {searchTerm ? `Results for "${searchTerm}"` : "All Products"}
          </h1>
          <p className="mt-4 text-xl text-slate-500">
            {searchTerm 
              ? `Found ${displayProducts.length} items matching your search.`
              : "Browse our full collection organized by category."}
          </p>
        </div>

        {/* 4. Conditional Rendering */}
        {searchTerm ? (
          // IF SEARCHING: Show simple Grid
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 mt-8">
            {displayProducts.length > 0 ? (
              displayProducts.map((product) => (
                <ProductCard key={product.id} product={product as Product} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                 <p className="text-xl text-slate-400">No products found.</p>
                 <Link href="/shop" className="mt-4 inline-block text-blue-600 font-bold hover:underline">
                   View All Products
                 </Link>
              </div>
            )}
          </div>
        ) : (
          // IF NOT SEARCHING: Show Categories with Sliders
          <div className="flex flex-col gap-8">
            {categories.map((category) => {
              const categoryProducts = allProducts.filter((p) => (p.category || "Uncategorized") === category);
              if (categoryProducts.length === 0) return null;
              return (
                <CategorySlider 
                  key={category} 
                  title={category} 
                  products={categoryProducts} 
                />
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}