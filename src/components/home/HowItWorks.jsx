import { FiTarget, FiZap, FiDollarSign } from "react-icons/fi";
import FadeIn from "@/components/ui/FadeIn";

const steps = [
  {
    id: "01",
    icon: <FiTarget className="text-4xl text-primary" />,
    title: "Create a Campaign",
    description:
      "Sign up as a Creator, set your funding goal, deadline, and tell your story. Submit for admin approval and go live within 24 hours.",
  },
  {
    id: "02",
    icon: <FiZap className="text-4xl text-primary" />,
    title: "Get Funded",
    description:
      "Supporters discover your campaign, contribute credits, and help you reach your goal. Track every contribution in real time.",
  },
  {
    id: "03",
    icon: <FiDollarSign className="text-4xl text-primary" />,
    title: "Withdraw Funds",
    description:
      "Once you've raised enough credits, request a withdrawal. Get paid directly to your preferred payment method.",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <FadeIn className="text-center mb-16">
          <span className="text-primary font-semibold tracking-widest uppercase text-sm border border-primary/40 px-4 py-1 rounded-full">
            Simple Process
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-text mt-6 mb-4">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            From idea to funding in three simple steps. SparkFund makes crowdfunding fast, transparent, and rewarding.
          </p>
        </FadeIn>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <FadeIn key={step.id} delay={index * 0.15} direction="up">
              <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-background border border-white/5 hover:border-primary/30 transition-all duration-300 group h-full">
                <span className="text-6xl font-black text-white/5 group-hover:text-primary/10 transition-all duration-300 select-none mb-2">
                  {step.id}
                </span>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-300">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-text mb-3">{step.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{step.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}