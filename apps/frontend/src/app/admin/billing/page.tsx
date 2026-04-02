import Section from "@/components/ui/section";
import Container from "@/components/ui/container";
import Card from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import AdminSubnav from "@/components/admin/admin-subnav";

const INVOICES = [
  { id: "INV-2023-09", date: "30 сен 2023", amount: "$1,240.50", status: "Оплачен" },
  { id: "INV-2023-08", date: "31 авг 2023", amount: "$1,192.00", status: "Оплачен" },
  { id: "INV-2023-07", date: "31 июл 2023", amount: "$1,405.20", status: "Спорный" },
];

export default function AdminBillingPage() {
  return (
    <Section>
      <Container className="grid">
        <PageHeader title="Биллинг и использование" subtitle="Мониторинг использования и работа со счетами в реальном времени." />
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
            <p className="text-secondary">Подходим к лимиту 100 GB</p>
          </Card>
          <Card className="admin-kpi-card admin-kpi-accent">
            <p className="small">Следующий счет</p>
            <p className="h2">$1,452.80</p>
            <p className="text-secondary">Период заканчивается 31 окт 2023</p>
          </Card>
        </div>

        <Card>
          <h2 className="h3">Последние счета</h2>
          <div className="admin-table-wrap">
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
