import { StitchPage, getStitchMetadata } from "@/lib/stitch-page";

export const metadata = getStitchMetadata("about_our_philosophy_azure_clean", "Azure Clean philosophy");

export default function AboutPage() {
  return <StitchPage folder="about_our_philosophy_azure_clean" />;
}

