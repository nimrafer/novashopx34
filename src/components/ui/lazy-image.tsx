import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
}

const LazyImage = ({
  src,
  alt,
  className,
  placeholderClassName,
  ...props
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px", // Load slightly earlier
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={cn("relative overflow-hidden", className)}>
      {/* Placeholder skeleton */}
      {!isLoaded && (
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-muted/50 via-muted to-muted/50 animate-pulse",
            placeholderClassName
          )}
        />
      )}

      {/* Actual image - only load when in view */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={cn(
            "w-full h-full object-contain transition-all duration-700 ease-out",
            isLoaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-lg scale-95"
          )}
          {...props}
        />
      )}
    </div>
  );
};

export { LazyImage };
