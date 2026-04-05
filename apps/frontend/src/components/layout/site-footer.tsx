import Container from "../ui/container";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <Container className="site-footer-inner">
        <p>Adzek Home Care</p>
        <div className="footer-links">
          <Link href="/catalog">Catalog</Link>
          <Link href="/checkout">Checkout</Link>
          <Link href="/support">Support</Link>
          <Link href="/about">About</Link>
        </div>
      </Container>
    </footer>
  );
}
