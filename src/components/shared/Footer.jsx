import Link from "next/link";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full border-t border-surface bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-1 mb-4">
              <span className="text-2xl font-bold text-primary">Spark</span>
              <span className="text-2xl font-bold text-text">Fund</span>
            </Link>
            <p className="text-muted text-sm leading-relaxed max-w-sm">
              SparkFund is a community-powered crowdfunding platform where creators launch campaigns and supporters back what matters most to them.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-6">
              <a href="https://github.com/your-github" target="_blank" className="text-muted hover:text-primary transition text-xl">
                <FaGithub />
              </a>
              <a href="https://linkedin.com/in/your-linkedin" target="_blank" className="text-muted hover:text-primary transition text-xl">
                <FaLinkedin />
              </a>
              <a href="https://facebook.com/your-facebook" target="_blank" className="text-muted hover:text-primary transition text-xl">
                <FaFacebook />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-text font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "Explore Campaigns", href: "/explore" },
                { label: "Login", href: "/login" },
                { label: "Register", href: "/register" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted text-sm hover:text-primary transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-text font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              {[
                { label: "Start a Campaign", href: "/register" },
                { label: "How It Works", href: "/#how-it-works" },
                { label: "Join as Developer", href: "https://github.com/your-repo" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-muted text-sm hover:text-primary transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-surface mt-10 pt-6 flex justify-center items-center ">
          <p className="text-muted text-sm">
            © {new Date().getFullYear()} SparkFund. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}