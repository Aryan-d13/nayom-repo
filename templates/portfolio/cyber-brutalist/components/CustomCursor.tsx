'use client';

import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // Disable custom cursor on touch/mobile devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);

    // Check hover targets
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('a') ||
        target?.closest('button') ||
        target?.closest('input') ||
        target?.closest('textarea') ||
        target?.closest('[role="button"]') ||
        target?.classList.contains('cursor-pointer')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    let animationFrame: number;
    const renderLoop = () => {
      // Smooth lerp for outer reticle ring
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      animationFrame = requestAnimationFrame(renderLoop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);
    animationFrame = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 hidden md:block ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Central Solid Cyber Dot */}
      <div
        ref={cursorRef}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 will-change-transform pointer-events-none"
      >
        <div
          className={`w-2 h-2 rounded-full bg-[#FFE600] transition-transform duration-150 ${
            isClicking ? 'scale-150 bg-[#FFFFFF]' : isHovered ? 'scale-75 bg-[#00FF88]' : 'scale-100'
          }`}
        />
      </div>

      {/* Outer Tactical Targeting Ring & Crosshairs */}
      <div
        ref={ringRef}
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 will-change-transform pointer-events-none"
      >
        <div
          className={`relative rounded-full border transition-all duration-200 flex items-center justify-center ${
            isHovered
              ? 'w-11 h-11 border-[#FFE600] bg-[rgba(255,230,0,0.15)] scale-110'
              : 'w-7 h-7 border-[rgba(255,230,0,0.45)] bg-transparent scale-100'
          } ${isClicking ? 'scale-90 border-[#FFFFFF]' : ''}`}
        >
          {isHovered && (
            <>
              {/* Tactical Corner Reticle Markers */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-[2px] bg-[#FFE600]" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-[2px] bg-[#FFE600]" />
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 h-1.5 w-[2px] bg-[#FFE600]" />
              <div className="absolute top-1/2 -right-1 -translate-y-1/2 h-1.5 w-[2px] bg-[#FFE600]" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
