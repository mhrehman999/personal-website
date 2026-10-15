import type { MetadataRoute } from "next";
import { workProjects } from "@/content/work";
import { services } from "@/content/services";
import { absoluteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/services", "/work", "/pricing", "/about", "/contact", "/book-consultation", "/privacy"];
  return [
    ...routes.map((route) => ({ url: absoluteUrl(route || "/"), changeFrequency: "monthly" as const, priority: route === "" ? 1 : 0.7 })),
    ...services.map((service) => ({ url: absoluteUrl(`/services/${service.slug}`), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...workProjects.map((project) => ({ url: absoluteUrl(`/work/${project.slug}`), changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
