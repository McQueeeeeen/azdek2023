import Section from "@/components/ui/section";
import Container from "@/components/ui/container";
import Card from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import AdminSubnav from "@/components/admin/admin-subnav";

const EVENTS = [
  { time: "14:02:21", source: "AuthSvc-Node4", severity: "Warning", detail: "High memory utilization detected." },
  { time: "13:58:12", source: "CDN-Edge-12", severity: "Info", detail: "Cache purge successful for assets-v2." },
  { time: "13:45:00", source: "Scheduler", severity: "Info", detail: "Routine health check complete." },
  { time: "13:12:44", source: "Inventory-DB", severity: "Alert", detail: "Temporary replication connection drop." },
];

export default function AdminHealthPage() {
  return (
    <Section>
      <Container className="grid">
        <PageHeader title="Infrastructure Health" subtitle="Live telemetry across core services and edge regions." />
        <AdminSubnav />

        <div className="admin-kpi-grid">
          <Card className="admin-kpi-card">
            <p className="small">API Gateway</p>
            <p className="h2">98.4%</p>
            <p className="text-secondary">Stable</p>
          </Card>
          <Card className="admin-kpi-card">
            <p className="small">Database</p>
            <p className="h2">100%</p>
            <p className="text-secondary">Optimal</p>
          </Card>
          <Card className="admin-kpi-card">
            <p className="small">Redis Cache</p>
            <p className="h2">99.1%</p>
            <p className="text-secondary">Active</p>
          </Card>
        </div>

        <Card>
          <h2 className="h3">System Events & Logs</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Source</th>
                  <th>Severity</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {EVENTS.map((event) => (
                  <tr key={`${event.time}-${event.source}`}>
                    <td>{event.time}</td>
                    <td>{event.source}</td>
                    <td>{event.severity}</td>
                    <td>{event.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Container>
    </Section>
  );
}
