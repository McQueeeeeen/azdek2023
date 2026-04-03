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

function repairEncodingArtifacts(input: string): string {
  return input
    .replaceAll("вЂў", "•")
    .replaceAll("вЂ”", "—")
    .replaceAll("вЂ“", "–")
    .replaceAll("вЂ™", "’")
    .replaceAll("вЂњ", "“")
    .replaceAll("вЂќ", "”")
    .replaceAll("В©", "©");
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
`;

  const tailwindCdn = parsed.scriptSrcs.find((src) => src.includes("cdn.tailwindcss.com"));
  const otherScripts = parsed.scriptSrcs.filter((src) => src !== tailwindCdn);

  return (
    <>
      {parsed.tailwindConfig ? (
        <Script id={`tailwind-config-${folder}`} strategy="beforeInteractive">
          {parsed.tailwindConfig}
        </Script>
      ) : null}
      {tailwindCdn ? <Script src={tailwindCdn} strategy="beforeInteractive" /> : null}
      {otherScripts.map((src) => (
        <Script key={`${folder}-${src}`} src={src} strategy="afterInteractive" />
      ))}
      <Script id={`stitch-actions-${folder}`} strategy="afterInteractive">{`
        (() => {
          const normalize = (value) => (value || "").toLowerCase().replace(/\\s+/g, " ").trim();
          const resolveRoute = (label) => {
            const text = normalize(label);
            if (!text) return null;

            if (/(shopping_cart|shopping_bag|add to cart|quick add|buy again|acquire bundle|subscribe|cart|bag|корзина|добавить в корзину)/.test(text)) return "/cart";
            if (/(confirm.*pay|complete checkout|checkout|pay\\b|proceed to payment|оформить|оплатить|чекаут)/.test(text)) return "/checkout";
            if (/(shop new arrivals|shop all|shop the collection|explore collection|explore the collection|view all products|collections?|laundry|kitchen|bathroom|bundles|fragrances|catalog|каталог|стирка|кухня|ванная|пополнения|ритуалы)/.test(text)) return "/catalog";
            if (/(log in|login|sign in|create account|forgot password|logout|войти|выйти|регистрация)/.test(text)) return "/login";
            if (/(account_circle|person\\b|member account|account portal|account overview|личный кабинет|кабинет|account)/.test(text)) return "/account";
            if (/(profile|edit profile|save changes|профиль|редактировать профиль|сохранить изменения)/.test(text)) return "/account/profile";
            if (/(orders|order history|view details|track your order|track order|download invoice|заказы|история заказов|детали заказа|отследить заказ)/.test(text)) return "/account/orders";
            if (/(payment methods|save payment method|payment|оплата|способы оплаты)/.test(text)) return "/account/payment-methods";
            if (/(notification|уведомления)/.test(text)) return "/account/notifications";
            if (/(support|help|contact|contact us|contact editorial support|live concierge|поддержка|помощь|контакты)/.test(text)) return "/support";
            if (/(philosophy|about|our ingredient ethos|our science|methodology|lab reports|sustainability|journal|pinterest|instagram|about us|о нас|философия|устойчивость)/.test(text)) return "/about";
            if (/(promotions|reductions|copy code|акции|промо|промокод)/.test(text)) return "/promotions";
            if (/(winter sanctuary|seasonal|сезонное)/.test(text)) return "/seasonal";
            if (/(dashboard|inventory|analytics|sales|settings|export report|admin system|admin|админ|админ-панель)/.test(text)) return "/admin";
            if (/billing/.test(text)) return "/admin/billing";
            if (/nodes/.test(text)) return "/admin/nodes";
            if (/(privacy|terms|shipping|returns|archive|science|story|material safety data sheets|условия|доставка|возврат)/.test(text)) return "/support";
            if (/(home\\b|back to home|главная)/.test(text)) return "/";
            return null;
          };

          const bindActions = () => {
            const elements = Array.from(document.querySelectorAll("a, button"));
            for (const element of elements) {
              const label = (element.textContent || "").replace(/\\s+/g, " ").trim();
              const route = resolveRoute(label);
              if (!route) continue;

              if (element.tagName === "A") {
                const link = element;
                const href = link.getAttribute("href");
                if (!href || href === "#" || href === "") {
                  link.setAttribute("href", route);
                }
                continue;
              }

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
          };

          if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", bindActions);
          } else {
            bindActions();
          }
        })();
      `}</Script>
      <div dangerouslySetInnerHTML={{ __html: parsed.body }} />
      <style dangerouslySetInnerHTML={{ __html: mergedStyles }} />
    </>
  );
}
