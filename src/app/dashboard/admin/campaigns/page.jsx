"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiClock, FiCheckCircle, FiXCircle, FiTrendingUp } from "react-icons/fi";

const statusConfig = {
    pending: { label: "Pending", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
    active: { label: "Active", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
    rejected: { label: "Rejected", color: "text-red-400 bg-red-400/10 border-red-400/20" },
    completed: { label: "Completed", color: "text-secondary bg-secondary/10 border-secondary/20" },
};

export default function AdminCampaignsPage() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [updating, setUpdating] = useState(null);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/admin/all`, {
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

    const updateStatus = async (id, status) => {
        setUpdating(id + status);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ status }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
            setCampaigns((prev) =>
                prev.map((c) => (c._id === id ? { ...c, status } : c))
            );
            toast.success(`Campaign ${status}!`);
        } catch (err) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setUpdating(null);
        }
    };

    const filtered = filter === "all" ? campaigns : campaigns.filter((c) => c.status === filter);

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
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-text">Manage Campaigns</h1>
                    <p className="text-muted text-sm mt-1">{campaigns.length} total campaigns</p>
                </div>

                {/* Filter */}
                <div className="flex gap-2 flex-wrap">
                    {["all", "pending", "active", "rejected", "completed"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`text-sm px-4 py-1.5 rounded-full border capitalize transition-all ${filter === f
                                    ? "bg-primary text-white border-primary"
                                    : "text-muted border-white/10 hover:border-primary/40 hover:text-text"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            {filtered.length === 0 ? (
                <div className="bg-surface border border-white/5 rounded-2xl p-12 text-center">
                    <p className="text-text font-semibold">No campaigns found</p>
                    <p className="text-muted text-sm mt-1">Try a different filter.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filtered.map((campaign) => {
                        const status = statusConfig[campaign.status];
                        const progress = Math.min((campaign.raisedCredits / campaign.goalCredits) * 100, 100);
                        const daysLeft = Math.max(0, Math.ceil((new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24)));

                        return (
                            <div key={campaign._id} className="bg-surface border border-white/5 hover:border-white/10 rounded-2xl p-5 flex flex-col md:flex-row gap-4">
                                {/* Image */}
                                <img
                                    src={campaign.image}
                                    alt={campaign.title}
                                    className="w-full md:w-32 h-24 object-cover rounded-xl shrink-0"
                                />

                                {/* Info */}
                                <div className="flex-1 flex flex-col gap-2">
                                    <div className="flex items-start justify-between gap-2 flex-wrap">
                                        <div>
                                            <span className="text-primary text-xs font-medium">{campaign.category}</span>
                                            <h3 className="text-text font-semibold">{campaign.title}</h3>
                                            <p className="text-muted text-xs">by {campaign.creatorName}</p>
                                        </div>
                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${status.color}`}>
                                            {status.label}
                                        </span>
                                    </div>

                                    <p className="text-muted text-xs line-clamp-2">{campaign.description}</p>

                                    {/* Progress */}
                                    <div className="flex items-center gap-3 text-xs text-muted">
                                        <span className="text-primary font-semibold">{campaign.raisedCredits} / {campaign.goalCredits} credits</span>
                                        <span>•</span>
                                        <span>{Math.round(progress)}% funded</span>
                                        <span>•</span>
                                        <span>{daysLeft} days left</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-row gap-2 shrink-0 items-center">
                                    {campaign.status === "pending" && (
                                        <>
                                            <button
                                                onClick={() => updateStatus(campaign._id, "active")}
                                                disabled={updating === campaign._id + "active"}
                                                className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 border border-emerald-400/30 hover:bg-emerald-400/10 px-4 py-2 rounded-xl transition disabled:opacity-50"
                                            >
                                                <FiCheckCircle />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => updateStatus(campaign._id, "rejected")}
                                                disabled={updating === campaign._id + "rejected"}
                                                className="flex items-center gap-1.5 text-xs font-semibold text-red-400 border border-red-400/30 hover:bg-red-400/10 px-4 py-2 rounded-xl transition disabled:opacity-50"
                                            >
                                                <FiXCircle />
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {campaign.status === "active" && (
                                        <button
                                            onClick={() => updateStatus(campaign._id, "completed")}
                                            disabled={updating === campaign._id + "completed"}
                                            className="flex items-center gap-1.5 text-xs font-semibold text-secondary border border-secondary/30 hover:bg-secondary/10 px-4 py-2 rounded-xl transition disabled:opacity-50"
                                        >
                                            <FiTrendingUp />
                                            Complete
                                        </button>
                                    )}
                                    {campaign.status === "rejected" && (
                                        <button
                                            onClick={() => updateStatus(campaign._id, "active")}
                                            disabled={updating === campaign._id + "active"}
                                            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 border border-emerald-400/30 hover:bg-emerald-400/10 px-4 py-2 rounded-xl transition disabled:opacity-50"
                                        >
                                            <FiCheckCircle />
                                            Re-approve
                                        </button>
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