import Card from "../ui/card";

interface CartItemView {
  id: string;
  quantity: number;
  lineTotal: number;
  unitPrice: number;
  productVariant: {
    title: string;
    product: { name: string };
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
  return (
    <Card className="cart-item">
      <div className="cart-item-main">
        <p className="h3">{item.productVariant.product.name}</p>
        <p className="text-secondary">{item.productVariant.title}</p>
        <p className="small">Цена за единицу: {item.unitPrice} KZT</p>
      </div>
      <div className="cart-item-meta">
        <div className="cart-item-actions">
          <button
            type="button"
            className="ui-button ui-button-secondary"
            disabled={busy || item.quantity <= 1}
            onClick={() => onDecrease(item.id, item.quantity)}
          >
            −
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
        <p>Кол-во: {item.quantity}</p>
        <p>{item.lineTotal} KZT</p>
        <button type="button" className="cart-remove-link" disabled={busy} onClick={() => onRemove(item.id)}>
          Удалить
        </button>
      </div>
    </Card>
  );
}
