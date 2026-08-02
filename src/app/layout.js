import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ConditionalLayout from "@/components/shared/ConditionalLayout";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "SparkFund",
  description: "Crowdfunding platform for creators and supporters",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-background text-text`}>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        <Toaster position="top-center" toastOptions={{ style: { background: "#1a1a1a", color: "#f1f5f9", border: "1px solid #f97316" } }} />
      </body>
    </html>
  );
}