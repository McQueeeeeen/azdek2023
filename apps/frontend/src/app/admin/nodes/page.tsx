import Section from "@/components/ui/section";
import Container from "@/components/ui/container";
import Card from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import AdminSubnav from "@/components/admin/admin-subnav";
import Button from "@/components/ui/button";

const NODES = [
  { name: "node-us-east-01", ip: "10.0.42.129", region: "AWS US-East-1", status: "Active", cpu: "24%", ram: "4.2 / 16 GB" },
  { name: "node-eu-west-04", ip: "172.16.8.41", region: "GCP EU-West-2", status: "Warning", cpu: "91%", ram: "14.8 / 16 GB" },
  { name: "node-ap-south-02", ip: "192.168.1.12", region: "AWS AP-South-1", status: "Syncing", cpu: "12%", ram: "2.1 / 16 GB" },
  { name: "node-us-west-09", ip: "10.0.12.201", region: "AWS US-West-2", status: "Active", cpu: "56%", ram: "8.9 / 16 GB" },
];

export default function AdminNodesPage() {
  return (
    <Section>
      <Container className="grid">
        <PageHeader title="Server Nodes" subtitle="Global node list, health status and utilization overview." />
        <AdminSubnav />

        <div className="admin-kpi-grid">
          <Card className="admin-kpi-card">
            <p className="small">Total Nodes</p>
            <p className="h2">1,284</p>
            <p className="text-secondary">+12% this month</p>
          </Card>
          <Card className="admin-kpi-card">
            <p className="small">Average Load</p>
            <p className="h2">42.8%</p>
            <p className="text-secondary">Across active clusters</p>
          </Card>
          <Card className="admin-kpi-card">
            <p className="small">Uptime</p>
            <p className="h2">99.98%</p>
            <p className="text-secondary">Global SLA</p>
          </Card>
        </div>

        <Card>
          <div className="page-header">
            <h2 className="h3">Nodes</h2>
            <Button variant="secondary">New Node</Button>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Node</th>
                  <th>Region</th>
                  <th>Status</th>
                  <th>CPU</th>
                  <th>RAM</th>
                </tr>
              </thead>
              <tbody>
                {NODES.map((node) => (
                  <tr key={node.name}>
                    <td>
                      <strong>{node.name}</strong>
                      <br />
                      <span className="small">{node.ip}</span>
                    </td>
                    <td>{node.region}</td>
                    <td>{node.status}</td>
                    <td>{node.cpu}</td>
                    <td>{node.ram}</td>
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
