"use client";

import { useRef, type AnchorHTMLAttributes, type PointerEvent } from "react";
import Link from "next/link";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function MagneticLink({ href, onPointerMove, onPointerLeave, ...props }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { reducedMotion } = useMotionPreferences();

  function move(event: PointerEvent<HTMLAnchorElement>) {
    onPointerMove?.(event);
    if (reducedMotion || event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const distance = Math.hypot(dx, dy);
    const pull = Math.min(1, Math.max(0, (80 - distance) / 80)) * 0.5;
    ref.current.style.transform = `translate3d(${dx * pull}px, ${dy * pull}px, 0)`;
  }

  function leave(event: React.PointerEvent<HTMLAnchorElement>) {
    onPointerLeave?.(event);
    if (ref.current) ref.current.style.transform = "translate3d(0, 0, 0)";
  }

  return <Link ref={ref} href={href} {...props} onPointerMove={move} onPointerLeave={leave} />;
}
