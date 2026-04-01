import Section from "@/components/ui/section";
import Container from "@/components/ui/container";
import Card from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import AdminSubnav from "@/components/admin/admin-subnav";

const INVOICES = [
  { id: "INV-2023-09", date: "Sep 30, 2023", amount: "$1,240.50", status: "Paid" },
  { id: "INV-2023-08", date: "Aug 31, 2023", amount: "$1,192.00", status: "Paid" },
  { id: "INV-2023-07", date: "Jul 31, 2023", amount: "$1,405.20", status: "Disputed" },
];

export default function AdminBillingPage() {
  return (
    <Section>
      <Container className="grid">
        <PageHeader title="Billing & Usage" subtitle="Real-time usage monitoring and invoice operations." />
        <AdminSubnav />

        <div className="admin-kpi-grid">
          <Card className="admin-kpi-card">
            <p className="small">API Requests</p>
            <p className="h2">1.2M / 2M</p>
            <p className="text-secondary">60% monthly quota reached</p>
          </Card>
          <Card className="admin-kpi-card">
            <p className="small">Storage</p>
            <p className="h2">84.2 GB</p>
            <p className="text-secondary">Approaching 100 GB capacity</p>
          </Card>
          <Card className="admin-kpi-card admin-kpi-accent">
            <p className="small">Next Invoice</p>
            <p className="h2">$1,452.80</p>
            <p className="text-secondary">Cycle ends Oct 31, 2023</p>
          </Card>
        </div>

        <Card>
          <h2 className="h3">Recent Invoices</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {INVOICES.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.id}</td>
                    <td>{invoice.date}</td>
                    <td>{invoice.amount}</td>
                    <td>{invoice.status}</td>
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
