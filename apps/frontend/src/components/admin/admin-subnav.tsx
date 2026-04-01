"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/admin", label: "Control" },
  { href: "/admin/billing", label: "Billing" },
  { href: "/admin/health", label: "Health" },
  { href: "/admin/nodes", label: "Nodes" },
];

export default function AdminSubnav() {
  const pathname = usePathname();

  return (
    <div className="admin-subnav" role="tablist" aria-label="Admin navigation">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn("admin-subnav-link", pathname === link.href && "is-active")}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
