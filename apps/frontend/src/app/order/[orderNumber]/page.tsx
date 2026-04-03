import type { Metadata } from "next";
import { StitchPage, getStitchMetadata } from "@/lib/stitch-page";

export async function generateMetadata(): Promise<Metadata> {
  return getStitchMetadata("order_success_azure_clean", "Azure Clean order success");
}

export default function OrderPage() {
  return <StitchPage folder="order_success_azure_clean" />;
}

