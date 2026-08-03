import CampaignDetailClient from "@/components/campaign/CampaignDetailClient";

export default async function CampaignDetailPage({ params }) {
  const { id } = await params;
  return <CampaignDetailClient id={id} />;
}