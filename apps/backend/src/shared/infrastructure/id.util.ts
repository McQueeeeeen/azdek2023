import { randomUUID } from "crypto";

export function genId(): string {
  return randomUUID();
}

export function nowIso(): string {
  return new Date().toISOString();
}

