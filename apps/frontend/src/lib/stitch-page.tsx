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
  const mergedStyles = `
${stylesheetImports}
${parsed.styleBlocks.join("\n\n")}
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
            if (/(about|philosophy|manifesto|sustainability|journal|instagram|pinterest|о нас|философия|устойчивость)/.test(text)) return "/about";
            if (/(promotions|offers|special offers|reductions|copy code|акции|промо|промокод)/.test(text)) return "/promotions";
            if (/(winter sanctuary|seasonal|сезонное)/.test(text)) return "/seasonal";
            if (/(dashboard|inventory|analytics|admin|админ|админ-панель)/.test(text)) return "/admin";
            if (/billing/.test(text)) return "/admin/billing";
            if (/nodes/.test(text)) return "/admin/nodes";
            if (/(shop|collection|view all products|catalog|laundry|kitchen|bathroom|bundles|fragrances|каталог|стирка|кухня|ванная|пополнения|ритуалы)/.test(text)) return "/catalog";
            if (/(adzek|azure clean|linen & ether|home care|home\b|back to home|главная)/.test(text)) return "/";

            return null;
          };

          const bindActions = () => {
            const elements = Array.from(document.querySelectorAll("a, button"));

            for (const element of elements) {
              const label = collectLabel(element);
              const route = resolveRoute(label);

              if (element.tagName === "A") {
                const href = element.getAttribute("href");
                if (isPlaceholderHref(href) && route) {
                  element.setAttribute("href", route);
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
                window.location.href = route;
              });
            }
          };

          if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", bindActions);
          } else {
            bindActions();
          }

          const observer = new MutationObserver(bindActions);
          observer.observe(document.body, { childList: true, subtree: true });
        })();
      `}</Script>

      <div dangerouslySetInnerHTML={{ __html: parsed.body }} />
      <style dangerouslySetInnerHTML={{ __html: mergedStyles }} />
    </>
  );
}
