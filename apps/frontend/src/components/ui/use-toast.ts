"use client";

import { showToast, ToastPayload } from "@/lib/toast";

export function useToast() {
  return {
    toast: (payload: ToastPayload) => showToast(payload),
  };
}
