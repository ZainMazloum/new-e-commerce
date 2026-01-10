"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react'; 
import { Product } from '@/helpers/api-util';
import { useContext, useState } from 'react'; // 1. Import useState
import { NotificationContext } from '@/store/notification-context';
import { useSession } from 'next-auth/react'; // 2. Import useSession
import { useCartStore } from '@/store/cart-context-zustand';
interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const { id, name, price, originalPrice, image, rating, isOnSale } = product;
  
 const addItem = useCartStore((state) => state.addItem); // Zustand cart store
  const notificationCtx = useContext(NotificationContext);
  const { status } = useSession(); // 3. Get Auth Status

  // 4. Local state for interactivity
  const [hoverRating, setHoverRating] = useState(0);
  const [isRating, setIsRating] = useState(false);

  // 5. Add to Cart Logic
  const addToCartHandler = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if inside a Link
   addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  // 6. Rating Logic (Same as RateProduct component)
  const handleRate = async (e: React.MouseEvent, starValue: number) => {
    e.preventDefault(); // Stop click from bubbling to product link
    
    if (status !== "authenticated") {
      notificationCtx.showNotification({
        title: "Login Required",
        message: "Please login to rate products",
        status: "error",
      });
      return;
    }

    setIsRating(true);

    try {
      const response = await fetch("/api/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, rating: starValue }),
      });

      if (!response.ok) throw new Error("Failed");

      notificationCtx.showNotification({
        title: "Rated!",
        message: `You rated this ${starValue} stars`,
        status: "success",
      });
      
      // Optional: You could update local state here to reflect the new average immediately
      // if your API returned it, but usually a notification is enough for a card.

    } catch (error) {
      console.error(error);
      notificationCtx.showNotification({
        title: "Error",
        message: "Failed to save rating",
        status: "error",
      });
    } finally {
      setIsRating(false);
      setHoverRating(0);
    }
  };

  return (
    <div className="group relative border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white flex flex-col h-full">
      {/* Sale Badge */}
      {isOnSale && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10 shadow-sm">
          SALE
        </span>
      )}

      {/* Product Image */}
      <Link href={`/products/${id}`} className="block relative h-64 w-full mb-4 overflow-hidden rounded-md cursor-pointer">
        <Image
          src={`${image}.jpg`}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Product Info */}
      <div className="flex-1">
        <Link href={`/products/${id}`}>
          <h3 className="text-lg font-semibold text-gray-800 truncate hover:text-blue-600 transition-colors">
            {name}
          </h3>
        </Link>

        {/* 7. Interactive Star Rating */}
        <div 
          className="flex items-center my-2" 
          onMouseLeave={() => setHoverRating(0)}
        >
          {[1, 2, 3, 4, 5].map((starValue) => (
            <button
              key={starValue}
              type="button"
              disabled={isRating}
              onClick={(e) => handleRate(e, starValue)}
              onMouseEnter={() => setHoverRating(starValue)}
              className="focus:outline-none transition-transform hover:scale-110 p-0.5 cursor-pointer"
            >
              <Star
                size={16}
                className={`${
                  // Logic: If hovering, show hover value. If not, show actual database average.
                  starValue <= (hoverRating || Math.floor(rating || 0))
                    ? "fill-yellow-400 text-yellow-400" 
                    : "text-gray-300"
                } transition-colors`}
              />
            </button>
          ))}
          <span className="text-xs text-gray-500 ml-2 font-medium">
             ({rating ? rating.toFixed(1) : 0})
          </span>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xl font-bold text-gray-900">${price.toFixed(2)}</span>
          {isOnSale && originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Add to Cart Button */}
      <button 
        className="w-full mt-4 cursor-pointer bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors font-medium active:scale-95" 
        onClick={addToCartHandler}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;