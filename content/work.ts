import "server-only";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import type { WorkCategory, WorkProject } from "@/content/work-model";

const workDirectory = join(process.cwd(), "content", "work");
const publicDirectory = join(process.cwd(), "public");
const categories = new Set<WorkCategory>(["branding", "pitch-deck", "social-media", "presentation-design"]);

function isString(value: unknown): value is string { return typeof value === "string"; }

function readProject(fileName: string): WorkProject {
  const path = join(workDirectory, fileName);
  const data = JSON.parse(readFileSync(path, "utf8")) as Record<string, unknown>;
  const valid = isString(data.slug) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)
    && isString(data.title) && isString(data.client) && isString(data.category) && categories.has(data.category as WorkCategory)
    && isString(data.year) && isString(data.coverImage) && data.coverImage.startsWith("/work/")
    && isString(data.summary) && isString(data.role)
    && (data.coverVideo === undefined || (isString(data.coverVideo) && /^\/work\/[a-z0-9-]+\/preview\.mp4$/.test(data.coverVideo)))
    && (data.coverAlt === undefined || isString(data.coverAlt))
    && (data.galleryImages === undefined || (Array.isArray(data.galleryImages) && data.galleryImages.every((image) => isString(image) && image.startsWith("/work/"))));
  if (!valid) throw new Error(`Invalid portfolio project in content/work/${fileName}. Check the required fields and category slug.`);

  const galleryImages = Array.isArray(data.galleryImages) ? (data.galleryImages as string[]).filter((image) => {
    const imagePath = resolve(publicDirectory, `.${image.replaceAll("/", sep)}`);
    return imagePath.startsWith(`${publicDirectory}${sep}`) && existsSync(imagePath);
  }) : [];
  const coverImage = data.coverImage as string;
  const coverPath = resolve(publicDirectory, `.${coverImage.replaceAll("/", sep)}`);
  if (!coverPath.startsWith(`${publicDirectory}${sep}`)) throw new Error(`Project cover path escapes /public: ${fileName}`);

  return {
    slug: data.slug as string,
    title: data.title as string,
    client: data.client as string,
    category: data.category as WorkCategory,
    year: data.year as string,
    coverImage,
    coverVideo: isString(data.coverVideo) ? data.coverVideo : undefined,
    coverAlt: isString(data.coverAlt) && data.coverAlt ? data.coverAlt : `TODO: Add approved alt text for ${data.title as string}.`,
    galleryImages,
    summary: data.summary as string,
    role: data.role as string,
    hasCoverImage: existsSync(coverPath),
  };
}

export const workProjects: WorkProject[] = readdirSync(workDirectory)
  .filter((fileName) => fileName.toLowerCase().endsWith(".json"))
  .sort((left, right) => left.localeCompare(right))
  .map(readProject);

export const homeProjects = workProjects.filter((project) => project.coverVideo);
