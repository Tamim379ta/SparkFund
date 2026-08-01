import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "SparkFund",
  description: "Crowdfunding platform for creators and supporters",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-background text-text`}>
        <Navbar />
        {children}
        <Footer/>
      </body>
    </html>
  );
}