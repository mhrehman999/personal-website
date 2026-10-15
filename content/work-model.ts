export type WorkCategory = "branding" | "pitch-deck" | "social-media" | "presentation-design";

export type WorkProject = {
  slug: string;
  title: string;
  client: string;
  category: WorkCategory;
  year: string;
  coverImage: string;
  coverAlt: string;
  galleryImages: string[];
  summary: string;
  role: string;
  hasCoverImage: boolean;
};
