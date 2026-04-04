import type { Metadata } from "next";
import { StitchPage, getStitchMetadata } from "@/lib/stitch-page";

export async function generateMetadata(): Promise<Metadata> {
  return getStitchMetadata("product_description_final_linked_adzek_3", "Adzek product page");
}

export default function ProductPage() {
  return <StitchPage folder="product_description_final_linked_adzek_3" />;
}
