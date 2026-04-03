import { StitchPage, getStitchMetadata } from "@/lib/stitch-page";

export const metadata = getStitchMetadata("faq_support_azure_clean", "Azure Clean support");

export default function SupportPage() {
  return <StitchPage folder="faq_support_azure_clean" />;
}

