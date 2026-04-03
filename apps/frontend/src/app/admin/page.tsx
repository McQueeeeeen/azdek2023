import { StitchPage, getStitchMetadata } from "@/lib/stitch-page";

export const metadata = getStitchMetadata("admin_dashboard_azure_clean_2", "Azure Clean admin");

export default function AdminPage() {
  return <StitchPage folder="admin_dashboard_azure_clean_2" />;
}

