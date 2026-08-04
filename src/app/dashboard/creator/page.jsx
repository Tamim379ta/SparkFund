"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { FiDollarSign, FiTarget, FiTrendingUp, FiZap, FiPlusCircle, FiUsers } from "react-icons/fi";
import Link from "next/link";

export default function CreatorDashboard() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/creator/stats`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setStats(data.stats);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      icon: <FiTarget className="text-2xl text-primary" />,
      label: "Total Campaigns",
      value: stats?.totalCampaigns ?? 0,
      bg: "from-primary/10 to-primary/5",
      border: "border-primary/20",
    },
    {
      icon: <FiZap className="text-2xl text-secondary" />,
      label: "Active Campaigns",
      value: stats?.activeCampaigns ?? 0,
      bg: "from-secondary/10 to-secondary/5",
      border: "border-secondary/20",
    },
    {
      icon: <FiUsers className="text-2xl text-emerald-400" />,
      label: "Total Supporters",
      value: stats?.totalSupporters ?? 0,
      bg: "from-emerald-500/10 to-emerald-500/5",
      border: "border-emerald-500/20",
    },
    {
      icon: <FiTrendingUp className="text-2xl text-yellow-400" />,
      label: "Credits Raised",
      value: stats?.totalRaised ?? 0,
      suffix: " credits",
      bg: "from-yellow-500/10 to-yellow-500/5",
      border: "border-yellow-500/20",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-text">
          Welcome back, <span className="text-primary">{user?.name?.split(" ")[0]}</span>! 🚀
        </h1>
        <p className="text-muted mt-1">Manage your campaigns and track your progress.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.bg} border ${stat.border} rounded-2xl p-6 flex flex-col gap-3`}>
            <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center">
              {stat.icon}
            </div>
            <div>
              <p className="text-muted text-sm">{stat.label}</p>
              <p className="text-text text-2xl font-bold mt-1">
                {stat.value}
                {stat.suffix && <span className="text-sm text-muted font-normal">{stat.suffix}</span>}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-text font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/dashboard/creator/create" className="flex items-center gap-4 p-5 bg-surface border border-white/5 hover:border-primary/30 rounded-2xl transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition">
              <FiPlusCircle className="text-primary text-xl" />
            </div>
            <div>
              <p className="text-text font-semibold">Create Campaign</p>
              <p className="text-muted text-sm">Launch a new campaign and start raising funds</p>
            </div>
          </Link>
          <Link href="/dashboard/creator/withdrawals" className="flex items-center gap-4 p-5 bg-surface border border-white/5 hover:border-primary/30 rounded-2xl transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition">
              <FiDollarSign className="text-secondary text-xl" />
            </div>
            <div>
              <p className="text-text font-semibold">Request Withdrawal</p>
              <p className="text-muted text-sm">Withdraw your earned credits as cash</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}