import Link from "next/link";
import Container from "../ui/container";
import Button from "../ui/button";

const NAV_ITEMS = [
  { href: "/", label: "\u0413\u043B\u0430\u0432\u043D\u0430\u044F" },
  { href: "/catalog", label: "\u041A\u0430\u0442\u0430\u043B\u043E\u0433" },
  { href: "/cart", label: "\u041A\u043E\u0440\u0437\u0438\u043D\u0430" },
  { href: "/checkout", label: "\u041E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u0435" },
  { href: "/login", label: "\u0412\u0445\u043E\u0434" },
  { href: "/account", label: "\u041A\u0430\u0431\u0438\u043D\u0435\u0442" },
];

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Container className="site-header-inner">
        <Link className="brand-mark" href="/">
          AZDEK
        </Link>
        <nav
          className="desktop-nav"
          aria-label="\u041E\u0441\u043D\u043E\u0432\u043D\u0430\u044F \u043D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044F"
        >
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/catalog">
          <Button className="header-cta">
            {"\u041F\u043E\u043A\u0443\u043F\u0430\u0442\u044C"}
          </Button>
        </Link>
      </Container>
    </header>
  );
}

