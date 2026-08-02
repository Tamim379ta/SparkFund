"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.replace("/login");
      return;
    }
    const role = session.user.role;
    if (role === "creator") router.replace("/dashboard/creator");
    else if (role === "admin") router.replace("/dashboard/admin");
    else router.replace("/dashboard/supporter");
  }, [session, isPending]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted text-sm">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}