import AccountShell from "@/components/account/account-shell";

export default function AccountNotificationsPage() {
  return (
    <AccountShell active="/account/notifications" title="Notifications" subtitle="Control updates from store and delivery.">
      <label className="filter-check"><input type="checkbox" defaultChecked /> Order status updates</label>
      <label className="filter-check"><input type="checkbox" defaultChecked /> Promotions and discounts</label>
      <label className="filter-check"><input type="checkbox" /> Product restock alerts</label>
    </AccountShell>
  );
}
