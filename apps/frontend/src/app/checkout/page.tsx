import { StitchPage, getStitchMetadata } from "@/lib/stitch-page";

export const metadata = getStitchMetadata("checkout_azure_clean", "Azure Clean checkout");

export default function CheckoutPage() {
  return <StitchPage folder="checkout_azure_clean" />;
}

