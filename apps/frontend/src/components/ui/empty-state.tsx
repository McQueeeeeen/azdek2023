import { ReactNode } from "react";
import Link from "next/link";
import Button from "./button";

export default function EmptyState({
  title,
  description,
  actionHref,
  actionText,
  action,
}: {
  title: string;
  description?: string;
  actionHref?: string;
  actionText?: string;
  action?: ReactNode;
}) {
  return (
    <div className="ui-empty-state">
      <h3 className="h3">{title}</h3>
      {description ? <p className="text-secondary">{description}</p> : null}
      {action ? action : null}
      {actionHref && actionText ? (
        <Link href={actionHref}>
          <Button>{actionText}</Button>
        </Link>
      ) : null}
    </div>
  );
}

