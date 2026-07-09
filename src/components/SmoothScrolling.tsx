"use client";

import { ReactLenis } from "@studio-freight/react-lenis";
import { ReactNode, useEffect, useState } from "react";

export function SmoothScrolling({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect touch devices — they should use native scrolling
    const checkTouch = () => {
      setIsMobile(
        "ontouchstart" in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768
      );
    };
    checkTouch();
    window.addEventListener("resize", checkTouch);
    return () => window.removeEventListener("resize", checkTouch);
  }, []);

  // On mobile/touch devices, skip Lenis entirely and use native scroll
  if (isMobile) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.04, duration: 2.0, smoothWheel: true, syncTouch: false, touchMultiplier: 1 }}>
      {children as any}
    </ReactLenis>
  );
}
