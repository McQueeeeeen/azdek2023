import Section from "@/components/ui/section";
import Container from "@/components/ui/container";
import Card from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import AdminSubnav from "@/components/admin/admin-subnav";

const INVOICES = [
  { id: "INV-2026-04", date: "02 апр 2026", amount: "$1,452.80", status: "Оплачен" },
  { id: "INV-2026-03", date: "01 мар 2026", amount: "$1,221.00", status: "Оплачен" },
  { id: "INV-2026-02", date: "01 фев 2026", amount: "$980.40", status: "Ожидает" },
];

export default function AdminBillingPage() {
  return (
    <Section>
      <Container className="admin-shell">
        <PageHeader title="Биллинг и использование" subtitle="Контроль расходов, подписки и потребления ресурсов в одном месте." />
        <AdminSubnav />

        <div className="admin-kpi-grid">
          <Card className="admin-kpi-card">
            <p className="small">API-запросы</p>
            <p className="h2">1.2M / 2M</p>
            <p className="text-secondary">Использовано 60% месячной квоты</p>
          </Card>
          <Card className="admin-kpi-card">
            <p className="small">Хранилище</p>
            <p className="h2">84.2 GB</p>
            <p className="text-secondary">Осталось 15.8 GB до лимита</p>
          </Card>
          <Card className="admin-kpi-card admin-kpi-accent">
            <p className="small">Следующий платеж</p>
            <p className="h2">$1,452.80</p>
            <p className="text-secondary">Списание 30 апреля 2026</p>
          </Card>
        </div>

        <Card className="admin-panel">
          <div className="admin-panel-head">
            <h2 className="h3">История счетов</h2>
            <span className="status-pill ok">Платежный шлюз активен</span>
          </div>
          <div className="admin-panel-body admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Счет</th>
                  <th>Дата</th>
                  <th>Сумма</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {INVOICES.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.id}</td>
                    <td>{invoice.date}</td>
                    <td>{invoice.amount}</td>
                    <td>
                      <span className={`status-pill ${invoice.status === "Оплачен" ? "ok" : "warn"}`}>{invoice.status}</span>
                    </td>
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
