export type ToastTone = "success" | "error" | "info";

export interface ToastPayload {
  title: string;
  description?: string;
  tone?: ToastTone;
  durationMs?: number;
}

const EVENT_NAME = "azdek-toast";

export function showToast(payload: ToastPayload) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: payload }));
}

export function onToast(handler: (payload: ToastPayload) => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const listener = (event: Event) => {
    const customEvent = event as CustomEvent<ToastPayload>;
    handler(customEvent.detail);
  };

  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
}
