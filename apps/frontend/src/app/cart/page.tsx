import { StitchPage, getStitchMetadata } from "@/lib/stitch-page";

export const metadata = getStitchMetadata("shopping_cart_final_linked_adzek_1", "Adzek cart");

export default function CartPage() {
  return <StitchPage folder="shopping_cart_final_linked_adzek_1" />;
}
