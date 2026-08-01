
import Marquee from "react-fast-marquee";
import { FaQuoteLeft } from "react-icons/fa";
import FadeIn from "@/components/ui/FadeIn";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Campaign Creator",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    quote: "SparkFund helped me raise over 5,000 credits in just two weeks. The community is incredibly supportive!",
  },
  {
    id: 2,
    name: "Marcus Lee",
    role: "Supporter",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    quote: "Finding and backing meaningful campaigns has never been easier. SparkFund is my go-to platform.",
  },
  {
    id: 3,
    name: "Aisha Rahman",
    role: "Campaign Creator",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
    quote: "From approval to first contribution in less than 24 hours. Fastest crowdfunding platform I've used!",
  },
  {
    id: 4,
    name: "Daniel Kim",
    role: "Supporter",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    quote: "The credit system is genius. I can support multiple campaigns without any payment friction.",
  },
  {
    id: 5,
    name: "Priya Patel",
    role: "Campaign Creator",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&q=80",
    quote: "I funded my art project within 10 days. SparkFund's platform made the whole process seamless.",
  },
  {
    id: 6,
    name: "James Wright",
    role: "Supporter",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    quote: "Love discovering new projects every day. SparkFund keeps me connected to innovation and creativity.",
  },
];

function TestimonialCard({ testimonial }) {
  return (
    <div className="mx-3 w-72 bg-surface border border-white/5 hover:border-primary/30 transition-all duration-300 rounded-2xl p-6 flex flex-col gap-4">
      <FaQuoteLeft className="text-primary/40 text-2xl" />
      <p className="text-muted text-sm leading-relaxed line-clamp-3">{testimonial.quote}</p>
      <div className="flex items-center gap-3 mt-auto">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-primary/40"
        />
        <div>
          <p className="text-text font-semibold text-sm">{testimonial.name}</p>
          <p className="text-muted text-xs">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="w-full py-24 bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <span className="text-primary font-semibold tracking-widest uppercase text-sm border border-primary/40 px-4 py-1 rounded-full">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-text mt-6 mb-4">
            What People <span className="text-primary">Say</span>
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Thousands of creators and supporters trust SparkFund to bring ideas to life.
          </p>
        </FadeIn>
      </div>

      {/* Marquee Row 1 - left to right */}
      <Marquee speed={40} gradient={false} pauseOnHover={true} className="mb-4">
        {testimonials.map((t) => (
          <TestimonialCard key={t.id} testimonial={t} />
        ))}
      </Marquee>

      
    </section>
  );
}