"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@heroui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await authClient.signIn.email({
      email: form.email,
      password: form.password,
    
    });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Login failed");
      return;
    }
    toast.success("Welcome back!");
    router.push("/");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left - Image */}
      <div
        className="hidden md:block relative bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80)",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-end p-12">
          <Link href="/" className="flex items-center gap-1 mb-auto pt-8">
            <span className="text-2xl font-bold text-primary">Spark</span>
            <span className="text-2xl font-bold text-white">Fund</span>
          </Link>
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Welcome <span className="text-primary">Back</span>
            </h2>
            <p className="text-slate-300 text-lg max-w-sm">
              Sign in to manage your campaigns, track contributions, and grow your ideas.
            </p>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-1 mb-8 md:hidden">
            <span className="text-2xl font-bold text-primary">Spark</span>
            <span className="text-2xl font-bold text-text">Fund</span>
          </Link>

          <h1 className="text-3xl font-bold text-text mb-2">Sign In</h1>
          <p className="text-muted mb-8">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-muted text-sm">Email</label>
              <div className="flex items-center gap-3 bg-surface border border-white/10 hover:border-primary/50 focus-within:border-primary rounded-xl px-4 py-3 transition-all">
                <FiMail className="text-muted shrink-0" />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="bg-transparent outline-none text-text w-full text-sm placeholder:text-muted/50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-muted text-sm">Password</label>
              <div className="flex items-center gap-3 bg-surface border border-white/10 hover:border-primary/50 focus-within:border-primary rounded-xl px-4 py-3 transition-all">
                <FiLock className="text-muted shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="bg-transparent outline-none text-text w-full text-sm placeholder:text-muted/50"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff className="text-muted" /> : <FiEye className="text-muted" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={loading}
              className="bg-primary text-white font-semibold rounded-full hover:opacity-90 transition"
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}