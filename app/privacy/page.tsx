import type { Metadata } from "next";
import { privacyContent } from "@/content/privacy";

export const metadata: Metadata = { title: "Privacy", description: "Privacy information for the MH Rehman studio website.", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return <main className="phase-page section-wrap"><p className="eyebrow">Privacy</p><h1 className="phase-title">Your information <span className="hero-accent">and this site.</span></h1><p className="phase-lede">{privacyContent.introduction}</p><section className="about-placeholder" aria-labelledby="privacy-details"><h2 className="phase-subtitle" id="privacy-details">Policy details needed</h2><p>{privacyContent.details}</p></section></main>;
}
