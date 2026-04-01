import Link from "next/link";
import { CatalogProduct } from "@/lib/api";
import Card from "../ui/card";
import Button from "../ui/button";
import PriceBlock from "./price-block";

export default function ProductCard({ product }: { product: CatalogProduct }) {
  const firstVariant = product.variants[0];

  return (
    <Card className="product-card">
      <div className="product-image-placeholder" aria-hidden />
      <div className="product-card-body">
        <p className="small">{product.category.name}</p>
        <h3 className="h3">{product.name}</h3>
        <p className="text-secondary product-description">{product.description}</p>
        <PriceBlock amount={firstVariant?.price ?? 0} currency={firstVariant?.currency ?? "KZT"} />
      </div>
      <Link href={`/catalog/${product.slug}`}>
        <Button variant="secondary" className="full-width">
          Открыть товар
        </Button>
      </Link>
    </Card>
  );
}
