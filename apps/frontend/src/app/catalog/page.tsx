import { StitchPage, getStitchMetadata } from "@/lib/stitch-page";

export const metadata = getStitchMetadata("product_catalog_azure_clean", "Azure Clean catalog");

export default function CatalogPage() {
  return <StitchPage folder="product_catalog_azure_clean" />;
}

