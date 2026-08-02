"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  FiHome, FiTarget, FiDollarSign, FiUsers,
  FiFileText, FiPlusCircle, FiMenu, FiX,
  FiLogOut, FiCompass, FiBell
} from "react-icons/fi";

const roleLinks = {
  supporter: [
    { label: "Overview", href: "/dashboard/supporter", icon: <FiHome /> },
    { label: "My Contributions", href: "/dashboard/supporter/contributions", icon: <FiDollarSign /> },
    { label: "Explore Campaigns", href: "/explore", icon: <FiCompass /> },
    { label: "Buy Credits", href: "/dashboard/supporter/buy-credits", icon: <FiPlusCircle /> },
    { label: "Notifications", href: "/dashboard/supporter/notifications", icon: <FiBell /> },
  ],
  creator: [
    { label: "Overview", href: "/dashboard/creator", icon: <FiHome /> },
    { label: "My Campaigns", href: "/dashboard/creator/campaigns", icon: <FiTarget /> },
    { label: "Create Campaign", href: "/dashboard/creator/create", icon: <FiPlusCircle /> },
    { label: "Withdrawals", href: "/dashboard/creator/withdrawals", icon: <FiDollarSign /> },
    { label: "Notifications", href: "/dashboard/creator/notifications", icon: <FiBell /> },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: <FiHome /> },
    { label: "Manage Campaigns", href: "/dashboard/admin/campaigns", icon: <FiTarget /> },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: <FiUsers /> },
    { label: "Withdrawals", href: "/dashboard/admin/withdrawals", icon: <FiDollarSign /> },
    { label: "Reports", href: "/dashboard/admin/reports", icon: <FiFileText /> },
  ],
};

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = session?.user;
  const role = user?.role || "supporter";
  const links = roleLinks[role] || roleLinks.supporter;

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("Logged out!");
    router.push("/");
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-surface border-r border-white/5 flex flex-col transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0`}>

        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-1">
            <span className="text-xl font-bold text-primary">Spark</span>
            <span className="text-xl font-bold text-text">Fund</span>
          </Link>
          <button className="md:hidden text-muted" onClick={() => setSidebarOpen(false)}>
            <FiX />
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-primary font-bold shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-text font-semibold text-sm truncate">{user?.name}</p>
              <p className="text-muted text-xs capitalize">{role}</p>
            </div>
          </div>
          {role !== "admin" && (
            <div className="mt-3 flex items-center gap-2 bg-background px-3 py-2 rounded-xl">
              <span className="text-primary font-bold">{user?.credits ?? 0}</span>
              <span className="text-muted text-xs">credits available</span>
            </div>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-4 flex flex-col gap-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted hover:text-text hover:bg-white/5"
                  }`}
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted hover:text-red-400 hover:bg-red-400/5 transition-all duration-200"
          >
            <FiLogOut className="text-lg" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-white/5 bg-surface/50 backdrop-blur-md flex items-center justify-between px-6 md:px-8">
          <button
            className="md:hidden text-text text-xl"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu />
          </button>
          <h1 className="text-text font-semibold capitalize hidden md:block">
            {role} Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-primary font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
