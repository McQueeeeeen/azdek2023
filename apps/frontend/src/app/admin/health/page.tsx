import Section from "@/components/ui/section";
import Container from "@/components/ui/container";
import Card from "@/components/ui/card";
import AdminSubnav from "@/components/admin/admin-subnav";

const EVENTS = [
  { time: "14:02:21", source: "AuthSvc-Node4", severity: "Предупреждение", detail: "Высокая загрузка памяти." },
  { time: "13:58:12", source: "CDN-Edge-12", severity: "Инфо", detail: "Очистка CDN-кэша завершена." },
];

export default function AdminHealthPage() {
  return (
    <Section>
      <Container className="grid">
        <Card className="grid">
          <h1>Состояние инфраструктуры</h1>
          <AdminSubnav />
        </Card>

        <Card className="grid">
          <h2>События</h2>
          <table>
            <thead>
              <tr>
                <th align="left">Время</th>
                <th align="left">Источник</th>
                <th align="left">Критичность</th>
                <th align="left">Описание</th>
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
        </Card>
      </Container>
    </Section>
  );
}