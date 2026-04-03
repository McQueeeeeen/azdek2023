import { StitchPage, getStitchMetadata } from "@/lib/stitch-page";

export const metadata = getStitchMetadata("personal_account_azure_clean", "Azure Clean account");

export default function AccountPage() {
  return <StitchPage folder="personal_account_azure_clean" />;
}

