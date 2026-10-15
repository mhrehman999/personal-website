import { HomeHero } from "@/components/home/HomeHero";
import { KeywordMarquee } from "@/components/home/KeywordMarquee";
import { IntroStatement } from "@/components/home/IntroStatement";
import { ServiceRows } from "@/components/home/ServiceRows";
import { SelectedWork } from "@/components/home/SelectedWork";
import { HomeProcess } from "@/components/home/HomeProcess";
import { HomePackages } from "@/components/home/HomePackages";
import { HomeTestimonials } from "@/components/home/HomeTestimonials";
import { HomeFaq } from "@/components/home/HomeFaq";
import { HomeClosingCta } from "@/components/home/HomeClosingCta";
import { HomeCursor } from "@/components/home/HomeCursor";
import type { Metadata } from "next";
import { homeProjects } from "@/content/work";

export const metadata: Metadata = {
  title: "Brand & Presentation Studio",
  description: "Brand identity, pitch decks, social media and presentation design for founders and growing teams.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <main className="home-page" id="home-content">
    <HomeCursor />
    <HomeHero />
    <KeywordMarquee />
    <IntroStatement />
    <ServiceRows />
    <SelectedWork projects={homeProjects} />
    <HomeProcess />
    <HomePackages />
    <HomeTestimonials />
    <HomeFaq />
    <HomeClosingCta />
  </main>;
}
