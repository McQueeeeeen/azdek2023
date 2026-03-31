"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent, getSessionIdForCheckout } from "@/lib/analytics";

export default function GlobalAnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const sessionId = getSessionIdForCheckout();
    const startedFlag = `azdek_session_started_${sessionId}`;
    if (!sessionStorage.getItem(startedFlag)) {
      sessionStorage.setItem(startedFlag, "1");
      void trackEvent({
        eventType: "session_started",
        idempotencyKey: `session_started:${sessionId}`,
        sessionId,
        metadata: { path: pathname },
      });
    }

    void trackEvent({
      eventType: "page_view",
      idempotencyKey: `page_view:${sessionId}:${pathname}:${window.location.search}`,
      sessionId,
      metadata: {
        path: pathname,
        query: window.location.search,
      },
    });
  }, [pathname]);

  return null;
}
