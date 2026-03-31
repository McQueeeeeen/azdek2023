import { CatalogProduct } from "@/lib/api";
import ProductCard from "./product-card";

export default function ProductGrid({ products }: { products: CatalogProduct[] }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

