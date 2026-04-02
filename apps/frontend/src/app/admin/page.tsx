import Section from "@/components/ui/section";
import Container from "@/components/ui/container";
import Card from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import Button from "@/components/ui/button";
import AdminSubnav from "@/components/admin/admin-subnav";

const ORDER_ROWS = [
  {
    id: "ORD-2091",
    customer_name: "Елена Сорвино",
    phone: "+7 701 555 11 22",
    total: "1 240.00",
    status: "Доставлен",
    payment_status: "Оплачен",
    created_at: "2026-04-02 10:22",
  },
  {
    id: "ORD-2088",
    customer_name: "Джулиан Марк",
    phone: "+7 777 112 55 44",
    total: "850.00",
    status: "В обработке",
    payment_status: "Ожидает оплату",
    created_at: "2026-04-02 09:50",
  },
];

const PRODUCT_ROWS = [
  { id: "PRD-001", name: "AZDEK Laundry Gel", price: "8 990", sku: "AZD-LG-5L", stock: 90, status: "Активен", created_at: "2026-03-21" },
  { id: "PRD-002", name: "AZDEK Softener Fresh", price: "2 290", sku: "AZD-SF-1L", stock: 120, status: "Активен", created_at: "2026-03-19" },
];

const CUSTOMER_ROWS = [
  { id: "CUS-1001", name: "Айдана С.", phone: "+7 705 123 45 67", email: "aidana@example.com", role: "Пользователь", created_at: "2026-03-28" },
  { id: "CUS-1002", name: "TOO Clean Market", phone: "+7 747 555 00 11", email: "ops@cleanmarket.kz", role: "Оптовик", created_at: "2026-03-30" },
];

const PAYMENT_ROWS = [
  { id: "PAY-8801", order_id: "ORD-2091", amount: "1 240.00", status: "Оплачен", provider: "Kaspi", created_at: "2026-04-02 10:23" },
  { id: "PAY-8802", order_id: "ORD-2088", amount: "850.00", status: "Ожидает", provider: "Карта", created_at: "2026-04-02 09:51" },
];

const SHIPMENT_ROWS = [
  { id: "SHP-7001", order_id: "ORD-2091", status: "Доставлен", tracking_number: "KZ-TRK-200991", created_at: "2026-04-02 14:45" },
  { id: "SHP-7002", order_id: "ORD-2088", status: "Подготовлен", tracking_number: "KZ-TRK-200988", created_at: "2026-04-02 10:40" },
];

export default function AdminPage() {
  return (
    <Section>
      <Container className="admin-shell">
        <PageHeader title="Админ-панель" subtitle="Единая операционная зона: заказы, товары, клиенты, платежи и отгрузки." />
        <AdminSubnav />

        <div className="admin-kpi-grid">
          <Card className="admin-kpi-card">
            <p className="small">Оборот за 24 часа</p>
            <p className="h2">$42,920</p>
            <p className="text-secondary">+12.4% к предыдущему дню</p>
          </Card>
          <Card className="admin-kpi-card">
            <p className="small">Активные заказы</p>
            <p className="h2">1,204</p>
            <p className="text-secondary">32 заказа ждут сборки</p>
          </Card>
          <Card className="admin-kpi-card admin-kpi-accent">
            <p className="small">Здоровье каталога</p>
            <p className="h2">98.2%</p>
            <p className="text-secondary">4 позиции временно out of stock</p>
          </Card>
        </div>

        <div className="admin-main-grid">
          <Card className="admin-panel">
            <div className="admin-panel-head">
              <h2 className="h3">Заказы</h2>
              <Button variant="ghost">Смотреть все</Button>
            </div>
            <div className="admin-panel-body admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>id</th>
                    <th>customer_name</th>
                    <th>phone</th>
                    <th>total</th>
                    <th>status</th>
                    <th>payment_status</th>
                    <th>created_at</th>
                  </tr>
                </thead>
                <tbody>
                  {ORDER_ROWS.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.customer_name}</td>
                      <td>{row.phone}</td>
                      <td>{row.total}</td>
                      <td>{row.status}</td>
                      <td>{row.payment_status}</td>
                      <td>{row.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="admin-stack">
            <Card className="admin-panel">
              <div className="admin-panel-head">
                <h2 className="h3">Каналы продаж</h2>
                <span className="status-pill ok">Realtime</span>
              </div>
              <div className="admin-panel-body admin-progress-list">
                <div>
                  <div className="admin-progress-head"><span>Прямые продажи</span><span>64%</span></div>
                  <div className="admin-progress-track"><span style={{ width: "64%" }} /></div>
                </div>
                <div>
                  <div className="admin-progress-head"><span>Партнеры</span><span>22%</span></div>
                  <div className="admin-progress-track"><span style={{ width: "22%" }} /></div>
                </div>
                <div>
                  <div className="admin-progress-head"><span>Органика</span><span>14%</span></div>
                  <div className="admin-progress-track"><span style={{ width: "14%" }} /></div>
                </div>
              </div>
            </Card>

            <Card className="admin-panel">
              <div className="admin-panel-head">
                <h2 className="h3">Быстрые действия</h2>
              </div>
              <div className="admin-panel-body admin-actions-grid">
                <Button variant="secondary">Новый SKU</Button>
                <Button variant="secondary">Экспорт CSV</Button>
                <Button variant="secondary">Рассылка</Button>
                <Button variant="secondary">Поддержка</Button>
              </div>
            </Card>
          </div>
        </div>

        <Card className="admin-panel">
          <div className="admin-panel-head"><h2 className="h3">Товары</h2></div>
          <div className="admin-panel-body admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>id</th>
                  <th>name</th>
                  <th>price</th>
                  <th>sku</th>
                  <th>stock</th>
                  <th>status</th>
                  <th>created_at</th>
                </tr>
              </thead>
              <tbody>
                {PRODUCT_ROWS.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.name}</td>
                    <td>{row.price}</td>
                    <td>{row.sku}</td>
                    <td>{row.stock}</td>
                    <td>{row.status}</td>
                    <td>{row.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="admin-panel">
          <div className="admin-panel-head"><h2 className="h3">Клиенты</h2></div>
          <div className="admin-panel-body admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>id</th>
                  <th>name</th>
                  <th>phone</th>
                  <th>email</th>
                  <th>role</th>
                  <th>created_at</th>
                </tr>
              </thead>
              <tbody>
                {CUSTOMER_ROWS.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.name}</td>
                    <td>{row.phone}</td>
                    <td>{row.email}</td>
                    <td>{row.role}</td>
                    <td>{row.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="admin-main-grid">
          <Card className="admin-panel">
            <div className="admin-panel-head"><h2 className="h3">Платежи</h2></div>
            <div className="admin-panel-body admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>id</th>
                    <th>order_id</th>
                    <th>amount</th>
                    <th>status</th>
                    <th>provider</th>
                    <th>created_at</th>
                  </tr>
                </thead>
                <tbody>
                  {PAYMENT_ROWS.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.order_id}</td>
                      <td>{row.amount}</td>
                      <td>{row.status}</td>
                      <td>{row.provider}</td>
                      <td>{row.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="admin-panel">
            <div className="admin-panel-head"><h2 className="h3">Отгрузки</h2></div>
            <div className="admin-panel-body admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>id</th>
                    <th>order_id</th>
                    <th>status</th>
                    <th>tracking_number</th>
                    <th>created_at</th>
                  </tr>
                </thead>
                <tbody>
                  {SHIPMENT_ROWS.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.order_id}</td>
                      <td>{row.status}</td>
                      <td>{row.tracking_number}</td>
                      <td>{row.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
