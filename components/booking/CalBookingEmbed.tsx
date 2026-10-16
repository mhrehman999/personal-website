"use client";

import { useEffect, useState } from "react";
import Cal, { getCalApi, type EmbedEvent } from "@calcom/embed-react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { calLink, email } from "@/content/site";
import palette from "@/content/palette.json";
import { getBookingLocation } from "@/lib/booking";

const booking = getBookingLocation(calLink);
const namespace = "studio-discovery";
const themeVars = { "cal-brand": palette.blue, "cal-brand-emphasis": palette.black, "cal-brand-text": palette.cloud, "cal-brand-accent": palette.orange, "cal-bg": palette.cloud, "cal-bg-subtle": palette.cloud, "cal-bg-emphasis": palette.sky, "cal-text": palette.black, "cal-text-emphasis": palette.black, "cal-text-subtle": palette.blue, "cal-border": palette.sky, "cal-border-emphasis": palette.blue };

export function CalBookingEmbed() {
  const [status, setStatus] = useState<"loading" | "ready" | "slow" | "failed">("loading");
  useEffect(() => {
    if (!booking) return;
    let active = true;
    let unsubscribe: (() => void) | undefined;
    const slow = window.setTimeout(() => { if (active) setStatus((current) => current === "loading" ? "slow" : current); }, 8000);
    const ready = () => { if (active) { clearTimeout(slow); setStatus("ready"); } };
    const failed = () => { if (active) { clearTimeout(slow); setStatus("failed"); } };
    // Current hosted bookers also emit this public event; the bundled SDK types predate it.
    const bookerEvent = (event: EmbedEvent<"*">) => { if (event.detail.type === "bookerReady") ready(); };
    void getCalApi({ namespace }).then((cal) => {
      if (!active) return;
      cal("on", { action: "linkReady", callback: ready });
      cal("on", { action: "linkFailed", callback: failed });
      cal("on", { action: "*", callback: bookerEvent });
      cal("ui", { theme: "light", layout: "month_view", cssVarsPerTheme: { light: themeVars, dark: themeVars } });
      unsubscribe = () => { cal("off", { action: "linkReady", callback: ready }); cal("off", { action: "linkFailed", callback: failed }); cal("off", { action: "*", callback: bookerEvent }); };
    }).catch(failed);
    return () => { active = false; clearTimeout(slow); unsubscribe?.(); };
  }, []);

  if (!booking) return <div className="booking-empty"><CalendarDays aria-hidden="true" /><h3>Let&apos;s find a time together.</h3><p>Send a little context about the project and we can arrange the conversation by email.</p><a className="text-link" href={`mailto:${email}?subject=Discovery%20call`}>Email Haris <span aria-hidden="true">↗</span></a></div>;
  return <div className="booking-embed-shell" data-state={status} data-lenis-prevent aria-busy={status === "loading"}>
    {status !== "ready" && <div className="booking-status" role="status"><span className="booking-status-icon" aria-hidden="true"><CalendarDays /></span><div><h3>{status === "loading" ? "Loading available times." : status === "slow" ? "The calendar is taking a little longer." : "Let's find another way to connect."}</h3><p>{status === "loading" ? "The calendar will appear here. You can also open it directly below." : "Use the direct calendar link below, or send a project enquiry and we can take it from there."}</p></div></div>}
    {status === "loading" && <div className="booking-calendar-skeleton" aria-hidden="true">{Array.from({ length: 28 }, (_, index) => <span key={index} />)}</div>}
    <details className="booking-cal-reveal" open={status === "loading" || status === "ready"}><summary>Show calendar here <ChevronDown aria-hidden="true" /></summary><Cal className="booking-cal-instance" calLink={booking.path} calOrigin={booking.origin} namespace={namespace} style={{ width: "100%", height: "auto", overflow: "visible" }} config={{ layout: "month_view", theme: "light", iframeAttrs: { title: "Choose a consultation time with Muhammad Haris Rehman" } }} /></details>
  </div>;
}
