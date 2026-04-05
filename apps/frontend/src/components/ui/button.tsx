import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { UiActionState } from "@/lib/ui-state";

type Variant = "primary" | "secondary" | "outline" | "ghost";

export default function Button({
  variant = "primary",
  actionState = "idle",
  pendingLabel,
  doneLabel,
  failedLabel,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  actionState?: UiActionState;
  pendingLabel?: string;
  doneLabel?: string;
  failedLabel?: string;
}) {
  const label =
    actionState === "pending"
      ? pendingLabel ?? children
      : actionState === "done"
      ? doneLabel ?? children
      : actionState === "failed"
      ? failedLabel ?? children
      : children;

  return (
    <button
      className={cn(
        "ui-button",
        `ui-button-${variant}`,
        actionState === "pending" && "ui-button-pending",
        actionState === "done" && "ui-button-done",
        actionState === "failed" && "ui-button-failed",
        className,
      )}
      {...props}
    >
      {actionState === "pending" ? <span className="ui-button-spinner" aria-hidden="true" /> : null}
      <span>{label}</span>
    </button>
  );
}
