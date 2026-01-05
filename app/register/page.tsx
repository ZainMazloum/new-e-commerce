/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useContext } from "react";
import Link from "next/link";
// Ensure this path matches your exact store file name
import { NotificationContext } from "@/store/notification-context"; 

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const notificationCtx = useContext(NotificationContext);

  async function submitHandler(e: React.FormEvent) {
    e.preventDefault();

    // 1. Show the user that we are currently communicating with the database
    notificationCtx.showNotification({
      title: "Signing Up...",
      message: "Creating your account, please wait.",
      status: "pending",
    });

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      // 2. CHECK FOR ERRORS: If the response is not 200/201 (like your 422 error)
      if (!response.ok) {
        // We throw an error with the message sent by the API ("User exists already!")
        throw new Error(data.message || "Something went wrong!");
      }

      // 3. SUCCESS: If we reach this line, the account was created
      notificationCtx.showNotification({
        title: "Success!",
        message: "Successfully created your account!",
        status: "success",
      });

      // Clear the inputs
      setEmail("");
      setPassword("");

    } catch (error: any) {
      // 4. DISPLAY ERROR: This catches the "throw new Error" from above 
      // and displays your specific "Account already exists" message.
      notificationCtx.showNotification({
        title: "Registration Failed",
        message: error.message, 
        status: "error",
      });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-2xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-tight text-slate-950">
            Join NEXT<span className="text-blue-700">STORE</span>
          </h2>
          <p className="mt-2 text-sm text-slate-600">Create an account to start shopping.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={submitHandler}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                placeholder="name@example.com"
                className="w-full rounded-md border-2 border-gray-200 p-3 text-slate-950 focus:border-blue-600 outline-none transition-all"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                placeholder="At least 7 characters"
                className="w-full rounded-md border-2 border-gray-200 p-3 text-slate-950 focus:border-blue-600 outline-none transition-all"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full rounded-md bg-slate-950 py-4 font-bold text-white hover:bg-slate-800 transition-all active:scale-[0.98] shadow-lg"
          >
            Create Account
          </button>
        </form>

        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-700 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}