import Link from "next/link";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import Button from "@/components/ui/button";
import ProductGrid from "@/components/commerce/product-grid";
import { getStorefrontProducts } from "@/lib/storefront";

export default async function HomePage() {
  const products = await getStorefrontProducts();
  const featured = products.slice(0, 3);

  const categories = [
    { title: "Laundry", text: "Formulas for daily fabric care and stain removal.", href: "/catalog?category=laundry" },
    { title: "Kitchen", text: "Degreasers and fast-clean solutions for cooking zones.", href: "/catalog?category=kitchen" },
    { title: "Bathroom", text: "Anti-scale and shine products for wet areas.", href: "/catalog?category=bathroom" },
    { title: "Universal", text: "One-bottle routines for fast all-home cleaning.", href: "/catalog" },
  ];

  const benefits = [
    { title: "Fast action", text: "High concentration means less scrubbing and faster result." },
    { title: "Clear choice", text: "Simple categories and filters to find the right product fast." },
    { title: "Repeat-ready", text: "One-click reorder flow from account and cart history." },
  ];

  return (
    <>
      <Section>
        <Container className="grid" style={{ gap: 18 }}>
          <div className="hero-block">
            <div className="grid" style={{ gap: 14, alignContent: "center" }}>
              <p className="small" style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Adzek household care
              </p>
              <h1 className="h1">Clean home products that convert routine into result.</h1>
              <p className="text-secondary body" style={{ maxWidth: 560 }}>
                Production-ready e-commerce for practical cleaning supplies: clear structure, fast scan, and direct path to purchase.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link href="/catalog">
                  <Button>Go to catalog</Button>
                </Link>
                <Link href="/promotions">
                  <Button variant="secondary">View promotions</Button>
                </Link>
              </div>
            </div>
            <div className="hero-media">
              <img src="/media/laundry-gel-final.jpg" alt="Adzek product" />
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid" style={{ gap: 16 }}>
          <div className="page-header">
            <h2 className="h2">Shop by category</h2>
            <Link href="/catalog">
              <Button variant="outline">Open full catalog</Button>
            </Link>
          </div>
          <div className="category-grid">
            {categories.map((category) => (
              <article key={category.title} className="category-tile">
                <h3 className="h4">{category.title}</h3>
                <p className="text-secondary">{category.text}</p>
                <Link href={category.href}>
                  <Button variant="secondary">Explore</Button>
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid" style={{ gap: 16 }}>
          <div className="page-header">
            <div>
              <h2 className="h2">Featured products</h2>
              <p className="text-secondary">Reusable product card system for 100+ SKUs.</p>
            </div>
            <Link href="/catalog">
              <Button variant="outline">View all products</Button>
            </Link>
          </div>
          <ProductGrid products={featured} />
        </Container>
      </Section>

      <Section>
        <Container className="grid" style={{ gap: 16 }}>
          <h2 className="h2">Why customers choose Adzek</h2>
          <div className="benefits-grid">
            {benefits.map((benefit) => (
              <article key={benefit.title} className="ui-card">
                <h3 className="h4">{benefit.title}</h3>
                <p className="text-secondary">{benefit.text}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
