/**
 * Performance Utilities
 * - Web Vitals monitoring
 * - Resource hints
 * - Performance optimization helpers
 */

export const reportWebVitals = async () => {
  if (typeof window === "undefined") return;

  try {
    const { onCLS, onFID, onFCP, onLCP, onTTFB, onINP } = await import("web-vitals");

    // web-vitals v4+ uses on* functions instead of get*
    onCLS(console.info);
    onFID(console.info);
    onFCP(console.info);
    onLCP(console.info);
    onTTFB(console.info);
    onINP(console.info);
  } catch (error) {
    console.debug("Web Vitals not available");
  }
};

/**
 * Prefetch critical routes
 */
export const prefetchRoutes = (router: any) => {
  const criticalRoutes = [
    "/menu",
    "/login",
    "/customer/points",
    "/(dashboard)/pos",
  ];

  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    criticalRoutes.forEach((route) => {
      requestIdleCallback(() => {
        router.prefetch(route);
      });
    });
  }
};

/**
 * Debounce function for expensive operations
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function for scroll/resize listeners
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Lazy load images on intersection
 */
export const observeImages = () => {
  if (typeof window === "undefined") return;

  if (!("IntersectionObserver" in window)) return;

  const imageElements = document.querySelectorAll("img[data-lazy]");

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.lazy || "";
        img.removeAttribute("data-lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  imageElements.forEach((img) => imageObserver.observe(img));
};

/**
 * Check if user is on slow connection
 */
export const isSlowConnection = (): boolean => {
  if (typeof navigator === "undefined") return false;

  const connection = (navigator as any).connection;
  if (!connection) return false;

  const effectiveType = connection.effectiveType;
  return effectiveType === "slow-2g" || effectiveType === "2g" || effectiveType === "3g";
};
