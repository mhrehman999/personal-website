"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { services } from "@/content/services";
import type { WorkCategory, WorkProject } from "@/content/work-model";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { WorkCard } from "@/components/work/WorkCard";
import Link from "next/link";

type Filter = "all" | WorkCategory;

export function WorkFilter({ projects }: { projects: WorkProject[] }) {
  const [active, setActive] = useState<Filter>("all");
  const { reducedMotion } = useMotionPreferences();
  const filtered = useMemo(() => active === "all" ? projects : projects.filter((project) => project.category === active), [active, projects]);
  const filters: { label: string; value: Filter }[] = [{ label: "All", value: "all" }, ...services.map((service) => ({ label: service.title, value: service.slug as WorkCategory }))];

  return <div className="work-browser">
    <div className="work-browser-toolbar"><div className="work-filter-list" role="group" aria-label="Filter projects by service">{filters.map((filter) => <button key={filter.value} className={`work-filter-chip${active === filter.value ? " is-active" : ""}`} type="button" aria-pressed={active === filter.value} onClick={() => setActive(filter.value)}>{filter.label}</button>)}</div><p className="work-result-count" role="status" aria-live="polite">{filtered.length} {filtered.length === 1 ? "project" : "projects"}</p></div>
    {filtered.length ? <motion.div className="portfolio-grid" layout={!reducedMotion}><AnimatePresence mode="popLayout">{filtered.map((project) => <WorkCard key={project.slug} project={project} reducedMotion={reducedMotion} />)}</AnimatePresence></motion.div> : <div className="work-empty-state" role="status"><p className="eyebrow">Explore the possibilities</p><h2>Let&apos;s make your next project distinctive.</h2><p>There are no published projects in this category here yet. Explore the service to see how we can shape the work around your business.</p><Link className="text-link" href={`/services/${active}`}>Explore {services.find((service) => service.slug === active)?.title.toLowerCase()} <span aria-hidden="true">↗</span></Link></div>}
  </div>;
}
