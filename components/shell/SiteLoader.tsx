"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

const percentages = Array.from({ length: 101 }, (_, index) => index);

export function SiteLoader({ onStart, onReveal, onComplete }: { onStart: () => void; onReveal: () => void; onComplete: () => void }) {
  const surface = useRef<HTMLElement>(null);
  const [leaving, setLeaving] = useState(false);
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    // Query synchronously as well: the preference provider hydrates after this child.
    if (reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onComplete();
      return;
    }

    let cancelled = false;
    let exiting = false;
    let frame = 0;
    let holdTimer = 0;
    let exitTimer = 0;
    let completed = 0;
    let progress = 0;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    surface.current?.setAttribute("data-active", "");
    root.classList.add("is-loading-site");
    root.style.overflow = "hidden";
    onStart();

    const preventScroll = (event: Event) => event.preventDefault();
    const preventScrollKeys = (event: KeyboardEvent) => {
      if ([" ", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(event.key)) event.preventDefault();
    };
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventScrollKeys);

    // Covers and fonts matter to the first frame. Full video downloads never gate entry.
    const covers = Array.from(document.querySelectorAll<HTMLImageElement>(".home-hero img, .site-header img"));
    const assets = [document.fonts.ready, ...covers.map(image => image.decode())];
    assets.forEach(asset => void Promise.resolve(asset).catch(() => {}).then(() => { if (!cancelled) completed += 1; }));

    const paint = (value: number) => surface.current?.style.setProperty("--loader-progress", String(value));
    const finish = () => {
      if (cancelled || exiting) return;
      exiting = true;
      cancelAnimationFrame(frame);
      paint(100);
      holdTimer = window.setTimeout(() => {
        if (cancelled) return;
        setLeaving(true);
        onReveal();
        exitTimer = window.setTimeout(onComplete, 600);
      }, 130);
    };

    const started = performance.now();
    let previous = started;
    const tick = (now: number) => {
      if (cancelled || exiting) return;
      const elapsed = now - started;
      const elapsedFraction = Math.min(1, elapsed / 2000);
      const timeTarget = 2 + 92 * (1 - Math.cos(Math.PI * elapsedFraction)) / 2;
      const assetCap = 15 + completed / assets.length * 79;
      const target = elapsedFraction === 1 && completed === assets.length ? 100 : Math.min(timeTarget, assetCap);
      progress += (target - progress) * (1 - Math.exp(-Math.min(now - previous, 100) / 85));
      previous = now;
      paint(progress);
      if (progress >= 99.6) finish(); else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    // Failed/slow fonts, decoding, or a background tab cannot strand the overlay.
    const fallback = window.setTimeout(finish, 4500);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      clearTimeout(fallback);
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      root.style.overflow = previousOverflow;
      root.classList.remove("is-loading-site");
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventScrollKeys);
    };
  }, [onStart, onReveal, onComplete, reducedMotion]);

  return <>
    <aside className={`site-loader${leaving ? " is-leaving" : ""}`} ref={surface} role="status" aria-label="Loading portfolio" aria-live="polite" data-lenis-prevent>
      <span className="visually-hidden">Preparing the portfolio.</span>
      <div className="site-loader-content" aria-hidden="true">
        <div className="site-loader-progress"><i /></div>
        <div className="site-loader-signature"><picture className="site-loader-logo"><source media="(max-width: 767px)" srcSet="/brand/logo-square.png" /><img src="/brand/logo-wide.png" width="148" height="56" alt="" /></picture><span>Independent design studio</span></div>
        <div className="site-loader-message"><span className="site-loader-kicker">A little anticipation.</span><p><span>Good design</span><span>makes a <em>difference.</em></span></p><span className="site-loader-note">Branding. Pitch decks. Presentations.</span></div>
        <div className="site-loader-bottom"><span className="site-loader-bottom-note">Setting the stage.</span><div className="site-loader-counter"><div className="site-loader-counter-stack">{percentages.map(value => <span key={value}>{value}<small>%</small></span>)}</div></div><span className="site-loader-bottom-note">Made to be noticed.</span></div>
      </div>
    </aside>
    <noscript><style>{`.site-loader { display: none !important; }`}</style></noscript>
  </>;
}
