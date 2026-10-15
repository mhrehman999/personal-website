"use client";

import { whatsappNumber } from "@/content/site";
import { track } from "@/lib/analytics";
import { WhatsAppGlyph } from "@/components/shell/Header";

export function WhatsAppWidget({ hidden }: { hidden: boolean }) {
  const configuredHref = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi, I would like to discuss a project.")}` : "/contact";
  return <a className={`whatsapp-widget${hidden ? " is-menu-open" : ""}`} href={configuredHref} target={whatsappNumber ? "_blank" : undefined} rel={whatsappNumber ? "noopener noreferrer" : undefined} aria-label={whatsappNumber ? "Chat on WhatsApp" : "WhatsApp is not configured. Start a project"} aria-hidden={hidden} tabIndex={hidden ? -1 : 0} onClick={() => { if (whatsappNumber) track("whatsapp_click"); }}>
    <span className="whatsapp-widget-icon"><WhatsAppGlyph /></span><span className="whatsapp-widget-label">{whatsappNumber ? "Chat on WhatsApp" : "Start a project"}</span>
  </a>;
}
