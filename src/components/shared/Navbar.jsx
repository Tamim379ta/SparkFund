"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiMenu, FiX } from "react-icons/fi";

const GITHUB_REPO = "https://github.com/Tamim379ta";

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  console.log(user);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("Logged out!");
    router.push("/");
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-surface bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <span className="text-2xl font-bold text-primary">Spark</span>
          <span className="text-2xl font-bold text-text">Fund</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-3">
          {isPending ? null : !user ? (
            <>
              <Link href="/explore" className="text-text hover:text-primary transition text-sm font-medium">
                Explore Campaigns
              </Link>
              <Link href="/login" className="text-text hover:text-primary transition text-sm font-medium px-4 py-2">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-primary text-white text-sm font-semibold px-5 py-2 rounded-full hover:opacity-90 transition"
              >
                Register
              </Link>
              <a
                href={GITHUB_REPO}
                target="_blank"
                className="border border-primary/40 text-primary text-sm font-semibold px-5 py-2 rounded-full hover:bg-primary hover:text-white transition"
              >
                Join as Developer
              </a>
            </>
          ) : (
            <>
              <Link href="/explore" className="text-text hover:text-primary transition text-sm font-medium">
                Explore
              </Link>
              <Link href="/dashboard" className="text-text hover:text-primary transition text-sm font-medium">
                Dashboard
              </Link>
              <div className="flex items-center gap-1 bg-surface border border-white/10 px-3 py-1.5 rounded-full">
                <span className="text-primary font-bold text-sm">{user.credits ?? 0}</span>
                <span className="text-muted text-xs">credits</span>
              </div>
              <a
                href={GITHUB_REPO}
                target="_blank"
                className="border border-primary/40 text-primary text-sm font-semibold px-5 py-2 rounded-full hover:bg-primary hover:text-white transition"
              >
                Join as Developer
              </a>
              <div className="flex items-center gap-2">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="w-9 h-9 rounded-full object-cover border-2 border-primary" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-primary font-bold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <button onClick={handleLogout} className="text-muted text-sm hover:text-primary transition">
                  Logout
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-text text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface border-t border-white/5 px-6 py-6 flex flex-col gap-4">
          {!user ? (
            <>
              <Link href="/explore" onClick={() => setMenuOpen(false)} className="text-text hover:text-primary transition text-sm font-medium">
                Explore Campaigns
              </Link>
              <Link href="/login" onClick={() => setMenuOpen(false)} className="text-text hover:text-primary transition text-sm font-medium">
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="bg-primary text-white text-sm font-semibold px-5 py-2 rounded-full text-center hover:opacity-90 transition"
              >
                Register
              </Link>
              <a
                href={GITHUB_REPO}
                target="_blank"
                onClick={() => setMenuOpen(false)}
                className="border border-primary/40 text-primary text-sm font-semibold px-5 py-2 rounded-full text-center hover:bg-primary hover:text-white transition"
              >
                Join as Developer
              </a>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-2">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full object-cover border-2 border-primary" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-primary font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-text font-semibold text-sm">{user.name}</p>
                  <p className="text-muted text-xs">{user.credits ?? 0} credits</p>
                </div>
              </div>
              <Link href="/explore" onClick={() => setMenuOpen(false)} className="text-text hover:text-primary transition text-sm">
                Explore
              </Link>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-text hover:text-primary transition text-sm">
                Dashboard
              </Link>
              <a
                href={GITHUB_REPO}
                target="_blank"
                onClick={() => setMenuOpen(false)}
                className="text-primary text-sm hover:underline"
              >
                Join as Developer
              </a>
              <button onClick={handleLogout} className="text-left text-muted hover:text-primary transition text-sm">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}