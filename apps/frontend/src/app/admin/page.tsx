import Section from "@/components/ui/section";
import Container from "@/components/ui/container";
import Card from "@/components/ui/card";
import AdminSubnav from "@/components/admin/admin-subnav";

const ORDER_ROWS = [
  { id: "ORD-2091", customer: "Елена Сорвино", total: "1 240.00", status: "Доставлен" },
  { id: "ORD-2088", customer: "Джулиан Марк", total: "850.00", status: "В обработке" },
];

export default function AdminPage() {
  return (
    <Section>
      <Container className="grid">
        <Card className="grid">
          <h1>Админ-панель</h1>
          <p className="text-secondary">Утилитарный режим без графического оформления.</p>
          <AdminSubnav />
        </Card>

        <Card className="grid">
          <h2>Заказы</h2>
          <table>
            <thead>
              <tr>
                <th align="left">ID</th>
                <th align="left">Клиент</th>
                <th align="left">Сумма</th>
                <th align="left">Статус</th>
              </tr>
            </thead>
            <tbody>
              {ORDER_ROWS.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.customer}</td>
                  <td>{row.total}</td>
                  <td>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Container>
    </Section>
  );
}