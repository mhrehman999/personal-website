export type Partner = {
  name: string;
  mark: "ribbon" | "orbit" | "monogram" | "spark";
  logoSrc?: string;
};

// Replace the labelled examples with approved partner names and logo paths.
export const partners: Partner[] = [];

export const samplePartners: Partner[] = [
  { name: "Sample partner 01", mark: "ribbon" },
  { name: "Sample partner 02", mark: "orbit" },
  { name: "Sample partner 03", mark: "monogram" },
  { name: "Sample partner 04", mark: "spark" },
];
