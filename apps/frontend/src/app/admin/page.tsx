import { StitchPage, getStitchMetadata } from "@/lib/stitch-page";

export const metadata = getStitchMetadata("admin_dashboard_final_linked_adzek_2", "Adzek admin");

export default function AdminPage() {
  return <StitchPage folder="admin_dashboard_final_linked_adzek_2" />;
}
