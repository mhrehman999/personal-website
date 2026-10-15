"use client";

import { useEffect, useRef } from "react";

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        if (bar.current) {
          bar.current.style.transform = `scaleX(${progress})`;
          bar.current.parentElement?.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
        }
        frame = 0;
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); if (frame) cancelAnimationFrame(frame); };
  }, []);
  return <div className="page-progress" role="progressbar" aria-label="Page scroll progress" aria-valuemin={0} aria-valuemax={100}><div ref={bar} className="page-progress-fill" /></div>;
}
