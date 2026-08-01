import FadeIn from "@/components/ui/FadeIn";
import Link from "next/link";
import { FiMonitor, FiHeart, FiMusic, FiUsers, FiBook, FiSun } from "react-icons/fi";

const categories = [
  {
    icon: <FiMonitor className="text-3xl text-primary" />,
    label: "Technology",
    count: "120+ Campaigns",
    bg: "from-primary/10 to-primary/5",
  },
  {
    icon: <FiHeart className="text-3xl text-primary" />,
    label: "Health",
    count: "85+ Campaigns",
    bg: "from-rose-500/10 to-rose-500/5",
  },
  {
    icon: <FiMusic className="text-3xl text-primary" />,
    label: "Art & Music",
    count: "96+ Campaigns",
    bg: "from-secondary/10 to-secondary/5",
  },
  {
    icon: <FiUsers className="text-3xl text-primary" />,
    label: "Community",
    count: "74+ Campaigns",
    bg: "from-emerald-500/10 to-emerald-500/5",
  },
  {
    icon: <FiBook className="text-3xl text-primary" />,
    label: "Education",
    count: "60+ Campaigns",
    bg: "from-yellow-500/10 to-yellow-500/5",
  },
  {
    icon: <FiSun className="text-3xl text-primary" />,
    label: "Environment",
    count: "45+ Campaigns",
    bg: "from-green-500/10 to-green-500/5",
  },
];

export default function ExploreByCategory() {
  return (
    <section className="w-full py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <FadeIn className="text-center mb-16">
          <span className="text-primary font-semibold tracking-widest uppercase text-sm border border-primary/40 px-4 py-1 rounded-full">
            Browse
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-text mt-6 mb-4">
            Explore by <span className="text-primary">Category</span>
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Find campaigns that match your passion. From tech innovations to community causes — there's something for everyone.
          </p>
        </FadeIn>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((cat, index) => (
            <FadeIn key={cat.label} delay={index * 0.1} direction="up">
              <Link href={`/explore?category=${cat.label}`}>
                <div className={`flex flex-col items-center text-center p-8 rounded-2xl bg-gradient-to-br ${cat.bg} border border-white/5 hover:border-primary/30 hover:scale-105 transition-all duration-300 group cursor-pointer`}>
                  <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-all duration-300">
                    {cat.icon}
                  </div>
                  <h3 className="text-text font-bold text-lg mb-1">{cat.label}</h3>
                  <p className="text-muted text-sm">{cat.count}</p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        {/* CTA */}
        <FadeIn className="text-center mt-12" delay={0.3}>
          <Link
            href="/explore"
            className="inline-block text-primary border border-primary/40 px-8 py-3 rounded-full hover:bg-primary hover:text-white transition-all duration-300 font-semibold"
          >
            View All Campaigns →
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}