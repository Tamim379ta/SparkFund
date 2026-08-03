"use client";

import { useState, useEffect } from "react";
import { FiDollarSign, FiCheckCircle } from "react-icons/fi";

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/history`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setPayments(data.payments);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
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
      <div>
        <h1 className="text-2xl font-bold text-text">Payment History</h1>
        <p className="text-muted text-sm mt-1">{payments.length} total payments</p>
      </div>

      {payments.length === 0 ? (
        <div className="bg-surface border border-white/5 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <FiDollarSign className="text-muted text-5xl mb-4" />
          <p className="text-text font-semibold">No payments yet</p>
          <p className="text-muted text-sm mt-1">Your credit purchase history will appear here.</p>
        </div>
      ) : (
        <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 text-muted text-xs font-medium uppercase tracking-wider">
            <div className="col-span-4">Date</div>
            <div className="col-span-3">Credits</div>
            <div className="col-span-3">Amount</div>
            <div className="col-span-2">Status</div>
          </div>
          <div className="divide-y divide-white/5">
            {payments.map((payment) => (
              <div key={payment._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center">
                <div className="col-span-4">
                  <p className="text-text text-sm">
                    {new Date(payment.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                  <p className="text-muted text-xs mt-0.5">
                    {new Date(payment.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div className="col-span-3">
                  <span className="text-primary font-bold">+{payment.credits}</span>
                  <span className="text-muted text-xs ml-1">credits</span>
                </div>
                <div className="col-span-3">
                  <span className="text-text font-semibold">${payment.amount.toFixed(2)}</span>
                </div>
                <div className="col-span-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <FiCheckCircle />
                    Success
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}