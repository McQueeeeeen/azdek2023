import Container from "../ui/container";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <Container className="site-footer-inner">
        <p>Azdek Elemental</p>
        <div className="footer-links">
          <Link href="/catalog">Catalog</Link>
          <Link href="/checkout">Checkout</Link>
          <Link href="/account">Support</Link>
        </div>
      </Container>
    </footer>
  );
}
