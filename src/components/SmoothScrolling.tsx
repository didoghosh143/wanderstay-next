"use client";

import { ReactLenis } from "@studio-freight/react-lenis";
import { ReactNode } from "react";

export function SmoothScrolling({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.04, duration: 2.0, smoothWheel: true, syncTouch: true, touchMultiplier: 2 }}>
      {children as any}
    </ReactLenis>
  );
}
