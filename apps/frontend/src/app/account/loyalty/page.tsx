import AccountShell from "@/components/account/account-shell";
import Button from "@/components/ui/button";

export default function AccountLoyaltyPage() {
  return (
    <AccountShell active="/account/loyalty" title="Программа лояльности" subtitle="Накопления и персональные бонусы.">
      <div className="ui-card" style={{ gap: 8 }}>
        <p className="small">Текущий уровень</p>
        <h3 className="h3">Базовый</h3>
        <p className="text-secondary">До следующего уровня: 18 000 ₸ покупок.</p>
        <Button variant="secondary">Посмотреть условия</Button>
      </div>
    </AccountShell>
  );
}
