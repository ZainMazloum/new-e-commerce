"use client";
import { useState, useContext } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { NotificationContext } from "@/store/notification-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const notificationCtx = useContext(NotificationContext);

  async function submitHandler(e: React.FormEvent) {
    e.preventDefault();

    notificationCtx.showNotification({
      title: "Logging in...",
      message: "Checking your credentials.",
      status: "pending",
    });

    // next-auth signIn function
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      notificationCtx.showNotification({
        title: "Login Error",
        message: result.error, // Shows "Invalid password" or "No user found"
        status: "error",
      });
    } else {
      notificationCtx.showNotification({
        title: "Success",
        message: "Welcome back!",
        status: "success",
      });
      // Send them to the home page after login
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-2xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-tight text-slate-950">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-slate-600">Please enter your details.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={submitHandler}>
          <div className="space-y-4">
            <input
              type="email"
              required
              placeholder="Email Address"
              className="w-full rounded-md border-2 border-gray-200 p-3 text-slate-950 focus:border-blue-600 outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              required
              placeholder="Password"
              className="w-full rounded-md border-2 border-gray-200 p-3 text-slate-950 focus:border-blue-600 outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="w-full rounded-md bg-slate-950 py-4 font-bold text-white hover:bg-slate-800 shadow-lg">
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-slate-600">
          New here? <Link href="/register" className="text-blue-700 font-bold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}