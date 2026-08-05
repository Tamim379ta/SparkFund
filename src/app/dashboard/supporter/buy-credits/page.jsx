"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { FiZap, FiCheckCircle } from "react-icons/fi";

const packages = [
  { credits: 100, price: 10, label: "Starter", description: "Perfect for trying out the platform", color: "from-primary/10 to-primary/5", border: "border-primary/20", badge: "" },
  { credits: 300, price: 25, label: "Basic", description: "Great for regular supporters", color: "from-secondary/10 to-secondary/5", border: "border-secondary/20", badge: "Popular" },
  { credits: 800, price: 60, label: "Pro", description: "For serious campaign backers", color: "from-emerald-500/10 to-emerald-500/5", border: "border-emerald-500/20", badge: "" },
  { credits: 1500, price: 110, label: "Elite", description: "Maximum value for power users", color: "from-yellow-500/10 to-yellow-500/5", border: "border-yellow-500/20", badge: "Best Value" },
];

function BuyCreditsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(null);
  const verifyCalledRef = useRef(false);

  useEffect(() => {
    const success = searchParams.get("success");
    const sessionId = searchParams.get("session_id");

    if (success === "true" && sessionId && !verifyCalledRef.current) {
      verifyCalledRef.current = true;
      verifyPayment(sessionId);
    }

    if (searchParams.get("canceled") === "true") {
      toast.error("Payment canceled.");
      router.replace("/dashboard/supporter/buy-credits");
    }
  }, []);

  const verifyPayment = async (sessionId) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (data.success && !data.alreadyProcessed) {
        toast.success("Credits added to your account!");
      }
      router.replace("/dashboard/supporter/buy-credits");
    } catch (err) {
      console.error(err);
    }
  };

  const handleBuy = async (index) => {
    setLoading(index);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ packageIndex: index }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      window.location.href = data.url;
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-text">Buy Credits</h1>
        <p className="text-muted text-sm mt-1">
          Current balance: <span className="text-primary font-bold">{session?.user?.credits ?? 0} credits</span>
        </p>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center gap-3">
        <FiZap className="text-primary text-xl shrink-0" />
        <p className="text-muted text-sm">
          Credits are used to back campaigns. <span className="text-text font-medium">10 credits = $1</span>. Credits never expire.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {packages.map((pkg, index) => (
          <div
            key={pkg.label}
            className={`relative bg-gradient-to-br ${pkg.color} border ${pkg.border} rounded-2xl p-6 flex flex-col gap-4 hover:scale-105 transition-all duration-300`}
          >
            {pkg.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full">
                {pkg.badge}
              </span>
            )}
            <div>
              <p className="text-text font-bold text-lg">{pkg.label}</p>
              <p className="text-muted text-xs mt-1">{pkg.description}</p>
            </div>
            <div>
              <p className="text-3xl font-black text-primary">{pkg.credits}</p>
              <p className="text-muted text-sm">credits</p>
            </div>
            <div className="flex flex-col gap-2 text-xs text-muted">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-400 shrink-0" />
                <span>Never expire</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-400 shrink-0" />
                <span>Instant delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-400 shrink-0" />
                <span>Secure payment</span>
              </div>
            </div>
            <button
              onClick={() => handleBuy(index)}
              disabled={loading === index}
              className="mt-auto w-full bg-primary text-white font-semibold py-3 rounded-full hover:opacity-90 transition disabled:opacity-50 text-sm"
            >
              {loading === index ? "Redirecting..." : `Pay $${pkg.price}`}
            </button>
          </div>
        ))}
      </div>

      <p className="text-muted text-sm text-center">
        View your{" "}
        <a href="/dashboard/supporter/payment-history" className="text-primary hover:underline">
          payment history
        </a>
      </p>
    </div>
  );
}

export default function BuyCreditsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <BuyCreditsContent />
    </Suspense>
  );
}