"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiCheckCircle, FiClock, FiDollarSign } from "react-icons/fi";

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/withdrawals/admin/all`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setWithdrawals(data.withdrawals);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setApproving(id);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/withdrawals/${id}/approve`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setWithdrawals((prev) => prev.map((w) => (w._id === id ? { ...w, status: "approved" } : w)));
      toast.success("Withdrawal approved!");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setApproving(null);
    }
  };

  const filtered = filter === "all" ? withdrawals : withdrawals.filter((w) => w.status === filter);

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
          <h1 className="text-2xl font-bold text-text">Withdrawal Requests</h1>
          <p className="text-muted text-sm mt-1">{withdrawals.length} total requests</p>
        </div>
        <div className="flex gap-2">
          {["all", "pending", "approved"].map((f) => (
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
          <FiDollarSign className="text-muted text-5xl mx-auto mb-4" />
          <p className="text-text font-semibold">No withdrawal requests</p>
          <p className="text-muted text-sm mt-1">No requests match the selected filter.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((w) => (
            <div key={w._id} className="bg-surface border border-white/5 hover:border-white/10 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-primary font-bold shrink-0">
                  {w.creatorName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-text font-semibold text-sm">{w.creatorName}</p>
                  <p className="text-muted text-xs">{w.creatorEmail}</p>
                  <p className="text-muted text-xs mt-0.5">{w.paymentSystem} • {w.accountNumber}</p>
                  <p className="text-muted text-xs">{new Date(w.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-primary font-bold">{w.creditsToWithdraw} credits</p>
                  <p className="text-emerald-400 font-semibold">${w.withdrawalAmount.toFixed(2)}</p>
                </div>
                <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${
                  w.status === "approved"
                    ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                    : "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
                }`}>
                  {w.status === "approved" ? <FiCheckCircle /> : <FiClock />}
                  {w.status === "approved" ? "Approved" : "Pending"}
                </span>
                {w.status === "pending" && (
                  <button
                    onClick={() => handleApprove(w._id)}
                    disabled={approving === w._id}
                    className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 border border-emerald-400/30 hover:bg-emerald-400/10 px-4 py-2 rounded-xl transition disabled:opacity-50"
                  >
                    <FiCheckCircle />
                    {approving === w._id ? "..." : "Approve"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}