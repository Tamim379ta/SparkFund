"use client";

import { useState, useEffect } from "react";
import { FiDollarSign, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import Link from "next/link";

const statusConfig = {
  pending: { label: "Pending", icon: <FiClock className="text-yellow-400" />, color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  approved: { label: "Approved", icon: <FiCheckCircle className="text-emerald-400" />, color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  rejected: { label: "Rejected", icon: <FiXCircle className="text-red-400" />, color: "text-red-400 bg-red-400/10 border-red-400/20" },
};

export default function MyContributionsPage() {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetch_ = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/contributions/my-contributions?page=${page}&limit=10`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (data.success) {
          setContributions(data.contributions);
          setTotalPages(data.totalPages);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, [page]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text">My Contributions</h1>
        <p className="text-muted text-sm mt-1">Track all your campaign contributions.</p>
      </div>

      {contributions.length === 0 ? (
        <div className="bg-surface border border-white/5 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <FiDollarSign className="text-muted text-5xl mb-4" />
          <p className="text-text font-semibold text-lg">No contributions yet</p>
          <p className="text-muted text-sm mt-1">Start backing campaigns to see your history here.</p>
          <Link
            href="/explore"
            className="mt-5 text-primary text-sm border border-primary/40 px-6 py-2.5 rounded-full hover:bg-primary hover:text-white transition-all duration-300"
          >
            Explore Campaigns
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {contributions.map((c) => {
              const status = statusConfig[c.status];
              return (
                <div key={c._id} className="bg-surface border border-white/5 hover:border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <FiDollarSign className="text-primary" />
                    </div>
                    <div>
                      <Link href={`/campaign/${c.campaignId}`} className="text-text font-semibold hover:text-primary transition text-sm">
                        {c.campaignTitle}
                      </Link>
                      <p className="text-muted text-xs mt-0.5">
                        {new Date(c.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-primary font-bold">{c.credits} credits</p>
                    </div>
                    <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${status.color}`}>
                      {status.icon}
                      {status.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-full border border-white/10 text-muted text-sm hover:border-primary/40 hover:text-primary disabled:opacity-30 transition"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-full text-sm font-medium transition ${
                    p === page ? "bg-primary text-white" : "border border-white/10 text-muted hover:border-primary/40"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-full border border-white/10 text-muted text-sm hover:border-primary/40 hover:text-primary disabled:opacity-30 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}