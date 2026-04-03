import { StitchPage, getStitchMetadata } from "@/lib/stitch-page";

export const metadata = getStitchMetadata("profile_settings_azure_clean", "Azure Clean profile settings");

export default function AccountProfilePage() {
  return <StitchPage folder="profile_settings_azure_clean" />;
}

