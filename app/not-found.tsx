"use client"; // Client component for interactivity (BackButton)

import Link from "next/link";
import { MoveLeft, Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center bg-white px-4 text-center">
      {/* Icon Container with Animation */}
      <div className="mb-8 rounded-full bg-slate-50 p-8 ring-1 ring-slate-100 animate-in zoom-in duration-300">
        <SearchX className="h-16 w-16 text-slate-400" />
      </div>

      {/* Main Error Message */}
      <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">
        404
      </h1>
      <h2 className="mt-4 text-2xl font-bold text-slate-900">
        Page not found
      </h2>
      <p className="mt-4 max-w-md text-base text-slate-500">
        Sorry, we couldn’t find the page you’re looking for. It might have been removed, renamed, or doesn&apos;t exist.
      </p>

      {/* Action Buttons */}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-6">
        <Link
          href="/"
          className="group inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 hover:ring-4 hover:ring-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
        >
          <Home className="mr-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
          Back to Home
        </Link>
        
        <button
          onClick={() => window.history.back()}
          className="group inline-flex items-center justify-center rounded-full border-2 border-slate-100 bg-white px-8 py-3 text-sm font-bold text-slate-600 transition-all hover:border-slate-200 cursor-pointer hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
        >
          <MoveLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Go Back
        </button>
      </div>
    </div>
  );
}