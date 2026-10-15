"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { services } from "@/content/services";
import type { WorkProject } from "@/content/work-model";

export function WorkCard({ project, reducedMotion = false }: { project: WorkProject; reducedMotion?: boolean }) {
  const category = services.find((service) => service.slug === project.category);
  const initial = project.title.replace(/^TODO:\s*/, "").trim().charAt(0) || "W";
  return <motion.article className="portfolio-card" layout={!reducedMotion} initial={reducedMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? undefined : { opacity: 0, y: 8 }} transition={{ duration: reducedMotion ? 0.2 : 0.4, ease: [0.16, 1, 0.3, 1] }}>
    <Link className="portfolio-card-link" href={`/work/${project.slug}`} aria-label={`View ${project.title}, ${category?.title ?? project.category} project`}>
      <div className="portfolio-cover">
        {project.hasCoverImage ? <Image className="portfolio-cover-image" src={project.coverImage} alt={project.coverAlt} fill sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw" /> : <div className="portfolio-cover-placeholder" aria-hidden="true"><span className="portfolio-cover-initial">{initial}</span><span className="portfolio-placeholder-label">Project image pending</span></div>}
      </div>
      <div className="portfolio-card-meta"><div><h2>{project.title}</h2><p>{category?.title ?? project.category}</p></div><span aria-hidden="true">↗</span></div>
    </Link>
  </motion.article>;
}
