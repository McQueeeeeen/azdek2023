import { StitchPage, getStitchMetadata } from "@/lib/stitch-page";

export const metadata = getStitchMetadata("checkout_final_linked_adzek_2", "Adzek checkout");

export default function CheckoutPage() {
  return <StitchPage folder="checkout_final_linked_adzek_2" />;
}
