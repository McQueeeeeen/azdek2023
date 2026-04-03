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
      <div dangerouslySetInnerHTML={{ __html: parsed.body }} />
      <style dangerouslySetInnerHTML={{ __html: mergedStyles }} />
    </>
  );
}
