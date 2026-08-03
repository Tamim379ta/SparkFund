"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { FiTarget, FiPlusCircle, FiClock, FiCheckCircle, FiXCircle, FiTrendingUp } from "react-icons/fi";

const statusConfig = {
  pending: { label: "Pending", icon: <FiClock className="text-yellow-400" />, color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  active: { label: "Active", icon: <FiCheckCircle className="text-emerald-400" />, color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  rejected: { label: "Rejected", icon: <FiXCircle className="text-red-400" />, color: "text-red-400 bg-red-400/10 border-red-400/20" },
  completed: { label: "Completed", icon: <FiTrendingUp className="text-secondary" />, color: "text-secondary bg-secondary/10 border-secondary/20" },
};

export default function MyCampaignsPage() {
  const { data: session } = authClient.useSession();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/creator/my-campaigns`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setCampaigns(data.campaigns);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">My Campaigns</h1>
          <p className="text-muted text-sm mt-1">{campaigns.length} campaign{campaigns.length !== 1 ? "s" : ""} total</p>
        </div>
        <Link
          href="/dashboard/creator/create"
          className="flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition"
        >
          <FiPlusCircle />
          New Campaign
        </Link>
      </div>

      {/* Empty State */}
      {campaigns.length === 0 ? (
        <div className="bg-surface border border-white/5 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <FiTarget className="text-muted text-5xl mb-4" />
          <p className="text-text font-semibold text-lg">No campaigns yet</p>
          <p className="text-muted text-sm mt-1">Create your first campaign and start raising funds.</p>
          <Link
            href="/dashboard/creator/create"
            className="mt-5 text-primary text-sm border border-primary/40 px-6 py-2.5 rounded-full hover:bg-primary hover:text-white transition-all duration-300"
          >
            Create Campaign
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {campaigns.map((campaign) => {
            const status = statusConfig[campaign.status];
            const progress = Math.min((campaign.raisedCredits / campaign.goalCredits) * 100, 100);
            const daysLeft = Math.max(0, Math.ceil((new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24)));

            return (
              <div key={campaign._id} className="bg-surface border border-white/5 hover:border-primary/20 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col">
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {/* Status Badge */}
                  <span className={`absolute top-3 right-3 flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${status.color}`}>
                    {status.icon}
                    {status.label}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div>
                    <span className="text-primary text-xs font-medium">{campaign.category}</span>
                    <h3 className="text-text font-semibold mt-1 line-clamp-1">{campaign.title}</h3>
                    <p className="text-muted text-xs mt-1 line-clamp-2">{campaign.description}</p>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-primary font-semibold">{campaign.raisedCredits} credits raised</span>
                      <span className="text-muted">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs mt-1.5">
                      <span className="text-muted">Goal: {campaign.goalCredits} credits</span>
                      <span className="text-muted">{daysLeft} days left</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto pt-2">
                    <Link
                      href={`/campaign/${campaign._id}`}
                      className="flex-1 text-center text-xs font-medium text-text border border-white/10 hover:border-primary/40 px-3 py-2 rounded-xl transition"
                    >
                      View
                    </Link>
                    {campaign.status === "active" && (
                      <Link
                        href={`/dashboard/creator/campaigns/${campaign._id}`}
                        className="flex-1 text-center text-xs font-medium text-primary border border-primary/30 hover:bg-primary/10 px-3 py-2 rounded-xl transition"
                      >
                        Manage
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}