"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { brandName, navigation } from "@/content/site";
import { BrandLogo } from "@/components/shell/BrandLogo";

type Props = { menuOpen: boolean; onMenuOpen: () => void };

export function Header({ menuOpen, onMenuOpen }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [lowPower, setLowPower] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setLowPower(window.navigator.hardwareConcurrency <= 4);
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 40);
      const bounds = headerRef.current?.getBoundingClientRect();
      if (!bounds) return;
      // Read the surface immediately beneath the floating glass, not the header itself.
      const surface = document.elementFromPoint(window.innerWidth / 2, bounds.bottom + 2);
      setOverDark(Boolean(surface?.closest(".selected-work, .home-testimonials, .home-partners, .site-footer")));
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (frame) cancelAnimationFrame(frame); };
  }, [pathname]);

  return (
    <header ref={headerRef} className={`site-header${scrolled ? " is-scrolled" : ""}${lowPower ? " is-low-power" : ""}${overDark ? " is-over-dark" : ""}`}>
      <div className="site-header-inner">
        <BrandLogo name={brandName} context="header" />
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => <NavLink key={item.href} {...item} active={isActive(pathname, item.href)} />)}
        </nav>
        <div className="desktop-actions">
          <Link className="header-cta" href="/contact">Start a project <span aria-hidden="true">↗</span></Link>
        </div>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={onMenuOpen}>
          <span className={`menu-toggle-lines${menuOpen ? " is-open" : ""}`} aria-hidden="true"><i /><i /></span>
        </button>
      </div>
    </header>
  );
}

function NavLink({ label, href, active }: { label: string; href: string; active: boolean }) {
  return <Link className={`desktop-nav-link${active ? " is-active" : ""}`} href={href} aria-current={active ? "page" : undefined}><span>{label}</span></Link>;
}

export function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

export function WhatsAppGlyph() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.5 11.7a8.4 8.4 0 0 1-12.4 7.4L3 20.4l1.3-5a8.4 8.4 0 1 1 16.2-3.7Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M8.6 7.9c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.7c.1.2 0 .4-.1.6l-.5.6c-.2.2-.2.4 0 .7.5.8 1.2 1.5 2 2 .2.2.5.2.7 0l.7-.8c.2-.2.4-.2.6-.1l1.6.8c.3.1.4.3.4.5 0 .5-.2 1-.6 1.3-.5.5-1.2.7-2 .6-1.1-.2-2.4-.8-3.7-2-1.5-1.3-2.4-2.8-2.6-3.9-.2-.9.1-1.6.5-2Z" fill="currentColor"/></svg>;
}
