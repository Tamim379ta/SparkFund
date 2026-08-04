"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiFlag, FiCheckCircle, FiXCircle } from "react-icons/fi";

const statusConfig = {
  pending: { label: "Pending", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  suspended: { label: "Suspended", color: "text-red-400 bg-red-400/10 border-red-400/20" },
  dismissed: { label: "Dismissed", color: "text-muted bg-white/5 border-white/10" },
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setReports(data.reports);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    setUpdating(id + action);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/${id}/${action}`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setReports((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: action === "suspend" ? "suspended" : "dismissed" } : r))
      );
      toast.success(`Report ${action === "suspend" ? "suspended" : "dismissed"}!`);
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === "all" ? reports : reports.filter((r) => r.status === filter);

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
          <h1 className="text-2xl font-bold text-text">Reports</h1>
          <p className="text-muted text-sm mt-1">{reports.length} total reports</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "suspended", "dismissed"].map((f) => (
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
      </div>

      {filtered.length === 0 ? (
        <div className="bg-surface border border-white/5 rounded-2xl p-12 text-center">
          <FiFlag className="text-muted text-5xl mx-auto mb-4" />
          <p className="text-text font-semibold">No reports found</p>
          <p className="text-muted text-sm mt-1">No reports match the selected filter.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((report) => {
            const status = statusConfig[report.status];
            return (
              <div key={report._id} className="bg-surface border border-white/5 hover:border-white/10 rounded-2xl p-5 flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-text font-semibold">{report.campaignTitle}</h3>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-muted text-xs">
                    Reported by <span className="text-text">{report.reporterName}</span> • {new Date(report.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                  <div className="bg-background rounded-xl px-4 py-3 mt-1">
                    <p className="text-muted text-xs font-medium mb-1">Reason:</p>
                    <p className="text-text text-sm">{report.reason}</p>
                  </div>
                </div>

                {report.status === "pending" && (
                  <div className="flex md:flex-col gap-2 shrink-0 justify-end">
                    <button
                      onClick={() => handleAction(report._id, "suspend")}
                      disabled={updating === report._id + "suspend"}
                      className="flex items-center gap-1.5 text-xs font-semibold text-red-400 border border-red-400/30 hover:bg-red-400/10 px-4 py-2 rounded-xl transition disabled:opacity-50"
                    >
                      <FiXCircle />
                      Suspend
                    </button>
                    <button
                      onClick={() => handleAction(report._id, "dismiss")}
                      disabled={updating === report._id + "dismiss"}
                      className="flex items-center gap-1.5 text-xs font-semibold text-muted border border-white/10 hover:bg-white/5 px-4 py-2 rounded-xl transition disabled:opacity-50"
                    >
                      <FiCheckCircle />
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}