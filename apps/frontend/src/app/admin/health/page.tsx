import { StitchPage, getStitchMetadata } from "@/lib/stitch-page";

export const metadata = getStitchMetadata("admin_dashboard_final_linked_adzek_2", "Adzek admin health");

export default function AdminHealthPage() {
  return <StitchPage folder="admin_dashboard_final_linked_adzek_2" />;
}
