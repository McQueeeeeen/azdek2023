import { StitchPage, getStitchMetadata } from "@/lib/stitch-page";

export const metadata = getStitchMetadata("personal_account_final_linked_adzek_2", "Adzek account");

export default function AccountPage() {
  return <StitchPage folder="personal_account_final_linked_adzek_2" />;
}
