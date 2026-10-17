import type { Metadata } from "next";
import localFont from "next/font/local";
import { MotionEngine } from "@/components/motion/MotionEngine";
import { MotionPreferencesProvider } from "@/components/motion/MotionPreferences";
import { SiteShell } from "@/components/shell/SiteShell";
import { Analytics } from "@vercel/analytics/next";
import { headers } from "next/headers";
import { brandName } from "@/content/site";
import "@/styles/tokens.css";
import "@/styles/globals.css";
import "@/styles/motion.css";
import "@/styles/shell.css";
import "@/styles/home.css";
import "@/styles/phase5.css";
import "@/styles/phase6.css";
import "@/styles/phase7.css";
import "@/styles/pricing.css";
import "@/styles/social-proof.css";
import "@/styles/service-preview.css";
import "@/styles/project-folder.css";
import "@/styles/section-colors.css";
import "@/styles/buttons.css";
import "@/styles/glass.css";
import "@/styles/project-media.css";
import "@/styles/final-polish.css";
import "@/styles/site-loader.css";
import "@/styles/finishing-touches.css";
import "@/styles/mobile-polish.css";
import "@/styles/inner-pages.css";
import "@/styles/contact.css";
import "@/styles/booking.css";
import "@/styles/cursor.css";

const inter = localFont({
  src: "../public/fonts/inter-latin.woff2",
  weight: "400 500",
  display: "swap",
  variable: "--font-inter",
});

const interTight = localFont({
  src: "../public/fonts/inter-tight-latin.woff2",
  weight: "600",
  display: "swap",
  variable: "--font-inter-tight",
});

const baskervville = localFont({
  src: "../public/fonts/baskervville-latin-italic.woff2",
  weight: "400",
  style: "italic",
  display: "swap",
  preload: false,
  variable: "--font-baskervville",
});

const anton = localFont({ src: "../public/fonts/anton-regular.ttf", weight: "400", display: "swap", variable: "--font-anton" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://mhrehman.com"),
  title: { default: `${brandName} — Brand & Presentation Studio`, template: `%s | ${brandName}` },
  description: "Brand identity, pitch decks, and presentation design.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: brandName, title: `${brandName} — Brand & Presentation Studio`, description: "Brand identity, pitch decks, and presentation design.", url: "/" },
  twitter: { card: "summary_large_image", title: `${brandName} — Brand & Presentation Studio`, description: "Brand identity, pitch decks, and presentation design." },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const nonce = requestHeaders.get("x-nonce") ?? undefined;
  const structuredData = [
    { "@context": "https://schema.org", "@type": "Organization", name: brandName, url: process.env.NEXT_PUBLIC_SITE_URL || "https://mhrehman.com", email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@mhrehman.com" },
    { "@context": "https://schema.org", "@type": "ProfessionalService", name: brandName, url: process.env.NEXT_PUBLIC_SITE_URL || "https://mhrehman.com", email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@mhrehman.com", description: "Brand identity, pitch decks, social media, and presentation design." },
  ];
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable} ${baskervville.variable} ${anton.variable}`}>
      <body>
        <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
        <MotionPreferencesProvider>
          <MotionEngine><SiteShell>{children}</SiteShell></MotionEngine>
          <Analytics />
        </MotionPreferencesProvider>
      </body>
    </html>
  );
}
