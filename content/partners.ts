export type Partner = {
  name: string;
  mark?: "ribbon" | "orbit" | "monogram" | "spark";
  logoSrc: string;
  logoWidth: number;
  logoHeight: number;
  surface: "dark" | "light";
};

export const partners: Partner[] = [
  { name: "Al Rajhi Bank", logoSrc: "/partners/al-rajhi.png", logoWidth: 128, logoHeight: 128, surface: "dark" },
  { name: "Aon", logoSrc: "/partners/aon.png", logoWidth: 1589, logoHeight: 601, surface: "dark" },
  { name: "Accenture", logoSrc: "/partners/accenture.png", logoWidth: 128, logoHeight: 128, surface: "dark" },
  { name: "AT&T", logoSrc: "/partners/att.png", logoWidth: 128, logoHeight: 128, surface: "dark" },
  { name: "ASUS", logoSrc: "/partners/asus.png", logoWidth: 1568, logoHeight: 324, surface: "light" },
];
