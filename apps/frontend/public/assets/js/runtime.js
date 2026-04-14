import { ready, ensureNoBodyTransformForSticky } from './modules/core.js';
import { ensureGlobalHeader, decorateHeader, wireRoutes } from './modules/header.js';
import { applyAuthGuards, wireLogout, wireLoginRegister } from './modules/auth.js';
import { cartStore, wireAddToCart, renderCartPage, wireCheckout, ensureCartLoaded } from './modules/cart.js';
import { hydrateAccountPage, wireAccountSaveDelegation, hydrateNotificationSettings } from './modules/account.js';
import { hydrateCatalogFromBackend, hydrateHomeFeatured, hydrateProductPage, wireCatalogFilters, wireCatalogRouting, wireOrderConfirmedInteractions } from './modules/pages.js';

ready(async () => {
  ensureNoBodyTransformForSticky();
  ensureGlobalHeader();
  wireRoutes();

  applyAuthGuards();
  wireLoginRegister();
  wireLogout({ clearCart: () => cartStore.clear() });

  wireAddToCart();
  renderCartPage();
  wireCheckout();

  hydrateAccountPage();
  wireAccountSaveDelegation();
  hydrateNotificationSettings();

  await hydrateCatalogFromBackend();
  await hydrateHomeFeatured();
  await hydrateProductPage();

  wireCatalogFilters();
  wireCatalogRouting();
  wireOrderConfirmedInteractions();

  await ensureCartLoaded();

  decorateHeader({ getCartCount: () => cartStore.totals(cartStore.read()).count || cartStore.read().items.reduce((acc, i) => acc + i.quantity, 0) });
});
