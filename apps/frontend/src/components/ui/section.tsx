import { ReactNode } from "react";
import { cn } from "@/lib/cn";

export default function Section({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("section", className)}>{children}</section>;
}

