import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export default function Card({
  children,
  className,
  ...props
}: { children: ReactNode; className?: string } & HTMLAttributes<HTMLElement>) {
  return (
    <article className={cn("ui-card motion-in", className)} {...props}>
      {children}
    </article>
  );
}
