"use client";

import { authClient } from "@/lib/auth-client";
import { FiDollarSign, FiTarget, FiTrendingUp, FiZap, FiPlusCircle, FiUsers } from "react-icons/fi";
import Link from "next/link";

export default function CreatorDashboard() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const stats = [
    {
      icon: <FiZap className="text-2xl text-primary" />,
      label: "Available Credits",
      value: user?.credits ?? 0,
      bg: "from-primary/10 to-primary/5",
      border: "border-primary/20",
    },
    {
      icon: <FiTarget className="text-2xl text-secondary" />,
      label: "Total Campaigns",
      value: 0,
      bg: "from-secondary/10 to-secondary/5",
      border: "border-secondary/20",
    },
    {
      icon: <FiUsers className="text-2xl text-emerald-400" />,
      label: "Total Supporters",
      value: 0,
      bg: "from-emerald-500/10 to-emerald-500/5",
      border: "border-emerald-500/20",
    },
    {
      icon: <FiTrendingUp className="text-2xl text-yellow-400" />,
      label: "Credits Raised",
      value: 0,
      suffix: " credits",
      bg: "from-yellow-500/10 to-yellow-500/5",
      border: "border-yellow-500/20",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-text">
          Welcome back, <span className="text-primary">{user?.name?.split(" ")[0]}</span>! 🚀
        </h1>
        <p className="text-muted mt-1">Manage your campaigns and track your progress.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`bg-gradient-to-br ${stat.bg} border ${stat.border} rounded-2xl p-6 flex flex-col gap-3`}
          >
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

      {/* Quick Actions */}
      <div>
        <h2 className="text-text font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/dashboard/creator/create"
            className="flex items-center gap-4 p-5 bg-surface border border-white/5 hover:border-primary/30 rounded-2xl transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition">
              <FiPlusCircle className="text-primary text-xl" />
            </div>
            <div>
              <p className="text-text font-semibold">Create Campaign</p>
              <p className="text-muted text-sm">Launch a new campaign and start raising funds</p>
            </div>
          </Link>
          <Link
            href="/dashboard/creator/withdrawals"
            className="flex items-center gap-4 p-5 bg-surface border border-white/5 hover:border-primary/30 rounded-2xl transition-all duration-300 group"
          >
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

      {/* Recent Campaigns - placeholder */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-text font-semibold">My Campaigns</h2>
          <Link href="/dashboard/creator/campaigns" className="text-primary text-sm hover:underline">
            View All
          </Link>
        </div>
        <div className="bg-surface border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
          <FiTarget className="text-muted text-4xl mb-3" />
          <p className="text-text font-medium">No campaigns yet</p>
          <p className="text-muted text-sm mt-1">Create your first campaign and start raising funds.</p>
          <Link
            href="/dashboard/creator/create"
            className="mt-4 text-primary text-sm border border-primary/40 px-5 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-300"
          >
            Create Campaign
          </Link>
        </div>
      </div>
    </div>
  );
}