"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode, type ElementType } from "react";
import { motionEases, motionTokens } from "@/lib/motion";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function ScrollReveal({ children, className = "", delay = 0 }: RevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    const element = elementRef.current!;
    if (!element) return;
    const readyClass = reducedMotion ? "motion-reveal-ready--reduced" : "motion-reveal-ready";
    let cancelled = false;
    let revertMatchMedia: (() => void) | undefined;

    async function animate() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      element.classList.add(readyClass);
      const media = gsap.matchMedia();
      media.add("(min-width: 0px)", () => {
        const duration = reducedMotion ? motionTokens.duration.fast : motionTokens.duration.slow;
        const tween = gsap.fromTo(
          element,
          reducedMotion ? { opacity: 0 } : { opacity: 0, y: motionTokens.reveal.distance },
          {
            opacity: 1,
            ...(reducedMotion ? {} : { y: 0 }),
            duration: duration / 1000,
            delay: reducedMotion ? 0 : delay / 1000,
            ease: motionEases.out,
            scrollTrigger: { trigger: element, start: motionTokens.reveal.trigger, once: true },
            onStart: () => gsap.set(element, { willChange: reducedMotion ? "opacity" : "transform, opacity" }),
            onComplete: () => {
              gsap.set(element, { clearProps: "willChange,transform,opacity" });
              element.classList.remove(readyClass);
            },
          },
        );
        return () => {
          tween.kill();
          gsap.set(element, { clearProps: "willChange,transform,opacity" });
          element.classList.remove(readyClass);
        };
      });
      revertMatchMedia = () => media.revert();
    }

    void animate();
    return () => {
      cancelled = true;
      revertMatchMedia?.();
      element.classList.remove("motion-reveal-ready", "motion-reveal-ready--reduced");
    };
  }, [delay, reducedMotion]);

  return <div ref={elementRef} className={className}>{children}</div>;
}

export function ScrollRevealGroup({ children, className = "" }: Omit<RevealProps, "delay">) {
  const groupRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    const items = Array.from(group.querySelectorAll<HTMLElement>("[data-reveal-item]"));
    if (items.length === 0) return;
    const readyClass = reducedMotion ? "motion-reveal-ready--reduced" : "motion-reveal-ready";
    let cancelled = false;
    let revertMatchMedia: (() => void) | undefined;

    async function animate() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      items.forEach((item) => item.classList.add(readyClass));

      const media = gsap.matchMedia();
      media.add("(min-width: 0px)", () => {
        const duration = reducedMotion ? motionTokens.duration.fast : motionTokens.duration.slow;
        const tween = gsap.fromTo(
          items,
          reducedMotion ? { opacity: 0 } : { opacity: 0, y: motionTokens.reveal.distance },
          {
            opacity: 1,
            ...(reducedMotion ? {} : { y: 0 }),
            duration: duration / 1000,
            stagger: reducedMotion ? 0 : motionTokens.reveal.stagger / 1000,
            ease: motionEases.out,
            scrollTrigger: { trigger: group, start: motionTokens.reveal.trigger, once: true },
            onStart: () => gsap.set(items, { willChange: reducedMotion ? "opacity" : "transform, opacity" }),
            onComplete: () => {
              gsap.set(items, { clearProps: "willChange,transform,opacity" });
              items.forEach((item) => item.classList.remove(readyClass));
            },
          },
        );
        return () => {
          tween.kill();
          gsap.set(items, { clearProps: "willChange,transform,opacity" });
          items.forEach((item) => item.classList.remove(readyClass));
        };
      });
      revertMatchMedia = () => media.revert();
    }

    void animate();
    return () => {
      cancelled = true;
      revertMatchMedia?.();
      items.forEach((item) => item.classList.remove("motion-reveal-ready", "motion-reveal-ready--reduced"));
    };
  }, [reducedMotion]);

  return <div ref={groupRef} className={className}>{children}</div>;
}

export function MaskedHeadline({ lines, className = "", as = "h2", id, wordByWord = false, animateOnLoad = false }: { lines: ReactNode[]; className?: string; as?: "h1" | "h2"; id?: string; wordByWord?: boolean; animateOnLoad?: boolean }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    if (animateOnLoad) return;
    const heading = headingRef.current!;
    if (!heading) return;
    const readyClass = reducedMotion ? "motion-headline-ready--reduced" : "motion-headline-ready";
    let cancelled = false;
    let revertMatchMedia: (() => void) | undefined;

    async function animate() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      heading.classList.add(readyClass);
      const lineElements = Array.from(heading.querySelectorAll<HTMLElement>("[data-motion-line]"));
      const media = gsap.matchMedia();
      media.add("(min-width: 0px)", () => {
        const tween = gsap.fromTo(
          lineElements,
          reducedMotion ? { opacity: 0 } : { opacity: 0, yPercent: 110 },
          {
            opacity: 1,
            ...(reducedMotion ? {} : { yPercent: 0 }),
            duration: (reducedMotion ? motionTokens.duration.fast : motionTokens.duration.hero) / 1000,
            stagger: reducedMotion ? 0 : wordByWord ? 0.12 : motionTokens.reveal.stagger / 1000,
            ease: motionEases.out,
            ...(animateOnLoad ? {} : { scrollTrigger: { trigger: heading, start: motionTokens.reveal.trigger, once: true } }),
            onStart: () => gsap.set(lineElements, { willChange: reducedMotion ? "opacity" : "transform, opacity" }),
            onComplete: () => {
              gsap.set(lineElements, { clearProps: "willChange,transform,opacity" });
              heading.classList.remove(readyClass);
            },
          },
        );
        return () => {
          tween.kill();
          gsap.set(lineElements, { clearProps: "willChange,transform,opacity" });
          heading.classList.remove(readyClass);
        };
      });
      revertMatchMedia = () => media.revert();
    }

    void animate();
    return () => {
      cancelled = true;
      revertMatchMedia?.();
      heading.classList.remove("motion-headline-ready", "motion-headline-ready--reduced");
    };
  }, [animateOnLoad, lines, reducedMotion, wordByWord]);

  const Heading = as as ElementType;
  return (
    <Heading ref={headingRef} className={`${className}${animateOnLoad ? " motion-headline-on-load" : ""}`} id={id}>
      {lines.map((line, index) => (
        <span className={wordByWord ? "motion-word-mask" : "motion-line-mask"} key={index} style={wordByWord ? { "--word-index": index } as CSSProperties : undefined}>
          <span data-motion-line>{line}</span>
        </span>
      ))}
    </Heading>
  );
}
