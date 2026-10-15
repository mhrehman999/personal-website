"use client";

import { useLayoutEffect, useRef, type CSSProperties, type ReactNode, type ElementType, type RefObject } from "react";
import { motionTokens } from "@/lib/motion";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

type RevealProps = { children: ReactNode; className?: string; delay?: number };
type EntryOptions = { selector?: string; disabled?: boolean; delay?: number; stagger?: number };

function useEntryReveal(ref: RefObject<HTMLElement | null>, { selector, disabled = false, delay = 0, stagger = 35 }: EntryOptions = {}) {
  const revealed = useRef(false);
  const { reducedMotion } = useMotionPreferences();

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || disabled || revealed.current) return;
    if (reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches || element.getBoundingClientRect().top <= window.innerHeight || !("IntersectionObserver" in window)) {
      revealed.current = true;
      return;
    }

    // Content stays visible before enhancement; a delayed observer can never hide it.
    const targets = selector ? Array.from(element.querySelectorAll<HTMLElement>(selector)) : [element];
    const animations: Animation[] = [];
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      revealed.current = true;
      observer.disconnect();
      targets.forEach((target, index) => {
        const animation = target.animate([
          { opacity: .8, transform: "translate3d(0, 12px, 0)" },
          { opacity: 1, transform: "translate3d(0, 0, 0)" },
        ], {
          duration: 420,
          delay: Math.min(delay, 100) + Math.min(index, 3) * stagger,
          easing: motionTokens.easing.out,
          fill: "backwards",
        });
        animation.onfinish = () => animation.cancel();
        animations.push(animation);
      });
    }, { rootMargin: "0px 0px 240px 0px", threshold: 0 });

    observer.observe(element);
    return () => { observer.disconnect(); animations.forEach((animation) => animation.cancel()); };
  }, [ref, selector, disabled, delay, stagger, reducedMotion]);
}

export function ScrollReveal({ children, className = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEntryReveal(ref, { delay });
  return <div ref={ref} className={className}>{children}</div>;
}

export function ScrollRevealGroup({ children, className = "" }: Omit<RevealProps, "delay">) {
  const ref = useRef<HTMLDivElement>(null);
  useEntryReveal(ref, { selector: "[data-reveal-item]" });
  return <div ref={ref} className={className}>{children}</div>;
}

export function MaskedHeadline({ lines, className = "", as = "h2", id, wordByWord = false, animateOnLoad = false }: { lines: ReactNode[]; className?: string; as?: "h1" | "h2"; id?: string; wordByWord?: boolean; animateOnLoad?: boolean }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEntryReveal(ref, { selector: "[data-motion-line]", disabled: animateOnLoad, stagger: wordByWord ? 45 : 30 });
  const Heading = as as ElementType;

  return <Heading ref={ref} className={`${className}${animateOnLoad ? " motion-headline-on-load" : ""}`} id={id}>
    {lines.map((line, index) => <span className={wordByWord ? "motion-word-mask" : "motion-line-mask"} key={index} style={wordByWord ? { "--word-index": index } as CSSProperties : undefined}>
      <span data-motion-line>{line}</span>
    </span>)}
  </Heading>;
}
