import type { Metadata } from "next";
import Link from "next/link";
import { CalBookingEmbed } from "@/components/booking/CalBookingEmbed";
import { calLink } from "@/content/site";

export const metadata: Metadata = { title: "Book a Consultation", description: "Choose a time to talk through your brand or presentation project.", alternates: { canonical: "/book-consultation" } };

export default function BookConsultationPage() {
  const configuredUrl = calLink.startsWith("http") ? calLink : `https://cal.com/${calLink.replace(/^\//, "")}`;
  const fallback = calLink ? configuredUrl : "mailto:contact@mhrehman.com?subject=Discovery%20call";
  return <main className="phase-page booking-page section-wrap"><p className="eyebrow">A first conversation</p><h1 className="phase-title">Let’s find the <span className="hero-accent">right direction.</span></h1><p className="phase-lede">Choose a time that works for you. We’ll talk through your goals, timing, and the next useful step.</p><div className="booking-embed"><CalBookingEmbed /></div><p className="booking-page-fallback">If the calendar does not appear, <a href={fallback} target={calLink ? "_blank" : undefined} rel={calLink ? "noopener noreferrer" : undefined}>open it in a new tab <span aria-hidden="true">↗</span></a> or <Link href="/contact">send a project enquiry</Link>.</p></main>;
}
