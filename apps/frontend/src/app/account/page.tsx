import Link from "next/link";
import Button from "@/components/ui/button";
import AccountShell from "@/components/account/account-shell";

export default function AccountPage() {
  return (
    <AccountShell active="/account" title="Account" subtitle="Manage profile, orders and saved items.">
      <div className="grid" style={{ gap: 10 }}>
        <p className="text-secondary">Quick actions</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link href="/account/orders"><Button variant="secondary">Track orders</Button></Link>
          <Link href="/account/profile"><Button variant="secondary">Edit profile</Button></Link>
          <Link href="/catalog"><Button>Continue shopping</Button></Link>
        </div>
      </div>
    </AccountShell>
  );
}
