import { cn } from "@/lib/cn";

export default function Skeleton({ className }: { className?: string }) {
  return <div className={cn("ui-skeleton", className)} aria-hidden />;
}

