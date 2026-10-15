"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Header } from "@/components/shell/Header";
import { MobileMenu } from "@/components/shell/MobileMenu";
import { WhatsAppWidget } from "@/components/shell/WhatsAppWidget";
import { EmailBand } from "@/components/shell/EmailBand";
import { Footer } from "@/components/shell/Footer";
import { ScrollProgress } from "@/components/shell/ScrollProgress";

export function SiteShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    const device = navigator as Navigator & { deviceMemory?: number };
    setLowPower((navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4) || (device.deviceMemory !== undefined && device.deviceMemory <= 4));
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <ScrollProgress />
      <div className={`site-background${lowPower ? " is-low-power" : ""}`} inert={menuOpen}>
        <Header menuOpen={menuOpen} onMenuOpen={() => setMenuOpen(true)} />
        <div className="site-content" id="main-content" tabIndex={-1}>{children}</div>
        <EmailBand />
        <Footer />
      </div>
      <WhatsAppWidget hidden={menuOpen} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
