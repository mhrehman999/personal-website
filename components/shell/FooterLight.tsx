"use client";

import { useEffect, useRef } from "react";

/** One compositor layer, one coalesced frame; no pointer-driven layout or React renders. */
export function FooterLight({ reducedMotion }: { reducedMotion: boolean }) {
  const light = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = light.current;
    const footer = element?.closest("footer");
    if (!element || !footer || reducedMotion) return;
    let bounds = footer.getBoundingClientRect();
    let frame = 0;
    let previousTime = 0;
    let visible = false;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    const stop = () => { cancelAnimationFrame(frame); frame = 0; previousTime = 0; };
    function tick(time: number) {
      frame = 0;
      if (!element || !visible || document.hidden) return;
      const delta = previousTime ? Math.min(64, time - previousTime) : 16.67;
      previousTime = time;
      const follow = 1 - Math.exp(-delta / 20);
      currentX += (targetX - currentX) * follow;
      currentY += (targetY - currentY) * follow;
      element.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
      if (Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > .08) frame = requestAnimationFrame(tick);
      else previousTime = 0;
    }
    function schedule() { if (!frame && visible && !document.hidden) frame = requestAnimationFrame(tick); }
    const updateBounds = () => { if (visible) bounds = footer.getBoundingClientRect(); };
    const enter = () => { bounds = footer.getBoundingClientRect(); };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      targetX = Math.max(-220, Math.min(220, (event.clientX - bounds.left - bounds.width / 2) * .5));
      targetY = Math.max(-110, Math.min(110, (event.clientY - bounds.top - bounds.height / 2) * .45));
      schedule();
    };
    const leave = () => { targetX = 0; targetY = 0; schedule(); };
    const onVisibility = () => { if (document.hidden) stop(); else leave(); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) updateBounds();
      else { stop(); currentX = currentY = targetX = targetY = 0; element.style.transform = "translate3d(0, 0, 0)"; }
    });
    observer.observe(footer);
    const resize = new ResizeObserver(updateBounds);
    resize.observe(footer);
    footer.addEventListener("pointerenter", enter, { passive: true });
    footer.addEventListener("pointermove", move, { passive: true });
    footer.addEventListener("pointerleave", leave, { passive: true });
    window.addEventListener("scroll", updateBounds, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop(); observer.disconnect(); resize.disconnect();
      footer.removeEventListener("pointerenter", enter); footer.removeEventListener("pointermove", move); footer.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", updateBounds); document.removeEventListener("visibilitychange", onVisibility);
      element.style.transform = "translate3d(0, 0, 0)";
    };
  }, [reducedMotion]);
  return <div className="footer-glow" ref={light} aria-hidden="true" />;
}
