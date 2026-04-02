import Section from "@/components/ui/section";
import Container from "@/components/ui/container";
import Card from "@/components/ui/card";
import AdminSubnav from "@/components/admin/admin-subnav";

const INVOICES = [
  { id: "INV-2026-04", date: "02 апр 2026", amount: "$1,452.80", status: "Оплачен" },
  { id: "INV-2026-03", date: "01 мар 2026", amount: "$1,221.00", status: "Оплачен" },
];

export default function AdminBillingPage() {
  return (
    <Section>
      <Container className="grid">
        <Card className="grid">
          <h1>Биллинг</h1>
          <AdminSubnav />
        </Card>

        <Card className="grid">
          <h2>Счета</h2>
          <table>
            <thead>
              <tr>
                <th align="left">Счет</th>
                <th align="left">Дата</th>
                <th align="left">Сумма</th>
                <th align="left">Статус</th>
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
        </Card>
      </Container>
    </Section>
  );
}