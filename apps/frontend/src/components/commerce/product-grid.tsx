import { StorefrontProduct } from "@/lib/storefront";
import ProductCard from "./product-card";

export default function ProductGrid({ products }: { products: StorefrontProduct[] }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
