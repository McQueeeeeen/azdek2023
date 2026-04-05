import AccountShell from "@/components/account/account-shell";
import Button from "@/components/ui/button";

export default function AccountPaymentMethodsPage() {
  return (
    <AccountShell active="/account/payment-methods" title="Payment methods" subtitle="Saved cards and payment preferences.">
      <div className="ui-card">
        <p className="text-secondary">No saved payment method.</p>
        <Button variant="secondary">Add payment method</Button>
      </div>
    </AccountShell>
  );
}
