"use client";
import { useState, useContext } from "react";
import { Star } from "lucide-react";
import { NotificationContext } from "@/store/notification-context";
import { useSession } from "next-auth/react";

interface Props {
  productId: string;
}

const RateProduct = ({ productId }: Props) => {
  const { status } = useSession();
  const notificationCtx = useContext(NotificationContext);
  
  const [hoverRating, setHoverRating] = useState(0); // For hover effect
  const [userRating, setUserRating] = useState(0);   // What they actually clicked
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRate = async (rating: number) => {
    if (status !== "authenticated") {
      notificationCtx.showNotification({
        title: "Error",
        message: "You must be logged in to rate products.",
        status: "error",
      });
      return;
    }

    setIsSubmitting(true);
    setUserRating(rating);

    try {
      const response = await fetch("/api/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating }),
      });

      if (!response.ok) throw new Error("Failed to save rating");

      notificationCtx.showNotification({
        title: "Success!",
        message: "Your rating has been saved.",
        status: "success",
      });
      
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      notificationCtx.showNotification({
        title: "Error",
        message: "Something went wrong.",
        status: "error",
      });
      setUserRating(0); // Reset on error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2 rounded-xl bg-slate-50 p-6 border border-slate-100">
      <h3 className="font-bold text-slate-900">Rate this Product</h3>
      <p className="text-sm text-slate-500 mb-2">Tell others what you think!</p>
      
      <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            disabled={isSubmitting}
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHoverRating(star)}
            className="transition-transform hover:scale-110 focus:outline-none"
          >
            <Star
              size={28}
              className={`${
                star <= (hoverRating || userRating)
                  ? "fill-yellow-400 text-yellow-400" // Gold when active
                  : "text-slate-300"                 // Gray when inactive
              } transition-colors duration-200`}
            />
          </button>
        ))}
      </div>
      {userRating > 0 && (
        <span className="text-xs font-bold text-blue-600 animate-in fade-in">
          Thanks for rating it {userRating} stars!
        </span>
      )}
    </div>
  );
};

export default RateProduct;