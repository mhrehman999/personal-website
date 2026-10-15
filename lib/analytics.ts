import { track as vercelTrack } from "@vercel/analytics";

export type StudioEvent = "whatsapp_click" | "email_copy" | "email_mailto" | "book_call_click" | "form_submit" | "package_continue";

export function track(event: StudioEvent) {
  if (typeof window === "undefined") return;
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true") vercelTrack(event);
  window.dispatchEvent(new CustomEvent("studio:analytics", { detail: { event } }));
}
