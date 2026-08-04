import Link from "next/link";
import { FiTarget, FiClock } from "react-icons/fi";
import FadeIn from "@/components/ui/FadeIn";

async function getTopCampaigns() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/top-funded`, {
      cache: "no-store",
    });
    const data = await res.json();
    return data.success ? data.campaigns : [];
  } catch {
    return [];
  }
}

export default async function TopFundedCampaigns() {
  const campaigns = await getTopCampaigns();

  if (campaigns.length === 0) return null;

  return (
    <section className="w-full py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <span className="text-primary font-semibold tracking-widest uppercase text-sm border border-primary/40 px-4 py-1 rounded-full">
            Trending
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-text mt-6 mb-4">
            Top Funded <span className="text-primary">Campaigns</span>
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            The most backed campaigns on SparkFund right now.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {campaigns.map((campaign, index) => {
            const progress = Math.min((campaign.raisedCredits / campaign.goalCredits) * 100, 100);
            const daysLeft = Math.max(0, Math.ceil((new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24)));

            return (
              <FadeIn key={campaign._id} delay={index * 0.1}>
                <Link
                  href={`/campaign/${campaign._id}`}
                  className="bg-surface border border-white/5 hover:border-primary/30 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col group"
                >
                  {/* Rank Badge */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute top-3 left-3 w-8 h-8 bg-primary text-white text-sm font-black rounded-full flex items-center justify-center">
                      #{index + 1}
                    </span>
                    <span className="absolute top-3 right-3 flex items-center gap-1 text-xs text-white bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                      <FiClock className="text-primary" />
                      {daysLeft}d left
                    </span>
                  </div>

                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div>
                      <span className="text-primary text-xs font-medium">{campaign.category}</span>
                      <h3 className="text-text font-semibold mt-1 line-clamp-1 group-hover:text-primary transition-colors">
                        {campaign.title}
                      </h3>
                      <p className="text-muted text-xs mt-1">by {campaign.creatorName}</p>
                    </div>

                    <div className="mt-auto">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-primary font-bold">{campaign.raisedCredits} credits raised</span>
                        <span className="text-muted">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-muted text-xs mt-1.5">Goal: {campaign.goalCredits} credits</p>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>

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