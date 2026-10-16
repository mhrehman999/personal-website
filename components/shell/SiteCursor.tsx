"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

const nativeTargets = [
  "input", "textarea", "select", "[contenteditable]:not([contenteditable=false])",
  "[role=combobox]", "[role=listbox]", "[role=option]", "iframe", "dialog[open]",
  ":disabled", "[aria-disabled=true]", "[aria-busy=true]", "[data-native-cursor]",
  ".project-folder-handle", ".project-folder-assembly.is-dragging", ".review-rail",
].join(",");
const actions = "a[href], button, summary, [role=button], [role=link]";
const projects = ".project-card, .portfolio-card-link, .folder-project-button";

/** One pointer, one frame, no follower spring or layout measurements. */
export function SiteCursor({ enabled }: { enabled: boolean }) {
  const cursor = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    const element = cursor.current;
    if (!element || !enabled || reducedMotion) return;
    const media = window.matchMedia("(hover: hover) and (pointer: fine) and (forced-colors: none)");
    const root = document.documentElement;
    let frame = 0;
    let x = 0;
    let y = 0;
    let visible = false;
    let nativeGesture = false;
    let viewportWidth = root.clientWidth;
    let viewportHeight = root.clientHeight;

    const hide = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      visible = false;
      element.dataset.visible = "false";
      element.dataset.pressed = "false";
      root.classList.remove("has-custom-cursor");
    };

    const paint = () => {
      frame = 0;
      element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (!visible) {
        visible = true;
        element.dataset.visible = "true";
        root.classList.add("has-custom-cursor");
      }
    };

    const move = (event: PointerEvent) => {
      const target = event.target;
      if (!media.matches || event.pointerType !== "mouse" || nativeGesture ||
        !(target instanceof Element) || target.closest(nativeTargets) ||
        event.clientX < 0 || event.clientY < 0 || event.clientX >= viewportWidth || event.clientY >= viewportHeight) {
        hide();
        return;
      }
      const action = target.closest(actions);
      const state = action?.matches(projects) ? "project" : action ? "link" : "default";
      if (element.dataset.state !== state) element.dataset.state = state;
      x = event.clientX;
      y = event.clientY;
      // Coalesce rapid input into the next paint instead of queuing or restarting frames.
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const down = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") { hide(); return; }
      // Preserve selection and captured drags even when their event target changes.
      nativeGesture = event.target instanceof Element &&
        (!event.target.closest(actions) || Boolean(event.target.closest(".project-folder-assembly, .review-rail")));
      if (nativeGesture) { hide(); return; }
      move(event);
      element.dataset.pressed = "true";
    };
    const up = () => { nativeGesture = false; element.dataset.pressed = "false"; };
    const leave = (event: PointerEvent) => { if (!event.relatedTarget) hide(); };
    const visibility = () => { if (document.hidden) { nativeGesture = false; hide(); } };
    const blur = () => { nativeGesture = false; hide(); };
    const resize = () => { viewportWidth = root.clientWidth; viewportHeight = root.clientHeight; hide(); };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    window.addEventListener("pointercancel", blur, { passive: true });
    window.addEventListener("pointerout", leave, { passive: true });
    window.addEventListener("blur", blur);
    window.addEventListener("keydown", hide);
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    media.addEventListener("change", hide);

    return () => {
      hide();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", blur);
      window.removeEventListener("pointerout", leave);
      window.removeEventListener("blur", blur);
      window.removeEventListener("keydown", hide);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", visibility);
      media.removeEventListener("change", hide);
    };
  }, [enabled, pathname, reducedMotion]);

  return <div ref={cursor} className="site-cursor" data-visible="false" data-state="default" data-pressed="false" aria-hidden="true">
    <span className="site-cursor-halo" />
    <span className="site-cursor-point" />
    <span className="site-cursor-action"><span className="site-cursor-label">View</span><svg viewBox="0 0 24 24" fill="none"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
  </div>;
}
