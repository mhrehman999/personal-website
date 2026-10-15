"use client";

import { useEffect, useRef } from "react";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

export function HomeCursor() {
  const cursor = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotionPreferences();
  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!media.matches || reducedMotion || window.navigator.hardwareConcurrency <= 4 || !cursor.current) return;
    const element = cursor.current;
    document.documentElement.classList.add("has-custom-cursor");
    let frame = 0;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      element.classList.add("is-visible");
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { element.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`; });
    };
    const updateTarget = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const interactive = target.closest("a, button, [role=button], input, textarea, select");
      const project = target.closest(".project-card");
      element.classList.toggle("is-active", Boolean(interactive));
      element.classList.toggle("is-view", Boolean(project));
      element.querySelector("span")!.textContent = project ? "View ↗" : "";
    };
    const hide = () => element.classList.remove("is-visible");
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", updateTarget, { passive: true });
    window.addEventListener("pointerleave", hide, { passive: true });
    return () => { cancelAnimationFrame(frame); document.documentElement.classList.remove("has-custom-cursor"); window.removeEventListener("pointermove", move); window.removeEventListener("pointerover", updateTarget); window.removeEventListener("pointerleave", hide); };
  }, [reducedMotion]);

  if (reducedMotion) return null;
  return <div ref={cursor} className="home-cursor" aria-hidden="true"><span /></div>;
}
