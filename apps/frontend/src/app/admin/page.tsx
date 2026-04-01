import Section from "@/components/ui/section";
import Container from "@/components/ui/container";
import Card from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import Button from "@/components/ui/button";
import AdminSubnav from "@/components/admin/admin-subnav";

const ORDER_ROWS = [
  { id: "#ORD-2091", customer: "Elena Sorvino", status: "Delivered", amount: "$1,240.00" },
  { id: "#ORD-2088", customer: "Julian Marc", status: "Processing", amount: "$850.00" },
  { id: "#ORD-2085", customer: "Kira Lane", status: "Pending", amount: "$2,100.00" },
  { id: "#ORD-2082", customer: "Oliver West", status: "Delivered", amount: "$450.00" },
];

export default function AdminPage() {
  return (
    <Section>
      <Container className="grid">
        <PageHeader title="Admin Control" subtitle="Operational metrics, fulfillment signals and quick actions." />
        <AdminSubnav />

        <div className="admin-kpi-grid">
          <Card className="admin-kpi-card">
            <p className="small">Volume 24h</p>
            <p className="h2">$42,920.00</p>
            <p className="text-secondary">+12.4% vs yesterday</p>
          </Card>
          <Card className="admin-kpi-card">
            <p className="small">Active Orders</p>
            <p className="h2">1,204</p>
            <p className="text-secondary">32 pending fulfillment</p>
          </Card>
          <Card className="admin-kpi-card admin-kpi-accent">
            <p className="small">Catalog Health</p>
            <p className="h2">98.2%</p>
            <p className="text-secondary">4 items currently out of stock</p>
          </Card>
        </div>

        <div className="admin-main-grid">
          <Card>
            <div className="page-header">
              <h2 className="h3">Recent Orders</h2>
              <Button variant="ghost">View All</Button>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {ORDER_ROWS.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.customer}</td>
                      <td>{row.status}</td>
                      <td>{row.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid">
            <Card>
              <h2 className="h3">Volume Trend</h2>
              <div className="admin-progress-list">
                <div>
                  <div className="admin-progress-head">
                    <span>Direct Sales</span>
                    <span>64%</span>
                  </div>
                  <div className="admin-progress-track">
                    <span style={{ width: "64%" }} />
                  </div>
                </div>
                <div>
                  <div className="admin-progress-head">
                    <span>Affiliates</span>
                    <span>22%</span>
                  </div>
                  <div className="admin-progress-track">
                    <span style={{ width: "22%" }} />
                  </div>
                </div>
                <div>
                  <div className="admin-progress-head">
                    <span>Organic</span>
                    <span>14%</span>
                  </div>
                  <div className="admin-progress-track">
                    <span style={{ width: "14%" }} />
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="h3">Quick Actions</h2>
              <div className="admin-actions-grid">
                <Button variant="secondary">New SKU</Button>
                <Button variant="secondary">Export CSV</Button>
                <Button variant="secondary">Blast Alert</Button>
                <Button variant="secondary">Support</Button>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
}
