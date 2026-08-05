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
  const [revealState, setRevealState] = useState<
    "static" | "hidden" | "visible"
  >("static");

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      setRevealState("visible");
      return;
    }

    const bounds = element.getBoundingClientRect();

    if (bounds.bottom >= 0 && bounds.top <= window.innerHeight * 0.9) {
      setRevealState("visible");
      return;
    }

    setRevealState("hidden");

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry?.isIntersecting) {
          return;
        }

        setRevealState("visible");
        window.clearTimeout(failOpenTimer);
        observer.disconnect();
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.2,
      },
    );

    const failOpenTimer = window.setTimeout(() => {
      setRevealState("visible");
      observer.disconnect();
    }, 1_400);
    observer.observe(element);

    return () => {
      window.clearTimeout(failOpenTimer);
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
      data-marketing-reveal-state={revealState}
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
