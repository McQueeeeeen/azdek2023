import { StitchPage, getStitchMetadata } from "@/lib/stitch-page";

export const metadata = getStitchMetadata("admin_dashboard_azure_clean_2", "Azure Clean admin nodes");

export default function AdminNodesPage() {
  return <StitchPage folder="admin_dashboard_azure_clean_2" />;
}

