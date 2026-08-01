"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { FiUsers, FiTarget, FiZap, FiDollarSign } from "react-icons/fi";

const stats = [
  {
    icon: <FiUsers className="text-3xl text-primary" />,
    value: 12000,
    suffix: "+",
    label: "Supporters",
    description: "People backing ideas they believe in",
  },
  {
    icon: <FiTarget className="text-3xl text-primary" />,
    value: 3400,
    suffix: "+",
    label: "Campaigns Launched",
    description: "Projects funded across all categories",
  },
  {
    icon: <FiZap className="text-3xl text-primary" />,
    value: 98,
    suffix: "M+",
    label: "Credits Distributed",
    description: "Credits flowing through the platform",
  },
  {
    icon: <FiDollarSign className="text-3xl text-primary" />,
    value: 4900,
    suffix: "K+",
    label: "Dollars Withdrawn",
    description: "Paid out to creators worldwide",
  },
];

function Counter({ value, suffix, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = Math.ceil(value / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-black text-primary">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function ImpactCounter() {
  return (
    <section className="w-full py-24 bg-surface relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/10 blur-3xl rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold tracking-widest uppercase text-sm border border-primary/40 px-4 py-1 rounded-full">
            Our Impact
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-text mt-6 mb-4">
            Platform Impact in <span className="text-primary">Numbers</span>
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Real numbers from a growing community of creators and supporters making ideas come to life.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center p-8 rounded-2xl bg-background border border-white/5 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-300">
                {stat.icon}
              </div>
              <Counter value={stat.value} suffix={stat.suffix} duration={2000 + index * 200} />
              <h3 className="text-text font-bold text-lg mt-3 mb-1">{stat.label}</h3>
              <p className="text-muted text-xs leading-relaxed">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}