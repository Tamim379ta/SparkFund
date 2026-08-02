"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const isAuth = pathname?.startsWith("/login") || pathname?.startsWith("/register");

  return (
    <>
      {!isDashboard && !isAuth && <Navbar />}
      {children}
      {!isDashboard && !isAuth && <Footer />}
    </>
  );
}