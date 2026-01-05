
import { getOnSaleProducts , getFiltredProducts } from '@/helpers/api-util';
import ProductCard from '@/components/products/ProductCard';

export default async function HomePage({searchParams} : {searchParams : Promise<{query?: string}>}) {
 const {query} = await searchParams;
 const products = query ? await getFiltredProducts(query) : await getOnSaleProducts();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Promotion Banner */}
      <section className="bg-black py-10 text-center text-white">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Flash Sale! ⚡
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          Limited time offers on our best-selling electronics and accessories.
        </p>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Dynamic Title based on search */}
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">
          {query ? `Results for "${query}"` : "Products on Sale"}
        </h2>

        {/* Display logic */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 italic">
              {query 
                ? `No products found matching "${query}"` 
                : "No active sales today. Check back tomorrow!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
