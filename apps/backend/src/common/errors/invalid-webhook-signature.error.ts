import { DomainError } from "./domain.error";

export class InvalidWebhookSignatureError extends DomainError {
  constructor(message = "Invalid webhook signature") {
    super("INVALID_WEBHOOK_SIGNATURE", message);
  }
}

