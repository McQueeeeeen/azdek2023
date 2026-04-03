import { StitchPage, getStitchMetadata } from "@/lib/stitch-page";

export const metadata = getStitchMetadata("seasonal_banner_the_winter_sanctuary", "Azure Clean seasonal");

export default function SeasonalPage() {
  return <StitchPage folder="seasonal_banner_the_winter_sanctuary" />;
}

