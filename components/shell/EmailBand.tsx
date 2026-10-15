"use client";

import { useId, useRef, useState } from "react";
import { motion } from "motion/react";
import { email } from "@/content/site";
import { track } from "@/lib/analytics";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

export function EmailBand() {
  const labelId = `email-band-label-${useId().replace(/:/g, "")}`;
  const [copied, setCopied] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const timer = useRef<number | undefined>(undefined);
  const { reducedMotion: reduceMotion } = useMotionPreferences();

  async function copyEmail() {
    let success = false;
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(email);
      else success = legacyCopy();
      success = success || Boolean(navigator.clipboard?.writeText);
    } catch { success = legacyCopy(); }
    if (!success) { setAnnouncement("Unable to copy. Select the email address to copy it."); return; }
    track("email_copy");
    setCopied(true);
    setAnnouncement("Email address copied");
    if ("vibrate" in navigator) navigator.vibrate?.(10);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => { setCopied(false); setAnnouncement(""); }, 2000);
  }

  function legacyCopy() {
    const textarea = document.createElement("textarea");
    textarea.value = email;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    const success = document.execCommand("copy");
    textarea.remove();
    return success;
  }

  return <section className="email-band" aria-labelledby={labelId}><div className="email-band-inner"><div className="email-band-copy"><p id={labelId} className="eyebrow">Prefer email?</p><a className="email-band-address" href={`mailto:${email}`} onClick={() => track("email_mailto")}><span>{email}</span></a></div><div className="email-band-actions"><button className="email-copy-button" type="button" onClick={copyEmail} aria-label={copied ? "Email address copied" : "Copy email address"}><span>{copied ? "Copied" : "Copy"}</span><span className="email-copy-icon" aria-hidden="true"><motion.svg viewBox="0 0 20 20" initial={false} animate={copied ? "copied" : "idle"} aria-hidden="true"><motion.path d="M4 10.5 8 14l8-9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" variants={{ idle: { pathLength: 0, opacity: 0 }, copied: { pathLength: 1, opacity: 1 } }} transition={{ duration: reduceMotion ? 0.2 : 0.4 }} /></motion.svg></span></button><a className="email-write-button" href={`mailto:${email}?subject=${encodeURIComponent("Project enquiry")}`} onClick={() => track("email_mailto")}>Write an email <span aria-hidden="true">↗</span></a></div><span className="visually-hidden" aria-live="polite" aria-atomic="true">{announcement}</span></div></section>;
}
