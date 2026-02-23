"use client";

import { useEffect, useCallback } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function useTrackEvent() {
  const track = useCallback(
    async (name: string, meta?: Record<string, unknown>) => {
      // Server-side tracking
      try {
        await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, meta }),
        });
      } catch {
        // Silently fail
      }

      // GA4 tracking
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", name, meta);
      }
    },
    []
  );

  return track;
}

export function TrackPageView({ name }: { name: string }) {
  const track = useTrackEvent();

  useEffect(() => {
    track(name);
  }, [name, track]);

  return null;
}
