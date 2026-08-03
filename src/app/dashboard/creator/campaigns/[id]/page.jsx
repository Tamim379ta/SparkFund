"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiCheckCircle, FiXCircle, FiClock, FiUsers } from "react-icons/fi";
import Link from "next/link";

const statusConfig = {
  pending: { label: "Pending", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  approved: { label: "Approved", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  rejected: { label: "Rejected", color: "text-red-400 bg-red-400/10 border-red-400/20" },
};

export default function CampaignContributionsPage() {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/contributions/campaign-contributions`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (data.success) setContributions(data.contributions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContributions();
  }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id + status);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contributions/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status }),
        }
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setContributions((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status } : c))
      );
      toast.success(`Contribution ${status}!`);
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === "all" ? contributions : contributions.filter((c) => c.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text">Campaign Contributions</h1>
          <p className="text-muted text-sm mt-1">{contributions.length} total contributions</p>
        </div>
        <Link
          href="/dashboard/creator/campaigns"
          className="text-muted text-sm hover:text-primary transition"
        >
          ← Back to Campaigns
        </Link>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "approved", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-sm px-4 py-1.5 rounded-full border capitalize transition-all ${
              filter === f
                ? "bg-primary text-white border-primary"
                : "text-muted border-white/10 hover:border-primary/40 hover:text-text"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-surface border border-white/5 rounded-2xl p-12 text-center">
          <FiUsers className="text-muted text-5xl mx-auto mb-4" />
          <p className="text-text font-semibold">No contributions yet</p>
          <p className="text-muted text-sm mt-1">Contributions will appear here once supporters back your campaigns.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((c) => {
            const status = statusConfig[c.status];
            return (
              <div key={c._id} className="bg-surface border border-white/5 hover:border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-primary font-bold">
                    {c.supporterName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-text font-semibold text-sm">{c.supporterName}</p>
                    <p className="text-muted text-xs">{c.campaignTitle}</p>
                    <p className="text-muted text-xs mt-0.5">
                      {new Date(c.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <p className="text-primary font-bold">{c.credits} credits</p>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${status.color}`}>
                    {status.label}
                  </span>
                  {c.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(c._id, "approved")}
                        disabled={updating === c._id + "approved"}
                        className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 border border-emerald-400/30 hover:bg-emerald-400/10 px-3 py-1.5 rounded-xl transition disabled:opacity-50"
                      >
                        <FiCheckCircle />
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(c._id, "rejected")}
                        disabled={updating === c._id + "rejected"}
                        className="flex items-center gap-1.5 text-xs font-semibold text-red-400 border border-red-400/30 hover:bg-red-400/10 px-3 py-1.5 rounded-xl transition disabled:opacity-50"
                      >
                        <FiXCircle />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}