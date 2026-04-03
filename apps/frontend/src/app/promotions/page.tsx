import { StitchPage, getStitchMetadata } from "@/lib/stitch-page";

export const metadata = getStitchMetadata("promotions_special_offers_azure_clean", "Azure Clean promotions");

export default function PromotionsPage() {
  return <StitchPage folder="promotions_special_offers_azure_clean" />;
}

