"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiClock, FiTarget, FiUsers, FiZap, FiShare2 } from "react-icons/fi";
import Link from "next/link";

export default function CampaignDetailClient({ id }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contributing, setContributing] = useState(false);
  const [credits, setCredits] = useState("");

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${id}`);
        const data = await res.json();
        if (data.success) setCampaign(data.campaign);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  const handleContribute = async (e) => {
    e.preventDefault();
    if (!user) return router.push("/login");
    if (user.role !== "supporter") return toast.error("Only supporters can contribute!");
    if (!credits || Number(credits) <= 0) return toast.error("Enter a valid amount");
    if (Number(credits) > user.credits) return toast.error("Insufficient credits!");

    setContributing(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contributions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ campaignId: id, credits: Number(credits) }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      toast.success("Contribution submitted! Waiting for creator approval.");
      setCredits("");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setContributing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-center">
        <div>
          <p className="text-text font-semibold text-xl">Campaign not found</p>
          <Link href="/explore" className="text-primary text-sm mt-2 hover:underline">Back to Explore</Link>
        </div>
      </div>
    );
  }

  const progress = Math.min((campaign.raisedCredits / campaign.goalCredits) * 100, 100);
  const daysLeft = Math.max(0, Math.ceil((new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      <div className="relative h-72 md:h-96 w-full overflow-hidden">
        <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="text-xs font-medium bg-primary/80 text-white px-3 py-1 rounded-full">
            {campaign.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-3 max-w-3xl">
            {campaign.title}
          </h1>
          <p className="text-slate-300 text-sm mt-2">by {campaign.creatorName}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left - Description */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-surface border border-white/5 rounded-2xl p-6">
            <h2 className="text-text font-bold text-xl mb-4">About this Campaign</h2>
            <p className="text-muted leading-relaxed whitespace-pre-line">{campaign.description}</p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: <FiZap className="text-primary" />, label: "Raised", value: `${campaign.raisedCredits} credits` },
              { icon: <FiTarget className="text-secondary" />, label: "Goal", value: `${campaign.goalCredits} credits` },
              { icon: <FiClock className="text-yellow-400" />, label: "Days Left", value: daysLeft },
            ].map((stat) => (
              <div key={stat.label} className="bg-surface border border-white/5 rounded-2xl p-4 text-center">
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <p className="text-text font-bold text-lg">{stat.value}</p>
                <p className="text-muted text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Contribute */}
        <div className="flex flex-col gap-4">
          {/* Progress Card */}
          <div className="bg-surface border border-white/5 rounded-2xl p-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-primary font-bold">{Math.round(progress)}% funded</span>
              <span className="text-muted">{campaign.raisedCredits} / {campaign.goalCredits}</span>
            </div>
            <div className="w-full h-2 bg-background rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Contribute Form */}
            {user?.role === "supporter" ? (
              <form onSubmit={handleContribute} className="flex flex-col gap-3">
                <p className="text-muted text-xs">Your balance: <span className="text-primary font-bold">{user.credits} credits</span></p>
                <div className="flex items-center gap-3 bg-background border border-white/10 focus-within:border-primary rounded-xl px-4 py-3 transition-all">
                  <FiZap className="text-muted shrink-0" />
                  <input
                    type="number"
                    placeholder="Enter credits to contribute"
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                    min={1}
                    max={user.credits}
                    required
                    className="bg-transparent outline-none text-text w-full text-sm placeholder:text-muted/50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={contributing}
                  className="w-full bg-primary text-white font-semibold rounded-full py-3 hover:opacity-90 transition disabled:opacity-50"
                >
                  {contributing ? "Contributing..." : "Contribute Credits"}
                </button>
              </form>
            ) : !user ? (
              <Link
                href="/login"
                className="block w-full text-center bg-primary text-white font-semibold rounded-full py-3 hover:opacity-90 transition"
              >
                Login to Contribute
              </Link>
            ) : (
              <p className="text-muted text-sm text-center">Only supporters can contribute to campaigns.</p>
            )}
          </div>

          {/* Share */}
          <button
            onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}
            className="flex items-center justify-center gap-2 w-full border border-white/10 hover:border-primary/40 text-muted hover:text-primary text-sm font-medium py-3 rounded-full transition"
          >
            <FiShare2 />
            Share Campaign
          </button>
        </div>
      </div>
    </div>
  );
}