"use client";

import { useEffect, useMemo, useState } from "react";
import { onToast, ToastPayload } from "@/lib/toast";

type InternalToast = ToastPayload & { id: string };

export default function ToastHost() {
  const [toasts, setToasts] = useState<InternalToast[]>([]);

  useEffect(() => {
    return onToast((payload) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const toast = { ...payload, id };
      setToasts((prev) => [...prev, toast]);
      const delay = payload.durationMs ?? 2200;
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
      }, delay);
    });
  }, []);

  const ordered = useMemo(() => [...toasts].reverse(), [toasts]);

  if (ordered.length === 0) {
    return null;
  }

  return (
    <div className="toast-host" aria-live="polite" aria-atomic="true">
      {ordered.map((toast) => (
        <div key={toast.id} className={`toast-item toast-${toast.tone ?? "info"}`}>
          <p className="toast-title">{toast.title}</p>
          {toast.description ? <p className="toast-description">{toast.description}</p> : null}
        </div>
      ))}
    </div>
  );
}
