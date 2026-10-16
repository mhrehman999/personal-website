"use client";

import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Select from "@radix-ui/react-select";
import { ArrowUpRight, Check, ChevronDown } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { motion } from "motion/react";
import { contactSchema, type ContactValues } from "@/lib/contact-schema";
import { services } from "@/content/services";
import { track } from "@/lib/analytics";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

type InitialSelection = { service?: string; items?: { service: string; sub: string }[]; message?: string };

export function ContactForm({ initial = {} }: { initial?: InitialSelection }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const [token, setToken] = useState("");
  const [currentItems, setCurrentItems] = useState(initial.items ?? []);
  const { reducedMotion } = useMotionPreferences();
  const turnstile = useRef<TurnstileInstance>(undefined);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const selectedItems = currentItems;
  const defaultMessage = selectedItems.length ? `I’m interested in: ${selectedItems.map((item) => {
    const service = services.find((entry) => entry.slug === item.service);
    const sub = service?.subServices.find((entry) => entry.id === item.sub);
    return `${service?.title ?? item.service} — ${sub?.label ?? item.sub}`;
  }).join("; ")}.\n\n` : initial.message ?? "";
  const { register, control, handleSubmit, formState: { errors }, setValue } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", service: initial.service ?? "", items: selectedItems, message: defaultMessage, website: "", turnstileToken: "" },
  });

  async function submit(values: ContactValues) {
    setStatus("submitting"); setServerError("");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...values, turnstileToken: token }) });
      const result = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "We couldn’t send your message. Please try again.");
      track("form_submit"); setStatus("success");
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "We couldn’t send your message. Please try again.");
      setStatus("error"); turnstile.current?.reset(); setToken(""); setValue("turnstileToken", "");
    }
  }

  if (status === "success") return <div className="contact-success" role="status"><motion.svg viewBox="0 0 64 64" aria-hidden="true"><motion.circle cx="32" cy="32" r="27" fill="none" stroke="currentColor" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reducedMotion ? 0.2 : 0.4, ease: [0.16, 1, 0.3, 1] }} /><motion.path d="m18 33 9 9 20-21" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reducedMotion ? 0.2 : 0.4, delay: reducedMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }} /></motion.svg><p className="eyebrow">Message received</p><h2>Thanks for getting in touch.</h2><p>Your note is on its way. We’ll reply as soon as we can.</p></div>;

  return <form className="contact-form" onSubmit={handleSubmit(submit)} noValidate>
    <div className="form-grid"><div className="form-field"><label className="field-label" htmlFor="contact-name">Name</label><input className="form-control" id="contact-name" autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "contact-name-error" : undefined} {...register("name")} />{errors.name && <small className="field-error" id="contact-name-error">{errors.name.message}</small>}</div>
    <div className="form-field"><label className="field-label" htmlFor="contact-email">Email</label><input className="form-control" id="contact-email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "contact-email-error" : undefined} {...register("email")} />{errors.email && <small className="field-error" id="contact-email-error">{errors.email.message}</small>}</div>
    <div className="form-field"><label className="field-label" htmlFor="contact-phone">WhatsApp or phone <span>(optional)</span></label><input className="form-control" id="contact-phone" type="tel" autoComplete="tel" {...register("phone")} /></div>
    <div className="form-field"><label className="field-label" htmlFor="contact-service">Service</label><Controller name="service" control={control} render={({ field }) => <Select.Root name={field.name} value={field.value || "unsure"} onValueChange={(value) => field.onChange(value === "unsure" ? "" : value)}><Select.Trigger id="contact-service" ref={field.ref} onBlur={field.onBlur} className="form-control contact-select-trigger"><Select.Value>{services.find((service) => service.slug === field.value)?.title ?? "Not sure yet"}</Select.Value><Select.Icon><ChevronDown aria-hidden="true" /></Select.Icon></Select.Trigger><Select.Portal><Select.Content className="contact-service-menu" position="popper" sideOffset={8} collisionPadding={16} data-lenis-prevent><Select.Viewport>{[{ slug: "unsure", title: "Not sure yet" }, ...services].map((service) => <Select.Item className="contact-service-option" key={service.slug} value={service.slug}><Select.ItemText>{service.title}</Select.ItemText><Select.ItemIndicator><Check aria-hidden="true" /></Select.ItemIndicator></Select.Item>)}</Select.Viewport></Select.Content></Select.Portal></Select.Root>} /></div>
    {selectedItems.length > 0 && <div className="form-field form-field-wide"><span className="field-label">Selected sub-services</span><div className="selection-chips" role="group" aria-label="Selected sub-services">{selectedItems.map((item) => { const service = services.find((entry) => entry.slug === item.service); const sub = service?.subServices.find((entry) => entry.id === item.sub); return <span className="selection-chip" key={`${item.service}:${item.sub}`}>{service?.title ?? item.service} <span aria-hidden="true">›</span> {sub?.label ?? item.sub}<button type="button" aria-label={`Remove ${service?.title ?? item.service}: ${sub?.label ?? item.sub}`} onClick={() => { const next = selectedItems.filter((entry) => !(entry.service === item.service && entry.sub === item.sub)); setCurrentItems(next); setValue("items", next); }}>×</button></span>; })}</div></div>}
    <div className="form-field form-field-wide"><label className="field-label" htmlFor="contact-message">Tell us about your project</label><textarea className="form-control form-textarea" id="contact-message" rows={6} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "contact-message-error" : undefined} {...register("message")} />{errors.message && <small className="field-error" id="contact-message-error">{errors.message.message}</small>}</div></div>
    <div className="honeypot-field" aria-hidden="true"><label htmlFor="contact-website">Leave this field empty</label><input id="contact-website" tabIndex={-1} autoComplete="off" {...register("website")} /></div>
    {siteKey && <div className="turnstile-invisible"><Turnstile ref={turnstile} siteKey={siteKey} options={{ size: "invisible", theme: "dark" }} onSuccess={(value) => { setToken(value); setValue("turnstileToken", value); }} onExpire={() => { setToken(""); setValue("turnstileToken", ""); }} onError={() => setServerError("Spam protection could not load. Please use the email link instead.")} /></div>}
    {serverError && <p className="form-server-error" role="alert">{serverError} <a href="mailto:contact@mhrehman.com">Email us directly.</a></p>}
    <div className="contact-submit-row"><button className="button button-primary" type="submit" aria-busy={status === "submitting"} aria-describedby={siteKey && !token && !serverError ? "contact-protection-status" : undefined} disabled={status === "submitting" || Boolean(siteKey && !token)}><span>{status === "submitting" ? "Sending…" : "Send project enquiry"}</span><span className={`button-icon${status === "submitting" ? " button-spinner" : ""}`} aria-hidden="true">{status === "submitting" ? "" : <ArrowUpRight />}</span></button><span className="contact-form-note">We’ll only use your details to reply to this enquiry.</span></div>
    {siteKey && !token && !serverError && <p className="contact-protection-status" id="contact-protection-status" role="status">Checking spam protection…</p>}
    <p className="visually-hidden" aria-live="polite" aria-atomic="true">{status === "submitting" ? "Sending your message" : status === "error" ? "Message could not be sent" : ""}</p>
  </form>;
}
