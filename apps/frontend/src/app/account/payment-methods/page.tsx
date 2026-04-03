import { StitchPage, getStitchMetadata } from "@/lib/stitch-page";

export const metadata = getStitchMetadata("payment_methods_azure_clean", "Azure Clean payment methods");

export default function AccountPaymentMethodsPage() {
  return <StitchPage folder="payment_methods_azure_clean" />;
}

