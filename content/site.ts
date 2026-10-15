export type NavigationItem = { label: string; href: string };

export const brandName = "MH Rehman"; // TODO: confirm brand name.
export const email = "contact@mhrehman.com";
export const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, ""); // TODO: add country code first.
export const calLink = process.env.NEXT_PUBLIC_CAL_LINK ?? ""; // TODO: add the Cal.com booking URL.
export const socials: { label: string; href: string }[] = []; // TODO: add social links.
export const navigation: NavigationItem[] = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
export const availability = { show: false, label: "" }; // TODO: confirm whether to show availability and its label.
export const stats: { label: string; value: string }[] = []; // Hidden when empty; TODO: add only verified stats.
