import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export default function Section({
  children,
  className,
  ...props
}: { children: ReactNode; className?: string } & HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("section", className)} {...props}>
      {children}
    </section>
  );
}
