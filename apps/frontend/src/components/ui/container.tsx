import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export default function Container({
  children,
  className,
  ...props
}: { children: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("container", className)} {...props}>
      {children}
    </div>
  );
}
