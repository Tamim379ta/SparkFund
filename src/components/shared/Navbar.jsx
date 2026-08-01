"use client";

import Link from "next/link";
import { Button } from "@heroui/react";

export default function Navbar() {
  const user = null; // wire up Better Auth later

  const handleLogout = async () => {
    // Better Auth logout
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-surface bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">Spark</span>
          <span className="text-2xl font-bold text-text">Fund</span>
        </Link>

        {/* Nav Items */}
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link href="/explore">
                <Button variant="light" className="text-text">Explore Campaigns</Button>
              </Link>
              <Link href="/login">
                <Button variant="light" className="text-text">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-primary text-white">Register</Button>
              </Link>
              <a href="https://github.com/your-repo" target="_blank">
                <Button variant="bordered" className="border-primary text-primary">Join as Developer</Button>
              </a>
            </>
          ) : (
            <>
              <Link href="/dashboard">
                <Button variant="light" className="text-text">Dashboard</Button>
              </Link>
              <div className="flex items-center gap-2 bg-surface px-3 py-1 rounded-full">
                <span className="text-primary font-bold">{user.credits}</span>
                <span className="text-muted text-sm">credits</span>
              </div>
              <a href="https://github.com/your-repo" target="_blank">
                <Button variant="bordered" className="border-primary text-primary">Join as Developer</Button>
              </a>
              <img src={user.image} alt={user.name} className="w-9 h-9 rounded-full object-cover border-2 border-primary" />
              <Button onClick={handleLogout} variant="light" className="text-muted text-sm">Logout</Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}