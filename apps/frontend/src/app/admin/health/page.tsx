import Section from "@/components/ui/section";
import Container from "@/components/ui/container";
import Card from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import AdminSubnav from "@/components/admin/admin-subnav";

const EVENTS = [
  { time: "14:02:21", source: "AuthSvc-Node4", severity: "Предупреждение", detail: "Обнаружена высокая загрузка памяти." },
  { time: "13:58:12", source: "CDN-Edge-12", severity: "Инфо", detail: "Очистка кэша для assets-v2 выполнена." },
  { time: "13:45:00", source: "Scheduler", severity: "Инфо", detail: "Плановая проверка состояния завершена." },
  { time: "13:12:44", source: "Inventory-DB", severity: "Тревога", detail: "Временный обрыв репликации." },
];

export default function AdminHealthPage() {
  return (
    <Section>
      <Container className="grid">
        <PageHeader title="Состояние инфраструктуры" subtitle="Живая телеметрия по ключевым сервисам и edge-регионам." />
        <AdminSubnav />

        <div className="admin-kpi-grid">
          <Card className="admin-kpi-card">
            <p className="small">API-шлюз</p>
            <p className="h2">98.4%</p>
            <p className="text-secondary">Стабильно</p>
          </Card>
          <Card className="admin-kpi-card">
            <p className="small">База данных</p>
            <p className="h2">100%</p>
            <p className="text-secondary">Оптимально</p>
          </Card>
          <Card className="admin-kpi-card">
            <p className="small">Redis Cache</p>
            <p className="h2">99.1%</p>
            <p className="text-secondary">Активен</p>
          </Card>
        </div>

        <Card>
          <h2 className="h3">Системные события и логи</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Время</th>
                  <th>Источник</th>
                  <th>Критичность</th>
                  <th>Описание</th>
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
