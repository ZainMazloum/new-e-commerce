
"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/helpers/api-util";
interface Props {
  title: string;
  products: Product[];
}

export default function CategorySlider({ title, products }: Props) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { current } = sliderRef;
      // Scroll by the width of the viewing area (one "page" of items)
      const scrollAmount = current.clientWidth * 0.8; // 0.8 keeps the last item visible as a hint

      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-8 border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between mb-6 px-4">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
           <span className="h-2 w-2 rounded-full bg-blue-600"></span>
           {title}
        </h2>
        <span className="text-sm font-medium text-slate-400">
           {products.length} items
        </span>
      </div>

      <div className="group relative">
        {/* Left Arrow Button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg border border-gray-100 text-slate-700 opacity-0 transition-all hover:bg-slate-50 hover:scale-110 group-hover:opacity-100 sm:flex -ml-4 cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Scrollable Container */}
        {/* 'snap-x' and 'snap-mandatory' make it settle on items nicely after scrolling */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-8 px-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} // Hides scrollbar in Firefox/IE
        >
          {products.map((product) => (
            // We enforce a minimum width so items don't squash. 
            // On mobile they are wider (80% screen), on desktop smaller (280px).
            <div key={product.id} className="min-w-[80vw] sm:min-w-[300px] snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg border border-gray-100 text-slate-700 opacity-0 transition-all hover:bg-slate-50 hover:scale-110 group-hover:opacity-100 sm:flex -mr-4 cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
}