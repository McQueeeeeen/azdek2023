import fs from "node:fs";
import path from "node:path";
import Script from "next/script";
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

function repairEncodingArtifacts(input: string): string {
  return input
    // Single-step mojibake (UTF-8 bytes interpreted as cp1251/win-1252)
    .replaceAll("вЂў", "•")
    .replaceAll("вЂ—", "—")
    .replaceAll("вЂ“", "–")
    .replaceAll("вЂ™", "’")
    .replaceAll("вЂњ", "“")
    .replaceAll("вЂќ", "”")
    .replaceAll("В©", "©")
    .replaceAll("NВє", "Nº")
    // Double-step mojibake variants seen in imported stitch packs
    .replaceAll("Р Р†Р вЂљРЎС›", "•")
    .replaceAll("Р Р†Р вЂљРІР‚Сњ", "—")
    .replaceAll("Р Р†Р вЂљРІР‚Сљ", "–")
    .replaceAll("Р Р†Р вЂљРІвЂћСћ", "’")
    .replaceAll("Р Р†Р вЂљРЎС™", "“")
    .replaceAll("Р Р†Р вЂљРЎСљ", "”")
    .replaceAll("Р вЂ™Р’В©", "©")
    .replaceAll("Р В Р вЂ Р В РІР‚С™Р РЋРЎвЂє", "•")
    .replaceAll("Р В Р вЂ Р В РІР‚С™Р Р†Р вЂљРЎСљ", "—")
    .replaceAll("Р В Р вЂ Р В РІР‚С™Р Р†Р вЂљРЎС™", "–")
    .replaceAll("Р В Р вЂ Р В РІР‚С™Р Р†РІР‚С›РЎС›", "’")
    .replaceAll("Р В Р вЂ Р В РІР‚С™Р РЋРЎв„ў", "“")
    .replaceAll("Р В Р вЂ Р В РІР‚С™Р РЋРЎС™", "”")
    .replaceAll("Р В РІР‚в„ўР вЂ™Р’В©", "©")
    .replaceAll("РІР‚Сћ", "•")
    .replaceAll("РІР‚вЂќ", "—")
    .replaceAll("РІР‚вЂњ", "–")
    .replaceAll("РІР‚в„ў", "’")
    .replaceAll("РІР‚Сљ", "“")
    .replaceAll("РІР‚Сњ", "”")
    .replaceAll("Р’В©", "©");
}
function parseStitchHtml(html: string): ParsedStitch {
  const repaired = repairEncodingArtifacts(html);
  const title = repaired.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const body = repaired.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1]?.trim() ?? repaired;

  const styleBlocks = Array.from(repaired.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)).map((m) => m[1].trim());
  const scriptSrcs = unique(
    Array.from(repaired.matchAll(/<script[^>]*src=["']([^"']+)["'][^>]*><\/script>/gi)).map((m) => m[1].trim())
  );
  const fontStylesheets = unique(
    Array.from(repaired.matchAll(/<link[^>]*href=["']([^"']+)["'][^>]*>/gi))
      .map((m) => m[1].trim())
      .filter((href) => href.includes("fonts.googleapis.com"))
  );
  const tailwindConfig = repaired.match(/<script[^>]*id=["']tailwind-config["'][^>]*>([\s\S]*?)<\/script>/i)?.[1]?.trim();

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

export function getStitchMetadata(folder: string, fallbackDescription = "Azure Clean"): Metadata {
  const parsed = readStitch(folder);
  return {
    title: parsed.title || "Azure Clean",
    description: fallbackDescription,
  };
}

export function StitchPage({ folder }: { folder: string }) {
  const parsed = readStitch(folder);
  const safeTailwindConfig = normalizeTailwindConfig(parsed.tailwindConfig);
  const stylesheetImports = parsed.fontStylesheets.map((href) => `@import url("${href}");`).join("\n");
  const mergedStyles = `
${stylesheetImports}
${parsed.styleBlocks.join("\n\n")}

.site-header,
.site-footer,
.mobile-bottom-nav {
  display: none !important;
}

.site-main {
  padding: 0 !important;
}

input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 9999px;
  background: rgba(0, 102, 115, 0.25);
}

input[type="range"]::-webkit-slider-runnable-track {
  height: 4px;
  border-radius: 9999px;
  background: rgba(0, 102, 115, 0.25);
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 9999px;
  border: none;
  background: #008091;
  margin-top: -5px;
}

input[type="range"]::-moz-range-track {
  height: 4px;
  border-radius: 9999px;
  background: rgba(0, 102, 115, 0.25);
}

input[type="range"]::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 9999px;
  border: none;
  background: #008091;
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
      {otherScripts.map((src) => (
        <Script key={`${folder}-${src}`} src={src} strategy="afterInteractive" />
      ))}
      <Script id={`stitch-a11y-${folder}`} strategy="afterInteractive">{`
        (() => {
          const focusableSelector = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
          const prevAttr = 'data-stitch-prev-tabindex';
          const noneValue = '__none__';

          const disableFocusable = (root) => {
            root.setAttribute('inert', '');
            const focusable = root.querySelectorAll(focusableSelector);
            for (const el of focusable) {
              if (el.hasAttribute(prevAttr)) continue;
              const prev = el.getAttribute('tabindex');
              el.setAttribute(prevAttr, prev === null ? noneValue : prev);
              el.setAttribute('tabindex', '-1');
            }
          };

          const restoreFocusable = (root) => {
            root.removeAttribute('inert');
            const touched = root.querySelectorAll('[' + prevAttr + ']');
            for (const el of touched) {
              const prev = el.getAttribute(prevAttr);
              if (prev === noneValue || prev === null) {
                el.removeAttribute('tabindex');
              } else {
                el.setAttribute('tabindex', prev);
              }
              el.removeAttribute(prevAttr);
            }
          };

          const syncRoot = (root) => {
            if (!(root instanceof HTMLElement)) return;
            const hidden = root.getAttribute('aria-hidden') === 'true' && root.getAttribute('data-aria-hidden') === 'true';
            if (hidden) {
              disableFocusable(root);
            } else if (root.hasAttribute('inert') || root.querySelector('[' + prevAttr + ']')) {
              restoreFocusable(root);
            }
          };

          const scan = () => {
            const roots = document.querySelectorAll('[aria-hidden="true"][data-aria-hidden="true"], [data-stitch-prev-tabindex], [inert][data-aria-hidden]');
            for (const root of roots) {
              const host = root.matches('[aria-hidden="true"][data-aria-hidden="true"]') || root.matches('[inert][data-aria-hidden]')
                ? root
                : root.closest('[data-aria-hidden]');
              if (host instanceof HTMLElement) syncRoot(host);
            }
          };

          scan();
          const observer = new MutationObserver(() => scan());
          observer.observe(document.documentElement, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['aria-hidden', 'data-aria-hidden', 'tabindex']
          });
        })();
      `}</Script>
      <Script id={`stitch-actions-${folder}`} strategy="afterInteractive">{`
        (() => {
          const normalize = (value) => (value || "").toLowerCase().replace(/\\s+/g, " ").trim();
          const placeholderPattern = /\\{\\{\\s*data:screen:[^}]+\\}\\}/i;

          const isPlaceholderHref = (href) => {
            const value = (href || "").trim();
            if (!value || value === "#") return true;
            return placeholderPattern.test(value) || /data:screen/i.test(value) || /^screen_\\d+$/i.test(value);
          };

          const collectLabel = (element) => {
            const parts = [];
            parts.push(element.textContent || "");
            parts.push(element.getAttribute("aria-label") || "");
            parts.push(element.getAttribute("title") || "");

            const icon = element.querySelector("[data-icon]");
            if (icon instanceof HTMLElement) {
              parts.push(icon.getAttribute("data-icon") || "");
            }

            const symbol = element.querySelector(".material-symbols-outlined");
            if (symbol instanceof HTMLElement) {
              parts.push(symbol.textContent || "");
            }

            return parts.join(" ").replace(/\\s+/g, " ").trim();
          };

                    const resolveRoute = (label) => {
            const text = normalize(label);
            if (!text) return null;

            if (/(shopping_cart|shopping_bag|add to cart|quick add|add to ritual|add to bag|buy again|acquire bundle|subscribe|cart|bag|корзина|добавить в корзину)/.test(text)) return "/cart";
            if (/(confirm.*pay|complete checkout|checkout|pay\\b|proceed to payment|оформить|оплатить|чекаут|перейти к оформлению)/.test(text)) return "/checkout";
            if (/(log in|login|sign in|create account|forgot password|logout|войти|выйти|регистрация)/.test(text)) return "/login";
            if (/(account_circle|person\\b|member account|account portal|account overview|личный кабинет|кабинет|account)/.test(text)) return "/account";
            if (/(profile|edit profile|save changes|профиль|редактировать профиль|сохранить изменения)/.test(text)) return "/account/profile";
            if (/(orders|order history|view details|track your order|track order|download invoice|заказы|история заказов|детали заказа|отследить заказ)/.test(text)) return "/account/orders";
            if (/(payment methods|save payment method|payment|оплата|способы оплаты)/.test(text)) return "/account/payment-methods";
            if (/(notification|уведомления)/.test(text)) return "/account/notifications";
            if (/(support|help|faq|contact|contact us|contact editorial support|live concierge|поддержка|помощь|контакты)/.test(text)) return "/support";
            if (/(philosophy|about|manifesto|our ingredient ethos|our science|methodology|lab reports|sustainability|journal|pinterest|instagram|about us|о нас|философия|устойчивость)/.test(text)) return "/about";
            if (/(promotions|offers|special offers|reductions|copy code|акции|промо|промокод)/.test(text)) return "/promotions";
            if (/(winter sanctuary|seasonal|сезонное)/.test(text)) return "/seasonal";
            if (/(dashboard|inventory|analytics|sales|settings|export report|admin system|admin|админ|админ-панель)/.test(text)) return "/admin";
            if (/billing/.test(text)) return "/admin/billing";
            if (/nodes/.test(text)) return "/admin/nodes";
            if (/(shop new arrivals|shop all|shop the collection|explore collection|explore the collection|view all products|view all labs|view all rituals|collections?|laundry|kitchen|bathroom|bundles|fragrances|catalog|ритуал|ritual|каталог|стирка|кухня|ванная|пополнения|ритуалы)/.test(text)) return "/catalog";
            if (/(privacy|terms|shipping|returns|archive|science|story|material safety data sheets|условия|доставка|возврат)/.test(text)) return "/support";
            if (/(adzek|azure clean|pure curator|linen & ether|home care|home\\b|back to home|главная)/.test(text)) return "/";
            return null;
          };

                    const applyCatalogFixes = () => {
            const badges = Array.from(document.querySelectorAll("span,div"));
            for (const badge of badges) {
              const text = normalize(badge.textContent || "");
              if (!text) continue;
              if (!/(clean fresh|clinical choice|eco-friendly|new arrival|signature|refillable|best seller|limited|новинка|хит)/.test(text)) continue;

              const style = window.getComputedStyle(badge);
              const isTransparent = style.backgroundColor === "rgba(0, 0, 0, 0)" || style.backgroundColor === "transparent";
              if (!isTransparent) continue;

              const isTeal = /(clinical choice|new arrival|новинка)/.test(text);
              badge.style.backgroundColor = isTeal ? "#008091" : "#ffdcc5";
              badge.style.color = isTeal ? "#ffffff" : "#301400";
              badge.style.borderRadius = "9999px";
              badge.style.padding = "4px 10px";
              badge.style.display = "inline-flex";
              badge.style.alignItems = "center";
              badge.style.justifyContent = "center";
              badge.style.fontWeight = "700";
              badge.style.letterSpacing = "0.08em";
            }

            const addToCartCtas = Array.from(document.querySelectorAll("a, button")).filter((node) =>
              /(add to cart|quick add|add to ritual|add to bag|добавить)/i.test((node.textContent || "").trim())
            );

            for (const cta of addToCartCtas) {
              cta.style.display = cta.style.display || "inline-flex";
              cta.style.alignItems = cta.style.alignItems || "center";
              cta.style.justifyContent = cta.style.justifyContent || "center";
              cta.style.minHeight = cta.style.minHeight || "44px";
              cta.style.marginTop = "auto";

              const card = cta.closest("article, .group");
              if (card instanceof HTMLElement) {
                card.style.display = "flex";
                card.style.flexDirection = "column";
                card.style.height = "100%";
              }

              const parent = cta.parentElement;
              if (parent instanceof HTMLElement) {
                parent.style.display = "flex";
                parent.style.flexDirection = "column";
                parent.style.gap = "8px";
                parent.style.height = "100%";
              }
            }
          };
          const bindActions = () => {
            const elements = Array.from(document.querySelectorAll("a, button"));
            for (const element of elements) {
              const label = collectLabel(element);
              const route = resolveRoute(label);

              if (element.tagName === "A") {
                const link = element;
                const href = link.getAttribute("href");
                if (isPlaceholderHref(href)) {
                  link.setAttribute("href", route || "/catalog");
                  if (link.hasAttribute("onclick")) {
                    link.removeAttribute("onclick");
                  }
                }
                continue;
              }

              if (!route) continue;

              if (element.getAttribute("data-stitch-bound") === "1") continue;
              element.setAttribute("data-stitch-bound", "1");
              element.style.cursor = "pointer";
              element.addEventListener("click", (event) => {
                event.preventDefault();
                if (/copy code/i.test(label) && navigator.clipboard) {
                  const hostText = element.parentElement?.textContent || "";
                  const promo = (hostText.match(/[A-Z0-9]{5,}/) || ["AZURE10"])[0];
                  navigator.clipboard.writeText(promo);
                  return;
                }
                window.location.href = route;
              });
            }

            applyCatalogFixes();
          };

          if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", bindActions);
          } else {
            bindActions();
          }

          const observer = new MutationObserver(() => bindActions());
          observer.observe(document.body, { childList: true, subtree: true });
        })();
      `}</Script>
      <div dangerouslySetInnerHTML={{ __html: parsed.body }} />
      <style dangerouslySetInnerHTML={{ __html: mergedStyles }} />
    </>
  );
}

