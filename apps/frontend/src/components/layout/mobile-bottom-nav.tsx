import Link from "next/link";

export default function MobileBottomNav() {
  return (
    <nav
      className="mobile-bottom-nav"
      aria-label="\u041C\u043E\u0431\u0438\u043B\u044C\u043D\u0430\u044F \u043D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044F"
    >
      <Link href="/">{"\u0413\u043B\u0430\u0432\u043D\u0430\u044F"}</Link>
      <Link href="/catalog">{"\u041A\u0430\u0442\u0430\u043B\u043E\u0433"}</Link>
      <Link href="/cart">{"\u041A\u043E\u0440\u0437\u0438\u043D\u0430"}</Link>
      <Link href="/account">{"\u041A\u0430\u0431\u0438\u043D\u0435\u0442"}</Link>
    </nav>
  );
}

