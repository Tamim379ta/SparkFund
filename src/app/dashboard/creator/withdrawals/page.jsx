"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiDollarSign, FiCheckCircle, FiClock } from "react-icons/fi";

const paymentSystems = ["Stripe", "Bkash", "Rocket", "Nagad", "Bank Transfer"];

export default function WithdrawalsPage() {
  const [totalRaised, setTotalRaised] = useState(0);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    creditsToWithdraw: "",
    paymentSystem: "Bkash",
    accountNumber: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [raisedRes, withdrawalsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/withdrawals/total-raised`, { credentials: "include" }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/withdrawals/my-withdrawals`, { credentials: "include" }),
      ]);
      const raisedData = await raisedRes.json();
      const withdrawalsData = await withdrawalsRes.json();
      if (raisedData.success) setTotalRaised(raisedData.totalRaised);
      if (withdrawalsData.success) setWithdrawals(withdrawalsData.withdrawals);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const withdrawalAmount = form.creditsToWithdraw ? (Number(form.creditsToWithdraw) / 20).toFixed(2) : "0.00";
  const hasEnoughCredits = totalRaised >= 200;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(form.creditsToWithdraw) < 200) return toast.error("Minimum withdrawal is 200 credits");
    if (Number(form.creditsToWithdraw) > totalRaised) return toast.error("Insufficient raised credits");

    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/withdrawals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          creditsToWithdraw: Number(form.creditsToWithdraw),
          paymentSystem: form.paymentSystem,
          accountNumber: form.accountNumber,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      toast.success("Withdrawal request submitted!");
      setForm({ creditsToWithdraw: "", paymentSystem: "Bkash", accountNumber: "" });
      fetchData();
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
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
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-text">Withdrawals</h1>
        <p className="text-muted text-sm mt-1">Request a withdrawal of your raised credits.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-white/5 rounded-2xl p-5">
          <p className="text-muted text-sm">Total Raised</p>
          <p className="text-primary font-bold text-2xl mt-1">{totalRaised} <span className="text-sm font-normal text-muted">credits</span></p>
        </div>
        <div className="bg-surface border border-white/5 rounded-2xl p-5">
          <p className="text-muted text-sm">Withdrawal Value</p>
          <p className="text-emerald-400 font-bold text-2xl mt-1">${(totalRaised / 20).toFixed(2)}</p>
        </div>
        <div className="bg-surface border border-white/5 rounded-2xl p-5">
          <p className="text-muted text-sm">Min. Withdrawal</p>
          <p className="text-text font-bold text-2xl mt-1">200 <span className="text-sm font-normal text-muted">credits</span></p>
        </div>
      </div>

      {/* Withdrawal Form */}
      <div className="bg-surface border border-white/5 rounded-2xl p-6">
        <h2 className="text-text font-bold text-lg mb-5">Request Withdrawal</h2>

        {!hasEnoughCredits ? (
          <div className="text-center py-6">
            <FiDollarSign className="text-muted text-4xl mx-auto mb-3" />
            <p className="text-text font-semibold">Insufficient Credits</p>
            <p className="text-muted text-sm mt-1">You need at least 200 raised credits to withdraw. You currently have {totalRaised}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Credits to Withdraw */}
            <div className="flex flex-col gap-1">
              <label className="text-muted text-sm">Credits to Withdraw</label>
              <div className="flex items-center gap-3 bg-background border border-white/10 hover:border-primary/50 focus-within:border-primary rounded-xl px-4 py-3 transition-all">
                <input
                  type="number"
                  placeholder={`Max: ${totalRaised} credits`}
                  value={form.creditsToWithdraw}
                  onChange={(e) => setForm({ ...form, creditsToWithdraw: e.target.value })}
                  min={200}
                  max={totalRaised}
                  required
                  className="bg-transparent outline-none text-text w-full text-sm placeholder:text-muted/50"
                />
              </div>
            </div>

            {/* Withdrawal Amount - readonly */}
            <div className="flex flex-col gap-1">
              <label className="text-muted text-sm">Withdrawal Amount (USD)</label>
              <div className="flex items-center gap-3 bg-background border border-white/10 rounded-xl px-4 py-3">
                <FiDollarSign className="text-emerald-400 shrink-0" />
                <input
                  type="text"
                  value={`$${withdrawalAmount}`}
                  readOnly
                  className="bg-transparent outline-none text-emerald-400 font-bold w-full text-sm"
                />
              </div>
            </div>

            {/* Payment System */}
            <div className="flex flex-col gap-1">
              <label className="text-muted text-sm">Payment System</label>
              <select
                value={form.paymentSystem}
                onChange={(e) => setForm({ ...form, paymentSystem: e.target.value })}
                required
                className="bg-background border border-white/10 hover:border-primary/50 focus:border-primary rounded-xl px-4 py-3 text-text text-sm outline-none transition-all"
              >
                {paymentSystems.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Account Number */}
            <div className="flex flex-col gap-1">
              <label className="text-muted text-sm">Account Number</label>
              <div className="flex items-center gap-3 bg-background border border-white/10 hover:border-primary/50 focus-within:border-primary rounded-xl px-4 py-3 transition-all">
                <input
                  type="text"
                  placeholder="Enter your account number"
                  value={form.accountNumber}
                  onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                  required
                  className="bg-transparent outline-none text-text w-full text-sm placeholder:text-muted/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-primary text-white font-semibold rounded-full py-4 mt-2 hover:opacity-90 transition disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Request Withdrawal"}
            </button>
          </form>
        )}
      </div>

      {/* Withdrawal History */}
      <div>
        <h2 className="text-text font-bold text-lg mb-4">Withdrawal History</h2>
        {withdrawals.length === 0 ? (
          <div className="bg-surface border border-white/5 rounded-2xl p-8 text-center">
            <p className="text-muted text-sm">No withdrawal requests yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {withdrawals.map((w) => (
              <div key={w._id} className="bg-surface border border-white/5 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-text font-semibold">{w.creditsToWithdraw} credits → ${w.withdrawalAmount.toFixed(2)}</p>
                  <p className="text-muted text-xs mt-0.5">{w.paymentSystem} • {w.accountNumber}</p>
                  <p className="text-muted text-xs mt-0.5">{new Date(w.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
                </div>
                <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${
                  w.status === "approved"
                    ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                    : "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
                }`}>
                  {w.status === "approved" ? <FiCheckCircle /> : <FiClock />}
                  {w.status === "approved" ? "Approved" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}