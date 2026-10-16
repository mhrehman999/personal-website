"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SectionAction } from "@/components/ui/SectionAction";
import { ProjectMedia } from "@/components/work/ProjectMedia";
import type { WorkProject } from "@/content/work-model";
import { MaskedHeadline } from "@/components/motion/Reveal";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

const selectedWorkHeadingLines = ["Selected work."];

export function SelectedWork({ projects }: { projects: WorkProject[] }) {
  const section = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    let cancelled = false;
    let context: { revert: () => void } | undefined;
    if (reducedMotion) return;
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
      if (cancelled || !section.current || !rail.current) return;
      const { gsap } = gsapModule;
      const { ScrollTrigger } = triggerModule;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(min-width: 1024px) and (hover: hover) and (pointer: fine)", () => {
        const lowPower = window.navigator.hardwareConcurrency <= 4;
        const cards = gsap.utils.toArray<HTMLElement>(".project-card");
        const horizontalTween = gsap.to(rail.current, { x: () => Math.min(0, window.innerWidth - rail.current!.scrollWidth), ease: "none", scrollTrigger: { trigger: section.current, start: "top top", end: () => `+=${rail.current!.scrollWidth - window.innerWidth}`, pin: true, scrub: true, invalidateOnRefresh: true } });
        if (!lowPower) cards.forEach((card, index) => {
          const art = card.querySelector<HTMLElement>(".project-art-inner");
          if (art && !art.querySelector("video")) gsap.fromTo(art, { xPercent: index % 2 ? 8 : -8 }, { xPercent: index % 2 ? -8 : 8, ease: "none", scrollTrigger: { trigger: card, containerAnimation: horizontalTween, start: "left right", end: "right left", scrub: true } });
        });
      });
      context = { revert: () => media.revert() };
    });
    return () => { cancelled = true; context?.revert(); };
  }, [reducedMotion]);

  function updateProgress(event: React.UIEvent<HTMLDivElement>) {
    const element = event.currentTarget;
    const max = element.scrollWidth - element.clientWidth;
    setProgress(max > 0 ? element.scrollLeft / max : 0);
  }

  return <section ref={section} className={`selected-work section-wrap${reducedMotion ? " is-reduced-motion" : ""}`} id="selected-work" aria-labelledby="selected-work-heading">
    <div className="home-section-heading"><div><p className="eyebrow">A few things we&apos;ve made</p><MaskedHeadline className="home-section-title" id="selected-work-heading" lines={selectedWorkHeadingLines} /></div><SectionAction className="home-heading-link" href="/work">All work</SectionAction></div>
    <div className="work-rail-viewport" onScroll={updateProgress}><div className="work-rail" ref={rail}>
      {projects.slice(0, 6).map((project, index) => <Link className={`project-card project-card-${index + 1}`} href={`/work/${project.slug}`} key={project.slug} aria-label={`${project.title}, ${project.category} project`}>
        <div className="project-art">{project.hasCoverImage ? <div className="project-art-inner"><ProjectMedia image={project.coverImage} video={project.coverVideo} alt={project.coverAlt} sizes="(max-width: 767px) 82vw, 54vw" /></div> : <div className="project-art-inner" aria-hidden="true"><span className="project-art-symbol">{project.title.replace(/^TODO: /, "").charAt(0) || "W"}</span><span className="project-placeholder-label">Project image pending</span></div>}</div>
        <div className="project-card-meta"><div><h3>{project.title}</h3><p>{project.category.replaceAll("-", " ")}</p></div><span aria-hidden="true">↗</span></div>
      </Link>)}
    </div></div>
    <div className="work-progress" role="progressbar" aria-label="Work carousel progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}><span style={{ transform: `scaleX(${Math.max(0.12, progress)})` }} /></div>
  </section>;
}
