"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

export default function ApiHealthIndicator() {
  const [status, setStatus] = useState<"checking" | "online" | "offline">("checking");
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    let mounted = true;
    let interval: NodeJS.Timeout;

    const checkHealth = async () => {
      try {
        await apiGet<{ status: string }>("/doctor/ping");
        if (mounted) {
          setStatus("online");
          setLastChecked(new Date());
        }
      } catch {
        if (mounted) {
          setStatus("offline");
          setLastChecked(new Date());
        }
      }
    };

    // Initial check
    checkHealth();

    // Periodic check every 30 seconds
    interval = setInterval(checkHealth, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm text-ink-2" title={lastChecked ? `Last checked: ${lastChecked.toLocaleTimeString()}` : "Checking API health..."}>
      <span className="relative flex h-3 w-3">
        {status === "online" && (
          <>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
          </>
        )}
        {status === "offline" && (
          <span className="relative inline-flex rounded-full h-3 w-3 bg-error"></span>
        )}
        {status === "checking" && (
          <span className="relative inline-flex rounded-full h-3 w-3 bg-warning animate-pulse"></span>
        )}
      </span>
      <span>API {status === "online" ? "Online" : status === "offline" ? "Offline" : "Checking..."}</span>
    </div>
  );
}
