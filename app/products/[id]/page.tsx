import Image from "next/image";
import Link from "next/link";
import { ArrowLeft , Check } from "lucide-react";
import AddToCartSection from "@/components/products/AddToCartSection";
import RateProduct from "@/components/products/RateProduct";
import { getProductById } from "@/helpers/api-util";
import { notFound } from "next/navigation";

interface ProductDetailProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailProps) {
  // ✅ Await params (Next.js 16)
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const product = await getProductById(id);

  // ✅ Guard against missing product
  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white pb-20 pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shopping
        </Link>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-100 border border-gray-200">
            <Image
              src={
                product.image.startsWith("http")
                  ? product.image
                  : `${product.image}.jpg`
              }
              alt={product.name}
              fill
              className="object-cover object-center"
              priority
            />
          </div>

          {/* Info */}
          <div className="mt-10 px-2 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              {product.name}
            </h1>

<div className="mt-12 border-t border-slate-100 pt-10">
         <RateProduct productId={(await params).id} />
       </div>

            <div className="mt-6">
              <p className="text-4xl font-black text-slate-900">
                ${product.price}
              </p>
            </div>

            <div className="mt-6">
              <p className="text-base text-gray-600 leading-relaxed">
                {product.description ??
                  "This is a premium product designed for excellence."}
              </p>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-sm font-bold text-slate-900">Highlights</h3>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  In Stock & Ready to Ship
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  Free Shipping
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  Official Warranty Included
                </li>
              </ul>
            </div>

            <AddToCartSection product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
