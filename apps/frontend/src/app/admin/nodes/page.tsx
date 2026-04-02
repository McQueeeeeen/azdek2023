import Section from "@/components/ui/section";
import Container from "@/components/ui/container";
import Card from "@/components/ui/card";
import AdminSubnav from "@/components/admin/admin-subnav";

const NODES = [
  { name: "node-us-east-01", region: "AWS US-East-1", status: "Активна", cpu: "24%", ram: "4.2 / 16 GB" },
  { name: "node-eu-west-04", region: "GCP EU-West-2", status: "Предупреждение", cpu: "91%", ram: "14.8 / 16 GB" },
];

export default function AdminNodesPage() {
  return (
    <Section>
      <Container className="grid">
        <Card className="grid">
          <h1>Серверные ноды</h1>
          <AdminSubnav />
        </Card>

        <Card className="grid">
          <h2>Реестр нод</h2>
          <table>
            <thead>
              <tr>
                <th align="left">Нода</th>
                <th align="left">Регион</th>
                <th align="left">Статус</th>
                <th align="left">CPU</th>
                <th align="left">RAM</th>
              </tr>
            </thead>
            <tbody>
              {NODES.map((node) => (
                <tr key={node.name}>
                  <td>{node.name}</td>
                  <td>{node.region}</td>
                  <td>{node.status}</td>
                  <td>{node.cpu}</td>
                  <td>{node.ram}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Container>
    </Section>
  );
}