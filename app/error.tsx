"use client"; 

import { useEffect } from "react";
import { RefreshCcw, AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center bg-white px-4 text-center">
      <div className="mb-6 rounded-full bg-red-50 p-6">
        <AlertTriangle className="h-12 w-12 text-red-500" />
      </div>
      
      <h2 className="text-3xl font-black text-slate-900">Something went wrong!</h2>
      <p className="mt-3 max-w-md text-slate-500">
        We apologize for the inconvenience. An unexpected error occurred on our end.
      </p>

      <button
        onClick={reset}
        className="mt-8 inline-flex cursor-pointer items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 hover:scale-105"
      >
        <RefreshCcw className="mr-2 h-4 w-4" />
        Try again
      </button>
    </div>
  );
}