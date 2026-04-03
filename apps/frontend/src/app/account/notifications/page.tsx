import { StitchPage, getStitchMetadata } from "@/lib/stitch-page";

export const metadata = getStitchMetadata("notification_settings_azure_clean_fixed", "Azure Clean notification settings");

export default function AccountNotificationsPage() {
  return <StitchPage folder="notification_settings_azure_clean_fixed" />;
}
