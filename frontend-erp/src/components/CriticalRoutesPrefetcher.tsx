"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Critical Routes Prefetcher
 * Prefetch important routes during idle time to improve navigation performance
 */
export default function CriticalRoutesPrefetcher() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Prefetch critical routes using requestIdleCallback
    if ("requestIdleCallback" in window) {
      const criticalRoutes = [
        "/menu",
        "/(dashboard)/pos",
        "/(dashboard)/pos/orders",
        "/(dashboard)/pos/inventory",
      ];

      criticalRoutes.forEach((route) => {
        requestIdleCallback(() => {
          router.prefetch(route);
        });
      });
    }
  }, [router]);

  return null;
}
