"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Header } from "@/components/shell/Header";
import { MobileMenu } from "@/components/shell/MobileMenu";
import { WhatsAppWidget } from "@/components/shell/WhatsAppWidget";
import { EmailBand } from "@/components/shell/EmailBand";
import { Footer } from "@/components/shell/Footer";
import { ScrollProgress } from "@/components/shell/ScrollProgress";
import { SiteLoader } from "@/components/shell/SiteLoader";
import { SiteCursor } from "@/components/shell/SiteCursor";

export function SiteShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lowPower, setLowPower] = useState(false);
  const [entryPhase, setEntryPhase] = useState<"pending" | "loading" | "revealing" | "ready">("pending");
  const startEntry = useCallback(() => setEntryPhase("loading"), []);
  const revealEntry = useCallback(() => setEntryPhase("revealing"), []);
  const finishEntry = useCallback(() => setEntryPhase("ready"), []);

  useEffect(() => {
    const device = navigator as Navigator & { deviceMemory?: number };
    setLowPower((navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4) || (device.deviceMemory !== undefined && device.deviceMemory <= 4));
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <ScrollProgress />
      <SiteCursor enabled={entryPhase === "ready"} />
      {entryPhase !== "ready" && <SiteLoader onStart={startEntry} onReveal={revealEntry} onComplete={finishEntry} />}
      <div className={`site-background${lowPower ? " is-low-power" : ""}`} data-entry-phase={entryPhase} inert={menuOpen || entryPhase === "loading" || entryPhase === "revealing"}>
        <Header menuOpen={menuOpen} onMenuOpen={() => setMenuOpen(true)} />
        <div className="site-content" id="main-content" tabIndex={-1}>{children}</div>
        <EmailBand />
        <Footer />
      </div>
      <WhatsAppWidget hidden={menuOpen || entryPhase !== "ready"} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
