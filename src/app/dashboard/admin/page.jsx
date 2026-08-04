"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { FiDollarSign, FiTarget, FiUsers, FiFileText, FiCheckCircle, FiClock, FiZap } from "react-icons/fi";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/admin/stats`, {
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
      icon: <FiUsers className="text-2xl text-primary" />,
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      bg: "from-primary/10 to-primary/5",
      border: "border-primary/20",
    },
    {
      icon: <FiTarget className="text-2xl text-secondary" />,
      label: "Total Campaigns",
      value: stats?.totalCampaigns ?? 0,
      bg: "from-secondary/10 to-secondary/5",
      border: "border-secondary/20",
    },
    {
      icon: <FiZap className="text-2xl text-emerald-400" />,
      label: "Total Credits",
      value: stats?.totalCredits ?? 0,
      bg: "from-emerald-500/10 to-emerald-500/5",
      border: "border-emerald-500/20",
    },
    {
      icon: <FiDollarSign className="text-2xl text-yellow-400" />,
      label: "Total Payments",
      value: stats?.totalPayments ?? 0,
      bg: "from-yellow-500/10 to-yellow-500/5",
      border: "border-yellow-500/20",
    },
  ];

  const quickActions = [
    { icon: <FiTarget className="text-primary text-xl" />, label: "Manage Campaigns", desc: "Approve or reject submitted campaigns", href: "/dashboard/admin/campaigns", bg: "bg-primary/10", hover: "hover:border-primary/30" },
    { icon: <FiUsers className="text-secondary text-xl" />, label: "Manage Users", desc: "View, edit roles, or remove users", href: "/dashboard/admin/users", bg: "bg-secondary/10", hover: "hover:border-secondary/30" },
    { icon: <FiDollarSign className="text-emerald-400 text-xl" />, label: "Withdrawals", desc: "Process pending withdrawal requests", href: "/dashboard/admin/withdrawals", bg: "bg-emerald-500/10", hover: "hover:border-emerald-500/30" },
    { icon: <FiFileText className="text-yellow-400 text-xl" />, label: "Reports", desc: "Review and resolve reported campaigns", href: "/dashboard/admin/reports", bg: "bg-yellow-500/10", hover: "hover:border-yellow-500/30" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-text">
          Welcome, <span className="text-primary">{user?.name?.split(" ")[0]}</span>! 🛡️
        </h1>
        <p className="text-muted mt-1">Here's a full overview of the SparkFund platform.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.bg} border ${stat.border} rounded-2xl p-6 flex flex-col gap-3`}>
            <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center">
              {stat.icon}
            </div>
            <div>
              <p className="text-muted text-sm">{stat.label}</p>
              <p className="text-text text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-text font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href} className={`flex items-center gap-4 p-5 bg-surface border border-white/5 ${action.hover} rounded-2xl transition-all duration-300 group`}>
              <div className={`w-12 h-12 rounded-xl ${action.bg} flex items-center justify-center`}>
                {action.icon}
              </div>
              <div>
                <p className="text-text font-semibold">{action.label}</p>
                <p className="text-muted text-sm">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}