import fs from "node:fs";
import path from "node:path";
import Script from "next/script";
import { unstable_noStore as noStore } from "next/cache";
import type { Metadata } from "next";

type ParsedStitch = {
  title?: string;
  body: string;
  styleBlocks: string[];
  scriptSrcs: string[];
  tailwindConfig?: string;
  fontStylesheets: string[];
};

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function normalizeTailwindConfig(config?: string): string | undefined {
  if (!config) return undefined;
  return config.replace(
    /\btailwind\.config\s*=/,
    "window.tailwind = window.tailwind || {}; window.tailwind.config ="
  );
}

function parseStitchHtml(html: string): ParsedStitch {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1]?.trim() ?? html;

  const styleBlocks = Array.from(html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)).map((m) => m[1].trim());
  const scriptSrcs = unique(
    Array.from(html.matchAll(/<script[^>]*src=["']([^"']+)["'][^>]*><\/script>/gi)).map((m) => m[1].trim())
  );
  const fontStylesheets = unique(
    Array.from(html.matchAll(/<link[^>]*href=["']([^"']+)["'][^>]*>/gi))
      .map((m) => m[1].trim())
      .filter((href) => href.includes("fonts.googleapis.com"))
  );
  const tailwindConfig = html.match(/<script[^>]*id=["']tailwind-config["'][^>]*>([\s\S]*?)<\/script>/i)?.[1]?.trim();

  return { title, body, styleBlocks, scriptSrcs, tailwindConfig, fontStylesheets };
}

function stitchFilePath(folder: string): string {
  return path.resolve(process.cwd(), "..", "..", "design", "stitch_order_success_azure_clean", folder, "code.html");
}

function readStitch(folder: string): ParsedStitch {
  const filePath = stitchFilePath(folder);
  const html = fs.readFileSync(filePath, "utf8");
  return parseStitchHtml(html);
}

export function getStitchMetadata(folder: string, fallbackDescription = "Adzek2023"): Metadata {
  const parsed = readStitch(folder);
  return {
    title: parsed.title || "Adzek2023",
    description: fallbackDescription,
  };
}

export function StitchPage({ folder }: { folder: string }) {
  noStore();

  const parsed = readStitch(folder);
  const safeTailwindConfig = normalizeTailwindConfig(parsed.tailwindConfig);
  const stylesheetImports = parsed.fontStylesheets.map((href) => `@import url("${href}");`).join("\n");
  const clinicalEditorialOverrides = `
:root {
  --ce-surface: #f9f9f9;
  --ce-surface-low: #f4f3f3;
  --ce-surface-lowest: #ffffff;
  --ce-surface-high: #e8e8e8;
  --ce-primary: #088ea0;
  --ce-primary-deep: #005d69;
  --ce-tertiary: #c1763a;
  --ce-on-surface: #1a1c1c;
  --ce-muted: #3e494b;
  --ce-ghost: rgba(189, 201, 203, 0.15);
  --ce-shadow-soft: 0 24px 48px rgba(26, 28, 28, 0.06);
  --ce-radius: 0.75rem;
}

html, body {
  background: var(--ce-surface) !important;
  color: var(--ce-on-surface) !important;
  font-family: "Manrope", sans-serif !important;
}

h1, h2, h3, h4, h5, h6, .font-headline, .font-serif, [class*="font-serif"] {
  font-family: "Newsreader", serif !important;
}

p, span, li, a, button, input, textarea, select, label, .font-body, .font-label {
  font-family: "Manrope", sans-serif;
}

nav {
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
}

button,
a[role="button"],
input[type="button"],
input[type="submit"] {
  border-radius: var(--ce-radius) !important;
  transition: all 160ms ease !important;
}

button:hover,
a[role="button"]:hover {
  transform: translateY(-0.5px);
}

input,
textarea,
select {
  border: 1px solid var(--ce-ghost) !important;
  border-radius: var(--ce-radius) !important;
  background: var(--ce-surface-low) !important;
  color: var(--ce-on-surface) !important;
}

input:focus,
textarea:focus,
select:focus {
  outline: none !important;
  border-color: rgba(8, 142, 160, 0.2) !important;
  box-shadow: 0 0 0 3px rgba(8, 142, 160, 0.1) !important;
  background: var(--ce-surface-lowest) !important;
}

/* No-line rule fallback: replace hard borders with ghost border */
[class*="border-"],
[style*="border: 1px solid"],
[style*="border:1px solid"] {
  border-color: var(--ce-ghost) !important;
}

/* Cards/elevated surfaces */
[class*="shadow"],
.clinical-shadow {
  box-shadow: var(--ce-shadow-soft) !important;
}

[class*="rounded"],
[class*="rounded-"] {
  border-radius: var(--ce-radius) !important;
}

/* Primary CTA consistency */
button.text-white,
a.text-white,
[class*="from-primary"][class*="to-primary"],
[class*="bg-gradient"] {
  background: linear-gradient(135deg, var(--ce-primary) 0%, var(--ce-primary-deep) 100%) !important;
  color: #fff !important;
  border: none !important;
}

/* Secondary surfaces */
[class*="bg-surface-container-low"] {
  background: var(--ce-surface-low) !important;
}
[class*="bg-surface-container-lowest"] {
  background: var(--ce-surface-lowest) !important;
}
[class*="bg-surface-container-high"] {
  background: var(--ce-surface-high) !important;
}

/* Freshness chip */
[class*="rounded-full"][class*="text-[10px]"],
[class*="badge"],
[class*="chip"] {
  border-radius: 9999px !important;
}
`;
  const mergedStyles = `
${stylesheetImports}
${parsed.styleBlocks.join("\n\n")}
${clinicalEditorialOverrides}

html.stitch-loading body {
  opacity: 0;
}

body.stitch-ready {
  opacity: 1;
  transition: opacity 140ms ease-out;
}

body.stitch-nav-out {
  opacity: 0;
  transition: opacity 100ms ease-in;
}
`;

  const tailwindCdn = parsed.scriptSrcs.find((src) => src.includes("cdn.tailwindcss.com"));
  const otherScripts = parsed.scriptSrcs.filter((src) => src !== tailwindCdn);

  return (
    <>
      {safeTailwindConfig ? (
        <Script id={`tailwind-config-${folder}`} strategy="beforeInteractive">
          {safeTailwindConfig}
        </Script>
      ) : null}

      {tailwindCdn ? <Script src={tailwindCdn} strategy="beforeInteractive" /> : null}

      <Script id={`stitch-loading-${folder}`} strategy="beforeInteractive">{`
        document.documentElement.classList.add("stitch-loading");
      `}</Script>

      {otherScripts.map((src) => (
        <Script key={`${folder}-${src}`} src={src} strategy="afterInteractive" />
      ))}

      <Script id={`stitch-actions-${folder}`} strategy="afterInteractive">{`
        (() => {
          const normalize = (v) => (v || "").toLowerCase().replace(/\s+/g, " ").trim();
          const placeholderPattern = /\{\{\s*data:screen:[^}]+\}\}/i;

          const isPlaceholderHref = (href) => {
            const value = (href || "").trim();
            if (!value || value === "#") return true;
            return placeholderPattern.test(value) || /data:screen/i.test(value) || /^screen_\d+$/i.test(value);
          };

          const collectLabel = (element) => {
            const chunks = [
              element.textContent || "",
              element.getAttribute("aria-label") || "",
              element.getAttribute("title") || "",
            ];

            const icon = element.querySelector("[data-icon]");
            if (icon instanceof HTMLElement) chunks.push(icon.getAttribute("data-icon") || "");

            const symbol = element.querySelector(".material-symbols-outlined");
            if (symbol instanceof HTMLElement) chunks.push(symbol.textContent || "");

            return chunks.join(" ").replace(/\s+/g, " ").trim();
          };

          const resolveRoute = (label) => {
            const text = normalize(label);
            if (!text) return null;

            if (/(shopping_cart|shopping_bag|add to cart|quick add|add to bag|add to ritual|buy|cart|bag|корзина|добавить в корзину)/.test(text)) return "/cart";
            if (/(checkout|confirm.*pay|complete checkout|pay\b|proceed to payment|оформить|оплатить|чекаут|перейти к оформлению)/.test(text)) return "/checkout";
            if (/(login|log in|sign in|create account|forgot password|logout|войти|выйти|регистрация)/.test(text)) return "/login";
            if (/(account_circle|person\b|account portal|account overview|личный кабинет|кабинет|my account)/.test(text)) return "/account";
            if (/(profile|edit profile|save changes|профиль|редактировать профиль)/.test(text)) return "/account/profile";
            if (/(orders|order history|view details|track order|download invoice|заказы|история заказов|детали заказа|отследить заказ)/.test(text)) return "/account/orders";
            if (/(payment methods|save payment method|способы оплаты|оплата)/.test(text)) return "/account/payment-methods";
            if (/(notification|уведомления)/.test(text)) return "/account/notifications";
            if (/(support|help|faq|contact us|contact|поддержка|помощь|контакты)/.test(text)) return "/support";
            if (/(about|philosophy|manifesto|sustainability|journal|instagram|pinterest|linkedin|science|the science|read our science|sourcing|ingredient transparency|ingredient disclosure|о нас|философия|устойчивость|состав|ингредиенты)/.test(text)) return "/about";
            if (/(promotions|offers|special offers|reductions|copy code|акции|промо|промокод)/.test(text)) return "/promotions";
            if (/(winter sanctuary|seasonal|сезонное)/.test(text)) return "/seasonal";
            if (/(dashboard|inventory|analytics|admin|админ|админ-панель)/.test(text)) return "/admin";
            if (/billing/.test(text)) return "/admin/billing";
            if (/nodes/.test(text)) return "/admin/nodes";
            if (/(view all|view all orders)/.test(text)) return "/account/orders";
            if (/(shop|collection|view all products|view all rituals|view all labs|view full archive|expand archive|start selection|spec:|catalog|laundry|kitchen|bathroom|bundles|fragrances|каталог|стирка|кухня|ванная|пополнения|ритуалы)/.test(text)) return "/catalog";
            if (/(subscription|manage my subscription|favorites|settings|избранное|настройки)/.test(text)) return "/account";
            if (/(terms of science|terms of service|privacy|privacy policy|newsletter signup|политика|условия|конфиденциальность)/.test(text)) return "/support";
            if (/(mail|share)/.test(text)) return "/support";
            if (/^(arrow_forward|east)$/.test(text)) return "/catalog";
            if (/(adzek|azure clean|linen & ether|home care|home\b|back to home|главная)/.test(text)) return "/";

            return null;
          };

          const resolveLocalAction = (label) => {
            const text = normalize(label);
            if (!text) return null;
            if (/^(\\+|-|close)$/.test(text)) return "cart_item_control";
            if (/^favorite$/.test(text)) return "favorite_toggle";
            if (/^(\\d+(\\.\\d+)?\\s?(ml|l)|\\d+(\\.\\d+)?)$/.test(text)) return "variant_select";
            if (/download pdf invoice/.test(text)) return "invoice_download";
            if (/^(monthly|quarterly)$/.test(text)) return "admin_period_toggle";
            if (
              /(generate report|add new reagent|all products|edit formulation|archive|clear all|apply filters|view specification|begin your protocol|new formula|modify schedule|synchronize updates|reset laboratory defaults|update password|delete|edit\\b|more_vert|chevron_left|chevron_right|clinical musk|eucalyptus 02|unscented|bergamot|silk & delicate|stain removal|sensitive skin|deep clean|all essentials)/.test(
                text
              )
            ) {
              return "ui_local_control";
            }
            return null;
          };

          const parseMoney = (value) => {
            const text = (value || "").trim();
            const currency = text.includes("₸") ? "₸" : (text.includes("$") ? "$" : "");
            const numberPart = text.replace(/[^\\d.,-]/g, "").replace(/,/g, ".");
            const amount = Number.parseFloat(numberPart);
            if (!Number.isFinite(amount)) return { amount: 0, currency };
            return { amount, currency };
          };

          const formatMoney = (amount, currency) => {
            if (currency === "₸") return Math.round(amount).toString() + " ₸";
            if (currency === "$") return "$" + amount.toFixed(2);
            return amount.toFixed(2);
          };

          const setupFavoriteButtons = () => {
            const buttons = Array.from(document.querySelectorAll("button")).filter((button) =>
              /\\bfavorite\\b/i.test(collectLabel(button))
            );
            for (const button of buttons) {
              if (button.getAttribute("data-stitch-favorite") === "1") continue;
              button.setAttribute("data-stitch-favorite", "1");
              button.setAttribute("aria-pressed", "false");
              button.addEventListener("click", (event) => {
                event.preventDefault();
                const active = button.getAttribute("aria-pressed") === "true";
                button.setAttribute("aria-pressed", active ? "false" : "true");
                const icon = button.querySelector(".material-symbols-outlined");
                if (icon) icon.textContent = active ? "favorite" : "favorite";
                button.style.opacity = active ? "0.7" : "1";
                button.style.transform = active ? "" : "scale(1.05)";
                window.setTimeout(() => {
                  button.style.transform = "";
                }, 120);
              });
            }
          };

          const setupVariantButtons = () => {
            const variantButtons = Array.from(document.querySelectorAll("button")).filter((button) =>
              /^(\\d+(\\.\\d+)?\\s?(ml|l)|\\d+(\\.\\d+)?)$/i.test((button.textContent || "").trim())
            );
            for (const button of variantButtons) {
              if (button.getAttribute("data-stitch-variant") === "1") continue;
              button.setAttribute("data-stitch-variant", "1");
              button.addEventListener("click", (event) => {
                event.preventDefault();
                const group = button.parentElement;
                if (!group) return;
                const siblings = Array.from(group.querySelectorAll("button"));
                for (const sibling of siblings) {
                  sibling.classList.remove("bg-primary", "text-white");
                  sibling.classList.add("bg-white");
                }
                button.classList.remove("bg-white");
                button.classList.add("bg-primary", "text-white");
              });
            }
          };

          const setupInvoiceButton = () => {
            const buttons = Array.from(document.querySelectorAll("button")).filter((button) =>
              /download pdf invoice/i.test(collectLabel(button))
            );
            for (const button of buttons) {
              if (button.getAttribute("data-stitch-invoice") === "1") continue;
              button.setAttribute("data-stitch-invoice", "1");
              button.addEventListener("click", (event) => {
                event.preventDefault();
                const content = "Invoice for your order\\nGenerated: " + new Date().toISOString();
                const blob = new Blob([content], { type: "application/pdf" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "invoice.pdf";
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.setTimeout(() => URL.revokeObjectURL(url), 1000);
              });
            }
          };

          const setupAdminControls = () => {
            const addNewExperiment = Array.from(document.querySelectorAll("button")).find((button) =>
              /add new experiment/i.test(collectLabel(button))
            );
            if (addNewExperiment && addNewExperiment.getAttribute("data-stitch-admin-add") !== "1") {
              addNewExperiment.setAttribute("data-stitch-admin-add", "1");
              addNewExperiment.addEventListener("click", (event) => {
                event.preventDefault();
                window.location.href = "/admin/nodes";
              });
            }

            const periodButtons = Array.from(document.querySelectorAll("button")).filter((button) =>
              /^(monthly|quarterly)$/i.test((button.textContent || "").trim())
            );
            for (const button of periodButtons) {
              if (button.getAttribute("data-stitch-admin-period") === "1") continue;
              button.setAttribute("data-stitch-admin-period", "1");
              button.addEventListener("click", (event) => {
                event.preventDefault();
                const parent = button.parentElement;
                if (!parent) return;
                for (const sibling of Array.from(parent.querySelectorAll("button"))) {
                  sibling.classList.remove("bg-primary", "text-white");
                }
                button.classList.add("bg-primary", "text-white");
              });
            }
          };

          const setupCartControls = () => {
            const itemContainers = () =>
              Array.from(document.querySelectorAll("div")).filter((node) => {
                if (!(node instanceof HTMLElement)) return false;
                if (node.getAttribute("data-stitch-cart-item") === "1") return true;
                const hasQty = !!node.querySelector("button") && !!node.querySelector(".mx-6");
                const hasPrice = !!node.querySelector(".text-xl.font-headline");
                const hasImage = !!node.querySelector("img");
                return hasQty && hasPrice && hasImage;
              });

            const recalcTotals = () => {
              const containers = itemContainers().filter((node) => {
                const el = node;
                return el instanceof HTMLElement && el.style.display !== "none";
              });
              let subtotal = 0;
              let currency = "$";
              let itemCount = 0;

              for (const container of containers) {
                const qtyText = container.querySelector(".mx-6")?.textContent || "1";
                const qty = Math.max(0, Number.parseInt(qtyText.trim(), 10) || 0);
                itemCount += qty;

                const priceNode = container.querySelector(".text-xl.font-headline");
                if (!priceNode) continue;
                const parsed = parseMoney(priceNode.textContent || "");
                currency = parsed.currency || currency;
                subtotal += parsed.amount;
              }

              const summaryNodes = Array.from(document.querySelectorAll(".font-headline")).filter((node) => {
                const text = (node.textContent || "").trim();
                return /[$₸]\\s*\\d|\\d\\s*[$₸]/.test(text);
              });

              if (summaryNodes.length > 0) {
                const first = summaryNodes[0];
                const last = summaryNodes[summaryNodes.length - 1];
                first.textContent = formatMoney(subtotal, currency);
                last.textContent = formatMoney(subtotal, currency);
              }

              const selectedLabel = Array.from(document.querySelectorAll("p,span,div")).find((node) =>
                /ritual essentials selected|товар\\(ов\\) выбрано/i.test((node.textContent || "").trim())
              );
              if (selectedLabel) {
                selectedLabel.textContent = (selectedLabel.textContent || "").replace(/\\d+/, String(itemCount));
              }
            };

            const findContainer = (button) => {
              let current = button.parentElement;
              while (current && current !== document.body) {
                const hasPrice = !!current.querySelector(".text-xl.font-headline");
                const hasImage = !!current.querySelector("img");
                if (hasPrice && hasImage) return current;
                current = current.parentElement;
              }
              return null;
            };

            const buttons = Array.from(document.querySelectorAll("button"));
            for (const button of buttons) {
              const text = (button.textContent || "").trim().toLowerCase();
              if (!["+", "-", "close"].includes(text)) continue;
              if (button.getAttribute("data-stitch-cart-control") === "1") continue;
              button.setAttribute("data-stitch-cart-control", "1");

              button.addEventListener("click", (event) => {
                event.preventDefault();
                const container = findContainer(button);
                if (!container) return;
                container.setAttribute("data-stitch-cart-item", "1");
                const qtyNode = container.querySelector(".mx-6");
                const priceNode = container.querySelector(".text-xl.font-headline");
                if (!qtyNode || !priceNode) return;

                const qty = Math.max(1, Number.parseInt((qtyNode.textContent || "1").trim(), 10) || 1);
                const parsed = parseMoney(priceNode.textContent || "");
                const currentUnit =
                  Number.parseFloat(container.getAttribute("data-stitch-unit-price") || "") ||
                  (qty > 0 ? parsed.amount / qty : parsed.amount || 0);
                container.setAttribute("data-stitch-unit-price", String(currentUnit));

                if (text === "close") {
                  container.style.display = "none";
                  recalcTotals();
                  return;
                }

                const nextQty = text === "+" ? qty + 1 : Math.max(1, qty - 1);
                qtyNode.textContent = String(nextQty);
                priceNode.textContent = formatMoney(currentUnit * nextQty, parsed.currency || "$");
                recalcTotals();
              });
            }
          };

          const setupLocalInteractions = () => {
            setupFavoriteButtons();
            setupVariantButtons();
            setupInvoiceButton();
            setupAdminControls();
            setupCartControls();
            setupGenericLocalControls();
            setupVisibilityGuards();
          };

          const setupGenericLocalControls = () => {
            const buttons = Array.from(document.querySelectorAll("button"));
            for (const button of buttons) {
              if (button.getAttribute("data-stitch-bound") === "1") continue;
              if (button.getAttribute("data-stitch-local") === "1") continue;

              const label = collectLabel(button);
              const localAction = resolveLocalAction(label);
              const hasIconOnlyLabel = !normalize(label) && !!button.querySelector(".material-symbols-outlined, svg");
              const effectiveLocalAction = localAction || (hasIconOnlyLabel ? "icon_only_control" : "generic_control");

              button.setAttribute("data-stitch-local", "1");
              button.setAttribute("data-stitch-local-kind", effectiveLocalAction);
              button.style.cursor = "pointer";
              button.addEventListener("click", (event) => {
                event.preventDefault();
                button.classList.add("opacity-80");
                button.style.transform = "scale(0.98)";
                window.setTimeout(() => {
                  button.classList.remove("opacity-80");
                  button.style.transform = "";
                }, 120);
              });
            }
          };

          const parseRgba = (value) => {
            const text = (value || "").trim().toLowerCase();
            if (!text) return null;
            if (text === "transparent") return { r: 0, g: 0, b: 0, a: 0 };
            const m = text.match(/rgba?\\(([^)]+)\\)/);
            if (!m) return null;
            const parts = m[1].split(",").map((p) => p.trim());
            if (parts.length < 3) return null;
            const r = Number.parseFloat(parts[0]) || 0;
            const g = Number.parseFloat(parts[1]) || 0;
            const b = Number.parseFloat(parts[2]) || 0;
            const a = parts.length >= 4 ? Number.parseFloat(parts[3]) || 0 : 1;
            return { r, g, b, a };
          };

          const luminance = ({ r, g, b }) => {
            const srgb = [r, g, b].map((v) => {
              const c = v / 255;
              return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
          };

          const contrastRatio = (a, b) => {
            const l1 = luminance(a);
            const l2 = luminance(b);
            const lighter = Math.max(l1, l2);
            const darker = Math.min(l1, l2);
            return (lighter + 0.05) / (darker + 0.05);
          };

          const setupVisibilityGuards = () => {
            const controls = Array.from(document.querySelectorAll("a, button"));
            for (const control of controls) {
              if (!(control instanceof HTMLElement)) continue;
              if (control.getAttribute("data-stitch-visibility-checked") === "1") continue;
              control.setAttribute("data-stitch-visibility-checked", "1");

              const label = normalize(collectLabel(control));
              const className = control.className || "";
              const computed = window.getComputedStyle(control);

              const bg = parseRgba(computed.backgroundColor);
              const noBgImage = !computed.backgroundImage || computed.backgroundImage === "none";
              const likelyPrimaryCta =
                /text-white/.test(className) ||
                /confirm and pay|complete checkout|shop new arrivals|add to cart|quick add|confirm|checkout|оформ/i.test(label);

              if (likelyPrimaryCta && noBgImage && (!bg || bg.a < 0.08)) {
                control.style.backgroundColor = "#0f766e";
                control.style.color = "#ffffff";
                if (!computed.padding || computed.padding === "0px") control.style.padding = "10px 16px";
                if (computed.display === "inline") control.style.display = "inline-flex";
                control.style.alignItems = "center";
                control.style.justifyContent = "center";
                if (!computed.borderRadius || computed.borderRadius === "0px") control.style.borderRadius = "8px";
              }

              const parentBg = parseRgba(window.getComputedStyle(control.parentElement || document.body).backgroundColor) || {
                r: 255,
                g: 255,
                b: 255,
                a: 1,
              };
              const fg = parseRgba(window.getComputedStyle(control).color);
              if (fg && contrastRatio(fg, parentBg) < 2.1) {
                control.style.color = "#0f172a";
              }

              const iconOnly = !label && !!control.querySelector(".material-symbols-outlined, svg");
              if (iconOnly) {
                control.style.minWidth = control.style.minWidth || "28px";
                control.style.minHeight = control.style.minHeight || "28px";
                if (!control.style.display) control.style.display = "inline-flex";
                control.style.alignItems = "center";
                control.style.justifyContent = "center";
              }
            }
          };

          const bindActions = () => {
            const elements = Array.from(document.querySelectorAll("a, button"));

            for (const element of elements) {
              const label = collectLabel(element);
              const route = resolveRoute(label);

              if (element.tagName === "A") {
                const href = element.getAttribute("href");
                if (isPlaceholderHref(href)) {
                  element.setAttribute("href", route || "/");
                  element.removeAttribute("onclick");
                }
                continue;
              }

              if (!route) continue;
              if (element.getAttribute("data-stitch-bound") === "1") continue;

              element.setAttribute("data-stitch-bound", "1");
              element.style.cursor = "pointer";
              element.addEventListener("click", (event) => {
                event.preventDefault();
                document.body.classList.add("stitch-nav-out");
                window.setTimeout(() => {
                  window.location.href = route;
                }, 90);
              });
            }
          };

          if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => {
              bindActions();
              setupLocalInteractions();
              document.documentElement.classList.remove("stitch-loading");
              document.body.classList.add("stitch-ready");
            });
          } else {
            bindActions();
            setupLocalInteractions();
            document.documentElement.classList.remove("stitch-loading");
            document.body.classList.add("stitch-ready");
          }

          const observer = new MutationObserver(() => {
            bindActions();
            setupLocalInteractions();
          });
          observer.observe(document.body, { childList: true, subtree: true });
        })();
      `}</Script>

      <div dangerouslySetInnerHTML={{ __html: parsed.body }} />
      <style dangerouslySetInnerHTML={{ __html: mergedStyles }} />
    </>
  );
}
