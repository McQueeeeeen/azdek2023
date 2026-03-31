import { DomainError } from "./domain.error";

export class CartValidationError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super("CART_VALIDATION_ERROR", message, details);
  }
}

