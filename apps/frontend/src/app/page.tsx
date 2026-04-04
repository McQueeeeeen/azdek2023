import fs from "node:fs";
import path from "node:path";

const HOMEPAGE_FILE = path.resolve(
  process.cwd(),
  "..",
  "..",
  "design",
  "stitch_order_success_azure_clean",
  "homepage_azure_clean_2",
  "code.html"
);

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function HomePage() {
  const html = fs.readFileSync(HOMEPAGE_FILE, "utf8");

  return (
    <iframe
      title="homepage-azure-clean"
      srcDoc={html}
      style={{ width: "100%", minHeight: "100vh", border: "0", display: "block" }}
      sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
    />
  );
}

