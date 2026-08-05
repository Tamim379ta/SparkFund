"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiSearch, FiFilter, FiClock } from "react-icons/fi";
import { useSearchParams } from "next/navigation";

const categories = ["All", "Technology", "Health", "Art & Music", "Community", "Education", "Environment"];

export default function ExploreClient() {
  const searchParams = useSearchParams();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(() => searchParams.get("category") || "All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 9 });
      if (search) params.append("search", search);
      if (category !== "All") params.append("category", category);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns?${params}`);
      const data = await res.json();
      if (data.success) {
        setCampaigns(data.campaigns);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  useEffect(() => {
    fetchCampaigns();
  }, [search, category, page]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
            Explore <span className="text-primary">Campaigns</span>
          </h1>
          <p className="text-muted text-lg max-w-xl mx-auto mb-8">
            Discover innovative projects and meaningful causes worth backing.
          </p>

          {/* Search */}
          <div className="flex items-center gap-3 bg-background border border-white/10 hover:border-primary/50 focus-within:border-primary rounded-full px-5 py-3 max-w-lg mx-auto transition-all">
            <FiSearch className="text-muted shrink-0" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-text w-full text-sm placeholder:text-muted/50"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Category Filter */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          <FiFilter className="text-muted" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`text-sm px-4 py-1.5 rounded-full border transition-all duration-200 ${category === cat
                  ? "bg-primary text-white border-primary"
                  : "text-muted border-white/10 hover:border-primary/40 hover:text-text"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Campaigns Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-text font-semibold text-lg">No campaigns found</p>
            <p className="text-muted text-sm mt-1">Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {campaigns.map((campaign) => {
              const progress = Math.min((campaign.raisedCredits / campaign.goalCredits) * 100, 100);
              const daysLeft = Math.max(0, Math.ceil((new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24)));

              return (
                <Link
                  key={campaign._id}
                  href={`/campaign/${campaign._id}`}
                  className="bg-surface border border-white/5 hover:border-primary/30 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col group"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute top-3 left-3 text-xs font-medium bg-black/50 text-white px-3 py-1 rounded-full backdrop-blur-sm">
                      {campaign.category}
                    </span>
                    <span className="absolute top-3 right-3 flex items-center gap-1 text-xs text-white bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                      <FiClock className="text-primary" />
                      {daysLeft}d left
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div>
                      <h3 className="text-text font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                        {campaign.title}
                      </h3>
                      <p className="text-muted text-xs mt-1 line-clamp-2">{campaign.description}</p>
                    </div>

                    {/* Progress */}
                    <div className="mt-auto">
                      <div className="w-full h-1.5 bg-background rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-primary font-semibold">{campaign.raisedCredits} credits raised</span>
                        <span className="text-muted">of {campaign.goalCredits}</span>
                      </div>
                    </div>

                    {/* Creator */}
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-primary font-bold text-xs">
                        {campaign.creatorName?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-muted text-xs">by {campaign.creatorName}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
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
                className={`w-9 h-9 rounded-full text-sm font-medium transition ${p === page
                    ? "bg-primary text-white"
                    : "border border-white/10 text-muted hover:border-primary/40 hover:text-primary"
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
      </div>
    </div>
  );
}