import Section from "@/components/ui/section";
import Container from "@/components/ui/container";
import Card from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import AdminSubnav from "@/components/admin/admin-subnav";
import Button from "@/components/ui/button";

const NODES = [
  { name: "node-us-east-01", ip: "10.0.42.129", region: "AWS US-East-1", status: "Активна", cpu: "24%", ram: "4.2 / 16 GB" },
  { name: "node-eu-west-04", ip: "172.16.8.41", region: "GCP EU-West-2", status: "Предупреждение", cpu: "91%", ram: "14.8 / 16 GB" },
  { name: "node-ap-south-02", ip: "192.168.1.12", region: "AWS AP-South-1", status: "Синхронизация", cpu: "12%", ram: "2.1 / 16 GB" },
  { name: "node-us-west-09", ip: "10.0.12.201", region: "AWS US-West-2", status: "Активна", cpu: "56%", ram: "8.9 / 16 GB" },
];

export default function AdminNodesPage() {
  return (
    <Section>
      <Container className="admin-shell">
        <PageHeader title="Серверные ноды" subtitle="Контроль регионов, нагрузки и health-статуса вычислительных узлов." />
        <AdminSubnav />

        <div className="admin-kpi-grid">
          <Card className="admin-kpi-card">
            <p className="small">Всего нод</p>
            <p className="h2">1,284</p>
            <p className="text-secondary">+12% за последние 30 дней</p>
          </Card>
          <Card className="admin-kpi-card">
            <p className="small">Средняя загрузка</p>
            <p className="h2">42.8%</p>
            <p className="text-secondary">По активным кластерам</p>
          </Card>
          <Card className="admin-kpi-card">
            <p className="small">Аптайм</p>
            <p className="h2">99.98%</p>
            <p className="text-secondary">Глобальный SLA</p>
          </Card>
        </div>

        <Card className="admin-panel">
          <div className="admin-panel-head">
            <h2 className="h3">Реестр нод</h2>
            <Button variant="secondary">Добавить ноду</Button>
          </div>
          <div className="admin-panel-body admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Нода</th>
                  <th>Регион</th>
                  <th>Статус</th>
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
                    <td>
                      <span
                        className={`status-pill ${
                          node.status === "Активна" ? "ok" : node.status === "Синхронизация" ? "warn" : "error"
                        }`}
                      >
                        {node.status}
                      </span>
                    </td>
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
