import Card from "../ui/card";
import { formatMoney } from "@/lib/money";
import { getProductMedia } from "@/lib/product-media";
import SmartImage from "../ui/smart-image";

interface CartItemView {
  id: string;
  quantity: number;
  lineTotal: number;
  unitPrice: number;
  productVariant: {
    title: string;
    product: { name: string; slug?: string };
  };
}

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
  busy,
}: {
  item: CartItemView;
  onIncrease: (itemId: string, quantity: number) => void;
  onDecrease: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  busy?: boolean;
}) {
  const media = getProductMedia(item.productVariant.product.slug ?? "");

  return (
    <Card className="cart-item">
      <div style={{ display: "grid", gridTemplateColumns: "96px 1fr", gap: 12, alignItems: "center" }}>
        <div style={{ position: "relative", width: 96, height: 96, borderRadius: 10, overflow: "hidden", background: "var(--surface-2)" }}>
          <SmartImage src={media.card} fallbackSrc="/media/laundry-gel-final.jpg" alt={item.productVariant.product.name} fill sizes="96px" />
        </div>

        <div className="cart-item-main">
          <p className="h4">{item.productVariant.product.name}</p>
          <p className="text-ink-2">{item.productVariant.title}</p>
          <p className="small">Unit price: {formatMoney(item.unitPrice, "KZT")}</p>
        </div>
      </div>

      <div className="cart-item-meta">
        <div className="cart-item-actions">
          <button
            type="button"
            className="ui-button ui-button-secondary"
            disabled={busy || item.quantity <= 1}
            onClick={() => onDecrease(item.id, item.quantity)}
          >
            -
          </button>
          <span>{item.quantity}</span>
          <button
            type="button"
            className="ui-button ui-button-secondary"
            disabled={busy}
            onClick={() => onIncrease(item.id, item.quantity)}
          >
            +
          </button>
        </div>
        <p>{formatMoney(item.lineTotal, "KZT")}</p>
        <button type="button" className="cart-remove-link" disabled={busy} onClick={() => onRemove(item.id)}>
          Remove
        </button>
      </div>
    </Card>
  );
}
