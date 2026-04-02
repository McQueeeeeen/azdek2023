import Link from "next/link";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";

const PROMO_OFFERS = [
  "Экономия до 60 стирок на одной канистре",
  "Подходит для всех типов тканей",
  "Разработано химиком, а не маркетологами",
];

const ADVANTAGES = [
  { title: "Концентрированная формула", text: "Меньше расход — больше стирок." },
  { title: "Без лишних наполнителей", text: "Вы платите за результат, а не за маркетинг." },
  { title: "Разработано специалистом", text: "Не массовое производство, а продуманная формула." },
];

const HITS = [
  { name: "Гель для стирки Color", tag: "Хит продаж", image: "/media/laundry-gel.svg" },
  { name: "Кондиционер Fresh", tag: "Популярно", image: "/media/softener-fresh.svg" },
  { name: "Средство для посуды Citrus", tag: "Для кухни", image: "/media/dish-liquid-citrus.svg" },
];

const TRUST_POINTS = [
  { title: "4.9/5 в отзывах", text: "Проверенные оценки покупателей по ключевым SKU." },
  { title: "Отгрузка в день заказа", text: "Для заказов, созданных до 16:00 в рабочие дни." },
  { title: "Контроль качества", text: "Контроль партий и стабильные формулы перед отгрузкой." },
  { title: "Поддержка B2B", text: "Коммерческие предложения, счета и персональные условия." },
];

export default function HomePage() {
  return (
    <Section>
      <Container className="grid home-grid-ready">
        <Card className="promo-strip">
          <p className="small promo-strip-label">Акции и условия</p>
          <div className="promo-strip-list">
            {PROMO_OFFERS.map((offer) => (
              <span key={offer} className="promo-chip">
                {offer}
              </span>
            ))}
          </div>
        </Card>

        <Card className="hero-card hero-card-premium">
          <p className="small">Казахстан · Бытовая химия AZDEK</p>
          <h1 className="h1">Концентрированные средства для стирки, разработанные химиком</h1>
          <p className="text-secondary hero-copy">Чистота с первого раза без переплаты за воду и рекламу</p>
          <div className="hero-actions">
            <Link href="/catalog">
              <Button>Смотреть продукцию</Button>
            </Link>
            <Link href="/checkout">
              <Button variant="secondary">Перейти к оформлению</Button>
            </Link>
          </div>
        </Card>

        <Card className="hero-visual-card">
          <img className="hero-product-image" src="/media/laundry-gel.svg" alt="AZDEK Laundry Gel" />
        </Card>

        <div className="advantages-grid">
          <Card className="home-feature-card">
            <h2 className="h3">Почему это лучше обычных средств</h2>
            <p className="text-secondary">Сравнение не в рекламе, а в результате и себестоимости одной стирки.</p>
          </Card>
          {ADVANTAGES.map((item) => (
            <Card key={item.title} className="home-feature-card">
              <h2 className="h3">{item.title}</h2>
              <p className="text-secondary">{item.text}</p>
            </Card>
          ))}
        </div>

        <Card className="trust-band">
          <div className="page-header">
                <h2 className="h2">Почему нам доверяют</h2>
                <Link href="/catalog">
                  <Button variant="secondary">Перейти в каталог</Button>
                </Link>
              </div>
          <div className="trust-grid">
            {TRUST_POINTS.map((item) => (
              <article key={item.title} className="trust-item">
                <h3 className="h3">{item.title}</h3>
                <p className="text-secondary">{item.text}</p>
              </article>
            ))}
          </div>
        </Card>

        <Card className="hits-section">
          <div className="page-header">
            <h2 className="h2">Наша продукция</h2>
            <Link href="/catalog">
              <Button variant="ghost">Смотреть всё</Button>
            </Link>
          </div>
          <div className="hits-grid">
            {HITS.map((item) => (
              <article key={item.name} className="hit-item">
                <div className="hit-image-wrap">
                  <img className="hit-image" src={item.image} alt={item.name} loading="lazy" />
                </div>
                <p className="small">{item.tag}</p>
                <h3 className="h3">{item.name}</h3>
                <Link href="/catalog">
                  <Button variant="secondary" className="full-width">
                    Смотреть товар
                  </Button>
                </Link>
              </article>
            ))}
          </div>
        </Card>

        <Card className="trust-band">
          <div className="page-header">
            <h2 className="h2">Как использовать</h2>
          </div>
          <div className="trust-grid">
            <article className="trust-item">
              <h3 className="h3">1. Добавьте дозировку</h3>
              <p className="text-secondary">Добавьте нужный объём средства согласно инструкции на упаковке.</p>
            </article>
            <article className="trust-item">
              <h3 className="h3">2. Запустите стирку</h3>
              <p className="text-secondary">Выберите привычный режим и температуру для вашего типа ткани.</p>
            </article>
            <article className="trust-item">
              <h3 className="h3">3. Получите результат</h3>
              <p className="text-secondary">Чистое бельё без лишнего расхода и резкого запаха.</p>
            </article>
            <article className="trust-item">
              <h3 className="h3">Простая схема</h3>
              <p className="text-secondary">Понятная инструкция на каждой карточке и упаковке.</p>
            </article>
          </div>
        </Card>

        <Card className="promo-strip">
          <p className="small promo-strip-label">Попробуйте и сравните результат уже после первой стирки</p>
          <div className="hero-actions">
            <Link href="/catalog">
              <Button>Перейти в каталог</Button>
            </Link>
          </div>
        </Card>
      </Container>
    </Section>
  );
}
