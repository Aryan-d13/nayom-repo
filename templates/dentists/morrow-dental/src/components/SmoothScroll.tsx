"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      autoResize: true,
    });

    window.__lenis = lenis;

    // Dispatch native scroll events when Lenis scrolls so Framer Motion's useScroll receives updates
    lenis.on("scroll", () => {
      window.dispatchEvent(new Event("scroll"));
    });

    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    // Watch for layout shifts and image loads to recalculate scroll heights automatically
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
    });

    if (document.body) {
      resizeObserver.observe(document.body);
    }

    const handleWindowResize = () => {
      lenis.resize();
    };
    window.addEventListener("resize", handleWindowResize);
    window.addEventListener("load", handleWindowResize);

    // Staggered resize calls during initial hydration and image loading
    const timer1 = setTimeout(() => lenis.resize(), 150);
    const timer2 = setTimeout(() => lenis.resize(), 600);
    const timer3 = setTimeout(() => lenis.resize(), 1500);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener("resize", handleWindowResize);
      window.removeEventListener("load", handleWindowResize);
      resizeObserver.disconnect();
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return <>{children}</>;
}

