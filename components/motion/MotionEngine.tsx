"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motionTokens } from "@/lib/motion";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

export function MotionEngine({ children }: { children: ReactNode }) {
  const { reducedMotion } = useMotionPreferences();
  const refreshRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let cancelled = false;
    let revertMatchMedia: (() => void) | undefined;

    async function initialize() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(min-width: 0px)", () => {
        if (reducedMotion) return;

        let lenis: import("lenis").default | null = null;
        let removeScrollListener: (() => void) | undefined;
        let removeAnchorListener: (() => void) | undefined;
        let removeImageListeners: (() => void) | undefined;
        let tick: ((time: number) => void) | undefined;

        void import("lenis").then(({ default: Lenis }) => {
          if (cancelled) return;
          lenis = new Lenis({
            lerp: motionTokens.scroll.lerp,
            smoothWheel: motionTokens.scroll.smoothWheel,
            syncTouch: motionTokens.scroll.syncTouch,
            autoRaf: false,
          });

          const activeLenis = lenis;
          tick = (time) => activeLenis.raf(time * 1000);
          gsap.ticker.add(tick);
          gsap.ticker.lagSmoothing(0);
          activeLenis.on("scroll", ScrollTrigger.update);

          const onAnchorClick = (event: MouseEvent) => {
            const target = event.target;
            if (!(target instanceof Element)) return;
            const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');
            const href = anchor?.getAttribute("href");
            if (!anchor || !href || href === "#") return;

            const section = document.querySelector<HTMLElement>(href);
            if (!section) return;
            event.preventDefault();
            activeLenis.scrollTo(section, { offset: -80, duration: motionTokens.duration.slow / 1000 });
          };
          document.addEventListener("click", onAnchorClick);
          removeAnchorListener = () => document.removeEventListener("click", onAnchorClick);

          const refresh = () => ScrollTrigger.refresh();
          refreshRef.current = refresh;
          void document.fonts.ready.then(refresh);
          const images = Array.from(document.images).filter((image) => !image.complete);
          images.forEach((image) => image.addEventListener("load", refresh, { once: true }));
          removeImageListeners = () => images.forEach((image) => image.removeEventListener("load", refresh));
          window.addEventListener("load", refresh, { once: true });
          removeScrollListener = () => window.removeEventListener("load", refresh);
        });

        return () => {
          removeAnchorListener?.();
          removeImageListeners?.();
          removeScrollListener?.();
          if (tick) gsap.ticker.remove(tick);
          lenis?.destroy();
          refreshRef.current = null;
        };
      });
      revertMatchMedia = () => media.revert();
    }

    void initialize();
    return () => {
      cancelled = true;
      revertMatchMedia?.();
      refreshRef.current = null;
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
