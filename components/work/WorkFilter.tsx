"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { services } from "@/content/services";
import type { WorkCategory, WorkProject } from "@/content/work-model";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { WorkCard } from "@/components/work/WorkCard";

type Filter = "all" | WorkCategory;

export function WorkFilter({ projects }: { projects: WorkProject[] }) {
  const [active, setActive] = useState<Filter>("all");
  const { reducedMotion } = useMotionPreferences();
  const filtered = useMemo(() => active === "all" ? projects : projects.filter((project) => project.category === active), [active, projects]);
  const filters: { label: string; value: Filter }[] = [{ label: "All", value: "all" }, ...services.map((service) => ({ label: service.title, value: service.slug as WorkCategory }))];

  return <div className="work-browser">
    <div className="work-filter-list" role="group" aria-label="Filter projects by service">{filters.map((filter) => <button key={filter.value} className={`work-filter-chip${active === filter.value ? " is-active" : ""}`} type="button" aria-pressed={active === filter.value} onClick={() => setActive(filter.value)}>{filter.label}</button>)}</div>
    {filtered.length ? <motion.div className="portfolio-grid" layout={!reducedMotion}><AnimatePresence mode="popLayout">{filtered.map((project) => <WorkCard key={project.slug} project={project} reducedMotion={reducedMotion} />)}</AnimatePresence></motion.div> : <div className="work-empty-state" role="status"><p className="eyebrow">Portfolio in progress</p><h2>No projects in this category yet.</h2><p>New work will appear here as it is ready to share.</p></div>}
  </div>;
}
