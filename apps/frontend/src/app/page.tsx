import Link from "next/link";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import SmartImage from "@/components/ui/smart-image";
import { getProductMedia } from "@/lib/product-media";

const PAIN_POINTS = ["потраченное время", "лишние усилия", "нулевой результат"];

const FORCE_POINTS = [
  "Ты не должен мыть дважды",
  "Ты не должен тратить больше",
  "Ты не должен сомневаться",
];

const SOLUTION_POINTS = ["жир уходит", "налет исчезает", "запах убирается"];

const CATALOG_TASKS = [
  "Кухня - жир и нагар",
  "Ванная - налет и бактерии",
  "Полы - грязь и следы",
  "Ткань - пятна и запах",
];

const FEATURED = [
  { slug: "azdek-laundry-gel", name: "Гель для стирки Color", tag: "Ткань" },
  { slug: "azdek-softener-fresh", name: "Кондиционер Fresh", tag: "Свежесть" },
  { slug: "azdek-dish-liquid-citrus", name: "Средство для посуды Citrus", tag: "Кухня" },
];

const WHY_AZDEK = [
  { title: "Сильнее масс-маркета", text: "Ты чувствуешь разницу сразу" },
  { title: "Экономия времени", text: "Сделал один раз - и все" },
  { title: "Четкий результат", text: "Без почти чисто" },
  { title: "Ничего лишнего", text: "Только то, что реально работает" },
];

export default function HomePage() {
  const heroMedia = getProductMedia("azdek-laundry-gel");

  return (
    <Section>
      <Container className="grid home-grid-ready">
        <Card className="hero-card hero-card-premium">
          <p className="small">AZDEK · ЧИСТО ПО ФАКТУ</p>
          <h1 className="h1">Грязь не уходит сама</h1>
          <p className="text-secondary hero-copy">Плохая химия - это:</p>
          <div className="promo-strip-list">
            {PAIN_POINTS.map((item) => (
              <span key={item} className="promo-chip">— {item}</span>
            ))}
          </div>
          <p className="text-secondary hero-copy">Возьми средство, которое работает с первого раза</p>
          <p className="text-secondary hero-copy">Azdek - чисто по факту, не по обещаниям</p>
          <div className="hero-actions">
            <Link href="/catalog">
              <Button>Выбрать средство</Button>
            </Link>
          </div>
          <div className="promo-strip-list">
            {FORCE_POINTS.map((item) => (
              <span key={item} className="promo-chip">{item}</span>
            ))}
          </div>
        </Card>

        <Card className="hero-visual-card">
          <SmartImage
            className="hero-product-image"
            src={heroMedia.hero}
            fallbackSrc="/media/laundry-gel.svg"
            alt="AZDEK Laundry Gel"
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
            priority
          />
        </Card>

        <Card className="hits-section">
          <div className="page-header">
            <h2 className="h2">Проблема не в тебе. Проблема в слабых средствах.</h2>
          </div>
          <p className="text-secondary">Мы убрали все, что не работает. Оставили только результат.</p>
          <div className="promo-strip-list">
            {SOLUTION_POINTS.map((item) => (
              <span key={item} className="promo-chip">— {item}</span>
            ))}
          </div>
          <p className="text-secondary">Без повторов. Без лишних движений.</p>
        </Card>

        <Card className="hits-section">
          <div className="page-header">
            <h2 className="h2">Каждое средство - под конкретную задачу</h2>
            <Link href="/catalog">
              <Button variant="ghost">Смотреть решения</Button>
            </Link>
          </div>

          <div className="promo-strip-list">
            {CATALOG_TASKS.map((item) => (
              <span key={item} className="promo-chip">{item}</span>
            ))}
          </div>

          <div className="hits-grid">
            {FEATURED.map((item) => {
              const media = getProductMedia(item.slug);
              return (
                <article key={item.slug} className="hit-item">
                  <div className="hit-image-wrap">
                    <SmartImage
                      className="hit-image"
                      src={media.card}
                      fallbackSrc="/media/laundry-gel.svg"
                      alt={item.name}
                      width={560}
                      height={700}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                    />
                  </div>
                  <p className="small">{item.tag}</p>
                  <h3 className="h3">{item.name}</h3>
                  <Link href={`/catalog/${item.slug}`}>
                    <Button variant="secondary" className="full-width">
                      Перейти к товару
                    </Button>
                  </Link>
                </article>
              );
            })}
          </div>
        </Card>

        <Card className="trust-band">
          <div className="page-header">
            <h2 className="h2">Почему Azdek</h2>
          </div>
          <div className="trust-grid" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
            {WHY_AZDEK.map((item) => (
              <article key={item.title} className="trust-item">
                <h3 className="h3">{item.title}</h3>
                <p className="text-secondary">{item.text}</p>
              </article>
            ))}
          </div>
        </Card>

        <Card className="hero-card hero-card-premium">
          <h2 className="h2">Перестань бороться с грязью. Начни ее убирать.</h2>
          <p className="text-secondary hero-copy">Azdek - результат, а не процесс.</p>
          <div className="hero-actions">
            <Link href="/catalog">
              <Button>Купить сейчас</Button>
            </Link>
          </div>
          <div className="promo-strip-list">
            <span className="promo-chip">Ты покупаешь сэкономленное время</span>
            <span className="promo-chip">Ты покупаешь отсутствие раздражения</span>
            <span className="promo-chip">Ты покупаешь быстрый результат</span>
          </div>
        </Card>
      </Container>
    </Section>
  );
}
