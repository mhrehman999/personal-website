"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { brandName, navigation } from "@/content/site";
import { isActive } from "@/components/shell/Header";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const panel = useRef<HTMLElement>(null);
  const { reducedMotion: shouldReduce } = useMotionPreferences();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () => panel.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    const first = focusable()?.[0];
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
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKeyDown); };
  }, [open, onClose]);

  const transition = shouldReduce ? { duration: 0.2 } : { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const };
  return (
    <AnimatePresence onExitComplete={() => document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus()}>
      {open && <motion.section id="mobile-menu" ref={panel} className="mobile-menu" role="dialog" aria-modal="true" aria-label="Site menu" data-lenis-prevent initial={{ opacity: 0, y: shouldReduce ? 0 : 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: shouldReduce ? 0 : 16 }} transition={transition}>
        <div className="mobile-menu-top"><Link className="brand-mark" href="/" onClick={onClose}>{brandName}</Link><button className="menu-close" type="button" onClick={onClose} aria-label="Close menu">Close <span aria-hidden="true">×</span></button></div>
        <nav className="mobile-menu-nav" aria-label="Mobile navigation">
          {navigation.map((item, index) => <motion.div key={item.href} initial={{ opacity: 0, y: shouldReduce ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: shouldReduce ? 0 : index * 0.07 }}><Link className={`mobile-menu-link${isActive(pathname, item.href) ? " is-active" : ""}`} href={item.href} aria-current={isActive(pathname, item.href) ? "page" : undefined} onClick={onClose}><span className="mobile-menu-index">0{index + 1}</span>{item.label}<span className="mobile-menu-arrow" aria-hidden="true">↗</span></Link></motion.div>)}
        </nav>
        <p className="mobile-menu-foot">Ideas, shaped with intention.</p>
      </motion.section>}
    </AnimatePresence>
  );
}
