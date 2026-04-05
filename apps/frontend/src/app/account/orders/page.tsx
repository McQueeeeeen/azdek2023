import Link from "next/link";
import AccountShell from "@/components/account/account-shell";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";

export default function AccountOrdersPage() {
  return (
    <AccountShell active="/account/orders" title="Orders" subtitle="History and status of your purchases.">
      <EmptyState
        title="No orders yet"
        description="When you place your first order, it will appear here."
        action={
          <Link href="/catalog">
            <Button>Go to catalog</Button>
          </Link>
        }
      />
    </AccountShell>
  );
}
