import { DomainError } from "./domain.error";

export class OrderTransitionNotAllowedError extends DomainError {
  constructor(from: string, to: string) {
    super("ORDER_TRANSITION_NOT_ALLOWED", `Order transition is not allowed: ${from} -> ${to}`, { from, to });
  }
}

