"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@heroui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from "react-icons/fi";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "supporter",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await authClient.signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      credits: form.role === "supporter" ? 50 : 20,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Registration failed");
      return;
    }
    toast.success("Account created! Welcome to SparkFund!");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left - Image */}
      <div
        className="hidden md:block relative bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80)",
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
              Join <span className="text-primary">SparkFund</span>
            </h2>
            <p className="text-slate-300 text-lg max-w-sm">
              Create an account to start funding ideas or launch your own campaign today.
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

          <h1 className="text-3xl font-bold text-text mb-2">Create Account</h1>
          <p className="text-muted mb-8">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign In
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className="text-muted text-sm">Full Name</label>
              <div className="flex items-center gap-3 bg-surface border border-white/10 hover:border-primary/50 focus-within:border-primary rounded-xl px-4 py-3 transition-all">
                <FiUser className="text-muted shrink-0" />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="bg-transparent outline-none text-text w-full text-sm placeholder:text-muted/50"
                />
              </div>
            </div>

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

            {/* Role */}
            <div className="flex flex-col gap-1">
              <label className="text-muted text-sm">Join As</label>
              <div className="grid grid-cols-2 gap-3">
                {["supporter", "creator"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm({ ...form, role: r })}
                    className={`py-3 rounded-xl border text-sm font-semibold capitalize transition-all duration-300 ${
                      form.role === r
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-white/10 bg-surface text-muted hover:border-primary/40"
                    }`}
                  >
                    {r === "supporter" ? "🙌 Supporter" : "🚀 Creator"}
                  </button>
                ))}
              </div>
              <p className="text-muted/60 text-xs mt-1">
                {form.role === "supporter"
                  ? "You'll get 50 credits to start backing campaigns."
                  : "You'll get 20 credits and can launch campaigns."}
              </p>
            </div>

            <Button
              type="submit"
              isLoading={loading}
              className="bg-primary text-white font-semibold rounded-full  hover:opacity-90 transition"
            >
              Create Account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}