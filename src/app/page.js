import ExploreByCategory from "@/components/home/ExploreByCategory";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import ImpactCounter from "@/components/home/ImpactCounter";
import Testimonials from "@/components/home/Testimonials";
import TopFundedCampaigns from "@/components/home/TopFundedCampaigns";

export default function Home() {
  return (
   <>
    <Hero/>
    <TopFundedCampaigns/>
    <HowItWorks/>
    <ExploreByCategory/>
    <ImpactCounter/>
    <Testimonials/>
    
   </>
  );
}
