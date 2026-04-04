import { StitchPage, getStitchMetadata } from "@/lib/stitch-page";

export const metadata = getStitchMetadata("homepage_final_linked_adzek_3", "Adzek homepage");

export default function HomePage() {
  return <StitchPage folder="homepage_final_linked_adzek_3" />;
}
