import { StitchPage, getStitchMetadata } from "@/lib/stitch-page";

export const metadata = getStitchMetadata("homepage_azure_clean_2", "Azure Clean homepage");
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function HomePage() {
  return <StitchPage folder="homepage_azure_clean_2" />;
}
