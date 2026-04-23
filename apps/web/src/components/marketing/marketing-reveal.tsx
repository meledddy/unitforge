"use client";

import { cn } from "@unitforge/ui";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

interface MarketingRevealProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  delay?: number;
  children: ReactNode;
  variant?: "default" | "quiet" | "showcase" | "pricing";
}

export function MarketingReveal({
  children,
  className,
  delay = 0,
  style,
  variant = "default",
  ...props
}: MarketingRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry?.isIntersecting) {
          return;
        }

        setIsVisible(true);
        observer.disconnect();
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.2,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "marketing-reveal",
        variant === "quiet" && "marketing-reveal-quiet",
        variant === "showcase" && "marketing-reveal-showcase",
        variant === "pricing" && "marketing-reveal-pricing",
        className,
      )}
      data-marketing-reveal-state={isVisible ? "visible" : "hidden"}
      style={
        {
          ...style,
          "--marketing-reveal-delay": `${delay}ms`,
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
}
