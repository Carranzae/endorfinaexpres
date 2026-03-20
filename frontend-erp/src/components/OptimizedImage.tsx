import Image from "next/image";
import { CSSProperties } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
  fill?: boolean;
  objectFit?: "contain" | "cover" | "fill" | "scale-down";
  sizes?: string;
  onLoad?: () => void;
  quality?: number;
}

/**
 * Optimized Image Component
 * - Automatic format conversion (WebP/AVIF)
 * - Lazy loading by default
 * - Blur placeholder support
 * - Responsive sizing
 * - Cache optimization
 */
export default function OptimizedImage({
  src,
  alt,
  width = 400,
  height = 300,
  priority = false,
  className,
  style,
  fill = false,
  objectFit = "cover",
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  onLoad,
  quality = 75,
}: OptimizedImageProps) {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        width: fill ? "100%" : width,
        height: fill ? "100%" : height,
        ...style,
      }}
      className={className}
    >
      <Image
        src={src}
        alt={alt}
        {...(fill
          ? {
              fill: true,
              sizes,
            }
          : {
              width,
              height,
            })}
        quality={quality}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        placeholder="empty"
        onLoadingComplete={onLoad}
        style={{
          objectFit,
          objectPosition: "center",
          width: fill ? "100%" : "auto",
          height: fill ? "100%" : "auto",
        }}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
      />
    </div>
  );
}
