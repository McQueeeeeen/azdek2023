import { StitchPage, getStitchMetadata } from "@/lib/stitch-page";

export const metadata = getStitchMetadata("order_history_azure_clean", "Azure Clean order history");

export default function AccountOrdersPage() {
  return <StitchPage folder="order_history_azure_clean" />;
}

