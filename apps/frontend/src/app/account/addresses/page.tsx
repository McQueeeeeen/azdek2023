import AccountShell from "@/components/account/account-shell";
import Button from "@/components/ui/button";

export default function AccountAddressesPage() {
  return (
    <AccountShell active="/account/addresses" title="Адреса доставки" subtitle="Управляйте адресами для быстрого оформления заказа.">
      <div className="ui-card">
        <p className="text-secondary">Основной адрес не добавлен.</p>
        <Button variant="secondary">Добавить адрес</Button>
      </div>
    </AccountShell>
  );
}
