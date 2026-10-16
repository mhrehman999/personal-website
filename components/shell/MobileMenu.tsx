"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { brandName, navigation } from "@/content/site";
import { isActive } from "@/components/shell/Header";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { BrandLogo } from "@/components/shell/BrandLogo";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const panel = useRef<HTMLElement>(null);
  const { reducedMotion: shouldReduce } = useMotionPreferences();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const focusable = () => panel.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    const first = panel.current?.querySelector<HTMLButtonElement>(".menu-close");
    first?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
      if (event.key !== "Tab") return;
      const items = Array.from(focusable() ?? []);
      if (!items.length) return;
      const firstItem = items[0];
      const lastItem = items.at(-1);
      if (!panel.current?.contains(document.activeElement)) { event.preventDefault(); firstItem?.focus(); }
      else if (event.shiftKey && document.activeElement === firstItem) { event.preventDefault(); lastItem?.focus(); }
      else if (!event.shiftKey && document.activeElement === lastItem) { event.preventDefault(); firstItem?.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    const onResize = () => { if (window.matchMedia("(min-width: 1024px)").matches) onClose(); };
    window.addEventListener("resize", onResize);
    return () => { document.documentElement.style.overflow = previousOverflow; document.removeEventListener("keydown", onKeyDown); window.removeEventListener("resize", onResize); };
  }, [open, onClose]);

  const transition = shouldReduce ? { duration: 0.15 } : { duration: 0.32, ease: [0.16, 1, 0.3, 1] as const };
  return (
    <AnimatePresence onExitComplete={() => document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus({ preventScroll: true })}>
      {open && <motion.section id="mobile-menu" ref={panel} className="mobile-menu" role="dialog" aria-modal="true" aria-label="Site menu" data-lenis-prevent initial={{ opacity: 0, y: shouldReduce ? 0 : 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: shouldReduce ? 0 : 16 }} transition={transition}>
        <div className="mobile-menu-top"><BrandLogo name={brandName} context="menu" onClick={onClose} /><motion.button className="menu-close" type="button" onClick={onClose} aria-label="Close menu" whileTap={shouldReduce ? undefined : { scale: .92 }}><motion.svg viewBox="0 0 24 24" fill="none" aria-hidden="true" initial={{ rotate: shouldReduce ? 0 : -90 }} animate={{ rotate: 0 }} transition={{ duration: .3, ease: "easeOut" }}><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></motion.svg></motion.button></div>
        <nav className="mobile-menu-nav" aria-label="Mobile navigation">
          {navigation.map((item, index) => <motion.div key={item.href} initial={{ opacity: 0, y: shouldReduce ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: shouldReduce ? 0 : index * 0.04 }}><Link className={`mobile-menu-link${isActive(pathname, item.href) ? " is-active" : ""}`} href={item.href} aria-current={isActive(pathname, item.href) ? "page" : undefined} onClick={onClose}><span className="mobile-menu-index">0{index + 1}</span>{item.label}<span className="mobile-menu-arrow" aria-hidden="true">↗</span></Link></motion.div>)}
        </nav>
        <p className="mobile-menu-foot">Ideas, shaped with intention.</p>
      </motion.section>}
    </AnimatePresence>
  );
}
