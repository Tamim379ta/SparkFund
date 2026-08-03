"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiTarget, FiPlusCircle, FiClock, FiCheckCircle, FiXCircle, FiTrendingUp, FiEdit, FiTrash2, FiX } from "react-icons/fi";

const statusConfig = {
  pending: { label: "Pending", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  active: { label: "Active", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  rejected: { label: "Rejected", color: "text-red-400 bg-red-400/10 border-red-400/20" },
  completed: { label: "Completed", color: "text-secondary bg-secondary/10 border-secondary/20" },
};

export default function MyCampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", rewardInfo: "" });
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

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

  const openEdit = (campaign) => {
    setEditingCampaign(campaign);
    setEditForm({
      title: campaign.title,
      description: campaign.description,
      rewardInfo: campaign.rewardInfo || "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${editingCampaign._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setCampaigns((prev) => prev.map((c) => (c._id === editingCampaign._id ? { ...c, ...editForm } : c)));
      toast.success("Campaign updated!");
      setEditingCampaign(null);
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure? This will refund all approved supporters.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setCampaigns((prev) => prev.filter((c) => c._id !== id));
      toast.success("Campaign deleted and supporters refunded!");
    } catch (err) {
      toast.error(err.message || "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

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
                  <span className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full border ${status.color}`}>
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
                      <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
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
                    <Link
                      href={`/dashboard/creator/campaigns/${campaign._id}`}
                      className="flex-1 text-center text-xs font-medium text-primary border border-primary/30 hover:bg-primary/10 px-3 py-2 rounded-xl transition"
                    >
                      Manage
                    </Link>
                    <button
                      onClick={() => openEdit(campaign)}
                      className="flex items-center gap-1.5 text-xs font-medium text-secondary border border-secondary/30 hover:bg-secondary/10 px-3 py-2 rounded-xl transition"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(campaign._id)}
                      disabled={deleting === campaign._id}
                      className="flex items-center gap-1.5 text-xs font-medium text-red-400 border border-red-400/30 hover:bg-red-400/10 px-3 py-2 rounded-xl transition disabled:opacity-50"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-text font-bold text-xl">Edit Campaign</h2>
              <button onClick={() => setEditingCampaign(null)} className="text-muted hover:text-text transition">
                <FiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-muted text-sm">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  required
                  className="bg-background border border-white/10 hover:border-primary/50 focus:border-primary rounded-xl px-4 py-3 text-text text-sm outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-muted text-sm">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  required
                  rows={4}
                  className="bg-background border border-white/10 hover:border-primary/50 focus:border-primary rounded-xl px-4 py-3 text-text text-sm outline-none transition-all resize-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-muted text-sm">Reward Info</label>
                <textarea
                  value={editForm.rewardInfo}
                  onChange={(e) => setEditForm({ ...editForm, rewardInfo: e.target.value })}
                  rows={3}
                  placeholder="What will supporters receive for backing this campaign?"
                  className="bg-background border border-white/10 hover:border-primary/50 focus:border-primary rounded-xl px-4 py-3 text-text text-sm outline-none transition-all resize-none placeholder:text-muted/50"
                />
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setEditingCampaign(null)}
                  className="flex-1 border border-white/10 text-muted hover:text-text py-3 rounded-full text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 bg-primary text-white font-semibold py-3 rounded-full text-sm hover:opacity-90 transition disabled:opacity-50"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}