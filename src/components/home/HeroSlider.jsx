"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";
import Link from "next/link";

const slides = [
  {
    id: 1,
    heading: "Ignite Your",
    highlight: "Ideas",
    subheading: "Turn your vision into reality. Launch your campaign and get backed by thousands of supporters worldwide.",
    cta: "Start a Campaign",
    href: "/register",
    bg: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80",
  },
  {
    id: 2,
    heading: "Back What",
    highlight: "Matters",
    subheading: "Discover innovative projects, creative minds, and meaningful causes. Support the ones that spark something in you.",
    cta: "Explore Campaigns",
    href: "/explore",
    bg: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&q=80",
  },
  {
    id: 3,
    heading: "Every Credit",
    highlight: "Counts",
    subheading: "Small contributions create massive impact. Join a community that believes in the power of collective funding.",
    cta: "Join SparkFund",
    href: "/register",
    bg: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <div className="relative w-full h-[92vh] overflow-hidden">
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.bg})` }}
        />
      </AnimatePresence>

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block text-primary font-semibold tracking-widest uppercase text-sm mb-4 border border-primary/40 px-4 py-1 rounded-full"
              >
                SparkFund Platform
              </motion.span>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                {slide.heading}{" "}
                <span className="text-primary relative">
                  {slide.highlight}
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="absolute bottom-0 left-0 w-full h-1 bg-primary origin-left block"
                  />
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                {slide.subheading}
              </p>

              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link href={slide.href}>
                  <Button
                    size="lg"
                    className="bg-primary text-white font-semibold px-10 rounded-full hover:opacity-90 transition"
                  >
                    {slide.cta}
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button
                    size="lg"
                    variant="bordered"
                    className="border-white/50 text-white px-10 rounded-full hover:bg-white/10 transition"
                  >
                    Explore
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Pagination dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? "bg-primary w-8" : "bg-white/40 w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
}