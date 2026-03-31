import Card from "../ui/card";

interface CartItemView {
  id: string;
  quantity: number;
  lineTotal: number;
  productVariant: {
    title: string;
    product: { name: string };
  };
}

export default function CartItem({ item }: { item: CartItemView }) {
  return (
    <Card className="cart-item">
      <div>
        <p className="h3">{item.productVariant.product.name}</p>
        <p className="text-secondary">{item.productVariant.title}</p>
      </div>
      <div className="cart-item-meta">
        <p>Кол-во: {item.quantity}</p>
        <p>{item.lineTotal} KZT</p>
      </div>
    </Card>
  );
}
