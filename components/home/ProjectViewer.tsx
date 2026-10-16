"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ProjectMedia } from "@/components/work/ProjectMedia";
import { AnimatePresence, motion } from "motion/react";
import { folderProjects, type FolderProject } from "@/content/folder-projects";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

type ViewerProps = { selected: FolderProject | null; indexOpen: boolean; onSelect: (project: FolderProject) => void; onBack: () => void; onFolder: () => void; onIndex: () => void };

export function ProjectViewer({ selected, indexOpen, onSelect, onBack, onFolder, onIndex }: ViewerProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);
  const closing = useRef(false);
  const backdropPress = useRef(false);
  const [dismissal, setDismissal] = useState<"back" | "folder" | null>(null);
  const { reducedMotion } = useMotionPreferences();
  const open = Boolean(selected || indexOpen);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const element = dialog.current;
    if (!mounted || !element || !open) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    element.showModal();
    return () => { element.close(); document.documentElement.style.overflow = previousOverflow; if (trigger?.isConnected) trigger.focus({ preventScroll: true }); };
  }, [mounted, open]);

  function dismiss(destination: "back" | "folder" = "back") {
    if (closing.current) return;
    closing.current = true;
    setDismissal(destination);
  }

  function finishDismissal() {
    if (!dismissal) return;
    if (dismissal === "folder") onFolder();
    else onBack();
    setDismissal(null);
    closing.current = false;
  }

  function isBackdrop(target: EventTarget | null) {
    return target === dialog.current || target instanceof Element && target.classList.contains("folder-project-view");
  }

  if (!mounted) return null;
  return createPortal(<dialog ref={dialog} className={`folder-dialog${reducedMotion ? " is-reduced-motion" : ""}`} aria-modal="true" aria-labelledby={selected ? "folder-project-title" : "folder-index-title"} data-lenis-prevent
    data-transitioning={Boolean(dismissal)} data-closing={Boolean(dismissal && (dismissal === "folder" || !selected || !indexOpen))}
    onCancel={(event) => { event.preventDefault(); dismiss(); }}
    onPointerDownCapture={(event) => { backdropPress.current = event.button === 0 && isBackdrop(event.target); }}
    onPointerCancel={() => { backdropPress.current = false; }}
    onClick={(event) => { if (backdropPress.current && isBackdrop(event.target)) dismiss(); backdropPress.current = false; }}>
    <AnimatePresence mode="wait" initial={false} onExitComplete={finishDismissal}>
      {open && !dismissal && (selected ? <motion.section className="folder-dialog-view folder-project-view" key={selected.id} initial={reducedMotion ? false : { opacity: 0, y: 20, scale: .94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reducedMotion ? 0 : 8, scale: reducedMotion ? 1 : .98, transition: { duration: reducedMotion ? 0 : .18 } }} transition={{ duration: reducedMotion ? 0 : .3, ease: [.16, 1, .3, 1] }}>
        <div className="folder-viewer-window">
          <div className="folder-viewer-topbar">
            <div className="folder-window-controls"><button type="button" className="folder-window-close" aria-label="Close project" onClick={() => dismiss()} autoFocus><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m5 5 6 6m0-6-6 6" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg></button><span /><span /></div>
            <h2 id="folder-project-title">{selected.title}</h2>
            <button type="button" className="folder-viewer-index" onClick={() => { if (!closing.current) onIndex(); }}>Index <span aria-hidden="true">↗</span></button>
          </div>
          <div className="folder-viewer-media" style={{ aspectRatio: selected.video ? "16 / 9" : `${selected.width} / ${selected.height}` }}><ProjectMedia key={selected.id} image={selected.image} video={selected.video} alt={`${selected.title} project cover`} sizes="(max-width: 767px) 90vw, 650px" controls /></div>
        </div>
        {selected.description.length > 0 && <div className="folder-viewer-caption" data-reduced-motion={reducedMotion}>
          {selected.description.map((line, index) => <motion.span key={line} initial={reducedMotion ? false : { opacity: 0, y: 8, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: reducedMotion ? 0 : .6, delay: reducedMotion ? 0 : .1 + index * .07, ease: [.16, 1, .3, 1] }}>{line}</motion.span>)}
        </div>}
        <div className="folder-viewer-meta"><span>{selected.category}</span></div>
      </motion.section> : <motion.section className="folder-dialog-view folder-index-view" key="project-index" initial={reducedMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, transition: { duration: reducedMotion ? 0 : .18 } }} transition={{ duration: reducedMotion ? 0 : .22 }}>
        <header className="folder-index-header"><div><h2 id="folder-index-title">Project index</h2><p>Selected projects <span>/ {String(folderProjects.length).padStart(2, "0")}</span></p></div><button className="folder-index-toggle" type="button" onClick={() => dismiss("folder")} autoFocus aria-label="Back to folder"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M2 5h6l2 2h8v10H2V5Z" stroke="currentColor" strokeWidth="1.2" /></svg>Folder</button></header>
        <div className="folder-index-grid">{folderProjects.map((project, index) => <motion.button key={project.id} type="button" className="folder-index-project" data-index-project aria-label={`Open ${project.title}`} onClick={() => { if (!closing.current) onSelect(project); }}
          initial={reducedMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : .4, delay: reducedMotion ? 0 : Math.min(index, 4) * .045 }}>
          <div className="folder-index-image"><ProjectMedia image={project.image} video={project.video} alt={`${project.title} project cover`} sizes="(max-width: 599px) 90vw, (max-width: 1023px) 45vw, 31vw" /></div>
          <span className="folder-index-project-meta"><span>{project.title}<small>{project.category}</small></span><span aria-hidden="true">↗</span></span>
        </motion.button>)}</div>
        <footer className="folder-index-footer"><p>Pick a project.<br />Take a closer look.</p></footer>
      </motion.section>)}
    </AnimatePresence>
  </dialog>, document.body);
}
