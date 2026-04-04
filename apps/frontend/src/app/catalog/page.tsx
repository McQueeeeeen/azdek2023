import { StitchPage, getStitchMetadata } from "@/lib/stitch-page";

export const metadata = getStitchMetadata("product_catalog_final_linked_adzek_3", "Adzek catalog");

export default function CatalogPage() {
  return <StitchPage folder="product_catalog_final_linked_adzek_3" />;
}
