import { ReactNode } from "react";
import { cn } from "@/lib/cn";

export default function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <article className={cn("ui-card motion-in", className)}>{children}</article>;
}
