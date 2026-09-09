"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { thoughtCursorContent } from "@/data/content";

export function ThoughtCursor() {
  const [enabled, setEnabled] = useState(false);
  const [thought, setThought] = useState<string | null>(null);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for cursor follower
  const springX = useSpring(mouseX, { stiffness: 400, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 400, damping: 30 });

  useEffect(() => {
    // Only enable on desktop pointers
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    setEnabled(true);

    let idleTimer: NodeJS.Timeout;
    const idleThoughts = thoughtCursorContent.idleThoughts;
    let lastThoughtIndex = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Check if hovering an element with data-thought
      const target = e.target as HTMLElement | null;
      const thoughtElement = target?.closest("[data-thought]") as HTMLElement | null;

      if (thoughtElement) {
        const customThought = thoughtElement.getAttribute("data-thought");
        setThought(customThought);
      } else {
        // Clear thought unless idle triggers one
        setThought(null);
      }

      // Check clickable elements
      const isClickable = Boolean(
        target?.closest("a, button, [role='button'], input, [data-interactive]")
      );
      setIsHoveringClickable(isClickable);

      // Idle thought trigger when user rests cursor on page (after 2.5s)
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (!thoughtElement && !isClickable && Math.random() > 0.4) {
          lastThoughtIndex = (lastThoughtIndex + 1) % idleThoughts.length;
          setThought(idleThoughts[lastThoughtIndex]);
        }
      }, 2500);
    };

    const handleMouseLeave = () => {
      setThought(null);
      clearTimeout(idleTimer);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(idleTimer);
    };
  }, [mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Subtle cursor dot */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-[#E7E6DF]/80 mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHoveringClickable ? 2.2 : thought ? 1.5 : 1,
          opacity: 0.85,
        }}
        transition={{ duration: 0.18 }}
      />

      {/* Thought bubble chip */}
      <AnimatePresence>
        {thought && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -4 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{
              left: springX,
              top: springY,
              transform: "translate(18px, 14px)",
            }}
            className="fixed top-0 left-0 z-50 px-2.5 py-1 rounded-full bg-[#101525]/90 border border-[#8096C7]/30 backdrop-blur-md shadow-lg shadow-black/40"
          >
            <span className="font-mono text-[11px] tracking-wide text-[#8096C7] select-none lowercase whitespace-nowrap">
              {thought}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
