import { StitchPage, getStitchMetadata } from "@/lib/stitch-page";

export const metadata = getStitchMetadata("homepage_azure_clean_2", "Azure Clean homepage");

export default function HomePage() {
  return <StitchPage folder="homepage_azure_clean_2" />;
}

