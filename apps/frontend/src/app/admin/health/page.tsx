import Section from "@/components/ui/section";
import Container from "@/components/ui/container";
import Card from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import AdminSubnav from "@/components/admin/admin-subnav";

const EVENTS = [
  { time: "14:02:21", source: "AuthSvc-Node4", severity: "Предупреждение", detail: "Высокая загрузка памяти на узле аутентификации." },
  { time: "13:58:12", source: "CDN-Edge-12", severity: "Инфо", detail: "Очистка CDN-кэша для assets-v3 завершена." },
  { time: "13:45:00", source: "Scheduler", severity: "Инфо", detail: "Плановая health-проверка завершена без ошибок." },
  { time: "13:12:44", source: "Inventory-DB", severity: "Тревога", detail: "Кратковременный обрыв репликации, восстановлено." },
];

export default function AdminHealthPage() {
  return (
    <Section>
      <Container className="admin-shell">
        <PageHeader title="Состояние инфраструктуры" subtitle="Живая телеметрия по сервисам, edge-регионам и стабильности API." />
        <AdminSubnav />

        <div className="admin-kpi-grid">
          <Card className="admin-kpi-card">
            <p className="small">API-шлюз</p>
            <p className="h2">98.4%</p>
            <p className="text-secondary">Стабильная обработка запросов</p>
          </Card>
          <Card className="admin-kpi-card">
            <p className="small">База данных</p>
            <p className="h2">100%</p>
            <p className="text-secondary">Репликация и бэкапы в норме</p>
          </Card>
          <Card className="admin-kpi-card">
            <p className="small">Redis Cache</p>
            <p className="h2">99.1%</p>
            <p className="text-secondary">Низкая задержка по ключевым запросам</p>
          </Card>
        </div>

        <Card className="admin-panel">
          <div className="admin-panel-head">
            <h2 className="h3">Системные события</h2>
            <span className="status-pill ok">Мониторинг активен</span>
          </div>
          <div className="admin-panel-body admin-table-wrap">
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
                    <td>
                      <span
                        className={`status-pill ${
                          event.severity === "Инфо" ? "ok" : event.severity === "Предупреждение" ? "warn" : "error"
                        }`}
                      >
                        {event.severity}
                      </span>
                    </td>
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
