"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import Image from "next/image";
import { ProjectMedia } from "@/components/work/ProjectMedia";
import { animate, motion, useMotionValue, useSpring, useTransform, useVelocity, type MotionValue } from "motion/react";
import { folderProjects, type FolderProject } from "@/content/folder-projects";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";
import { ProjectViewer } from "@/components/home/ProjectViewer";

const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));

function FolderCard({ project, index, x, velocity, reducedMotion, onOpen }: { project: FolderProject; index: number; x: MotionValue<number>; velocity: MotionValue<number>; reducedMotion: boolean; onOpen: (event: React.MouseEvent, project: FolderProject) => void }) {
  const lag = useTransform([x, velocity], ([position, speed]) => reducedMotion ? 0 : clamp(-Number(position) * (.06 + index * .012) - Number(speed) * (.006 + index * .002), 24));
  const tilt = useTransform([x, velocity], ([position, speed]) => reducedMotion ? 0 : clamp(-Number(position) * (.025 + index * .006) - Number(speed) * (.003 + index * .001), 13));
  const cardX = useSpring(lag, { stiffness: 170 + index * 25, damping: 15 + index * 2, mass: .7 + index * .12 });
  const cardRotate = useSpring(tilt, { stiffness: 150 + index * 35, damping: 12 + index * 2, mass: .8 });

  return <motion.div className={`folder-card-wobble folder-card-layer-${index}`} style={{ x: cardX, rotate: cardRotate }}>
    <div className={`folder-card-position folder-card-position-${index}`}>
      <div className="folder-file-entrance" style={{ "--file-index": index } as CSSProperties}>
      <motion.button className="folder-project-button" type="button" aria-label={`Open ${project.title}`} onClick={(event) => onOpen(event, project)}
        whileHover={reducedMotion ? undefined : { y: -18, scale: 1.025 }} whileFocus={reducedMotion ? undefined : { y: -18 }}
        transition={{ type: "spring", stiffness: 320, damping: 23 }}>
        <ProjectMedia image={project.image} video={project.video} alt={`${project.title} project cover`} sizes="(max-width: 767px) 190px, 260px" />
        {project.id === "velova" && <span className="folder-file-insert" aria-hidden="true"><Image src="/work/charles-cross/cover.webp" alt="" fill sizes="(max-width: 767px) 190px, 260px" draggable={false} /></span>}
      </motion.button>
      </div>
    </div>
  </motion.div>;
}

export function ProjectFolder() {
  const stage = useRef<HTMLDivElement>(null);
  const assembly = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);
  const pointer = useRef<{ id: number; startX: number; startY: number; origin: number; active: boolean } | null>(null);
  const returnAnimation = useRef<{ stop: () => void } | null>(null);
  const [limit, setLimit] = useState(32);
  const [dragging, setDragging] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);
  const [selected, setSelected] = useState<FolderProject | null>(null);
  const { reducedMotion } = useMotionPreferences();
  const inputX = useMotionValue(0);
  // A short follow spring removes event-to-event steps without feeling detached.
  const followX = useSpring(inputX, { stiffness: 560, damping: 38, mass: .65 });
  const x = reducedMotion ? inputX : followX;
  const rawVelocity = useVelocity(x);
  const velocity = useSpring(rawVelocity, { stiffness: 230, damping: 27, mass: .7 });
  const tilt = useTransform([x, velocity], ([position, speed]) => reducedMotion ? 0 : clamp(Number(position) * .026 + Number(speed) * .002, 7));
  const rotate = useSpring(tilt, { stiffness: 260, damping: 23, mass: .75 });
  const gradient = `folder-back-${useId().replaceAll(":", "")}`;

  useLayoutEffect(() => {
    if (!stage.current || !assembly.current) return;
    const update = () => {
      if (!stage.current || !assembly.current) return;
      const stageWidth = stage.current.clientWidth;
      const fanAllowance = window.matchMedia("(max-width: 767px)").matches ? 1.08 : .84;
      setLimit(Math.max(12, Math.min(stageWidth * .23, (stageWidth - assembly.current.clientWidth * fanAllowance) / 2 - 6)));
      if (!pointer.current) { returnAnimation.current?.stop(); inputX.set(0); followX.jump(0); }
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, [inputX, followX]);

  useEffect(() => () => returnAnimation.current?.stop(), []);

  function settle() {
    setDragging(false);
    returnAnimation.current?.stop();
    returnAnimation.current = animate(inputX, 0, reducedMotion
      ? { duration: .15, ease: "easeOut" }
      : { type: "spring", stiffness: 145, damping: 15, mass: .9, restDelta: .1, restSpeed: 1 });
  }

  function startPointer(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || pointer.current) return;
    dragged.current = false;
    returnAnimation.current?.stop();
    inputX.set(x.get());
    pointer.current = { id: event.pointerId, startX: event.clientX, startY: event.clientY, origin: x.get(), active: false };
  }

  function movePointer(event: PointerEvent<HTMLDivElement>) {
    const current = pointer.current;
    if (!current || current.id !== event.pointerId) return;
    const dx = event.clientX - current.startX;
    const dy = event.clientY - current.startY;
    if (!current.active) {
      // Leave vertical swipes to the page; capture only a deliberate sideways drag.
      if (event.pointerType === "touch" && Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) { pointer.current = null; settle(); return; }
      if (Math.abs(dx) < 5) return;
      current.active = true;
      dragged.current = true;
      setDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    const proposed = current.origin + dx;
    const overflow = Math.max(0, Math.abs(proposed) - limit);
    inputX.set(clamp(proposed, limit) + Math.sign(proposed) * Math.min(18, overflow * .25));
  }

  function endPointer(event: PointerEvent<HTMLDivElement>) {
    if (pointer.current?.id !== event.pointerId) return;
    pointer.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    settle();
  }

  function openProject(event: React.MouseEvent, project: FolderProject) {
    if (event.detail > 0 && dragged.current) return;
    setSelected(project);
  }

  return <div className={`project-folder${reducedMotion ? " is-reduced-motion" : ""}`}>
    <div className="project-folder-toolbar">
      <button className="folder-index-toggle" type="button" aria-label="Open project index" aria-haspopup="dialog" onClick={() => setIndexOpen(true)}>
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 2h4v4H2zm8 0h4v4h-4zM2 10h4v4H2zm8 0h4v4h-4z" stroke="currentColor" /></svg>Index
      </button>
    </div>
    <div className="project-folder-stage" ref={stage}>
      <div className="folder-ground-shadow" aria-hidden="true" />
      <div className="folder-entrance">
      <motion.div className={`project-folder-assembly${dragging ? " is-dragging" : ""}`} ref={assembly}
        style={{ x, rotate }} onPointerDown={startPointer} onPointerMove={movePointer} onPointerUp={endPointer} onPointerCancel={endPointer}
        onLostPointerCapture={(event) => { if (event.target === event.currentTarget) endPointer(event); }}
        onPointerLeave={() => { if (pointer.current && !pointer.current.active) { pointer.current = null; settle(); } }}
        onClickCapture={(event) => { if (event.detail > 0 && dragged.current) { event.preventDefault(); event.stopPropagation(); } }} onDragStart={(event) => event.preventDefault()}>
        <svg className="folder-back" viewBox="0 0 500 340" preserveAspectRatio="none" fill="none" aria-hidden="true"><defs><linearGradient id={gradient} x1="20" y1="0" x2="470" y2="340" gradientUnits="userSpaceOnUse"><stop stopColor="var(--support)" /><stop offset=".45" stopColor="var(--secondary)" /><stop offset="1" stopColor="var(--bg)" /></linearGradient></defs><path d="M0 36Q0 12 24 12H145Q158 12 170 26L196 50H466Q500 50 500 84V308Q500 340 468 340H32Q0 340 0 308Z" fill={`url(#${gradient})`} stroke="var(--fg)" strokeOpacity=".35" /></svg>
        <div className="folder-card-pocket">
          {folderProjects.map((project, index) => <FolderCard key={project.id} project={project} index={index} x={x} velocity={velocity} reducedMotion={reducedMotion} onOpen={openProject} />)}
        </div>
        <div className="folder-front">
          <span className="folder-hover-wash" aria-hidden="true" />
          <button type="button" className="project-folder-handle" aria-label="Drag project folder" aria-describedby="folder-instructions"
            onKeyDown={(event) => { if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return; event.preventDefault(); returnAnimation.current?.stop(); inputX.set(event.key === "ArrowLeft" ? -limit * .75 : limit * .75); settle(); }}>
            <span className="folder-front-label"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 5h5l2 2h7v9H3V5Z" stroke="currentColor" strokeWidth="1.2" /></svg>Projects Folder</span>
          </button>
        </div>
      </motion.div>
      </div>
    </div>
    <p className="visually-hidden" id="folder-instructions">Drag left or right, or use the arrow keys. Select a project to view it.</p>
    <ProjectViewer selected={selected} indexOpen={indexOpen} onSelect={setSelected} onBack={() => selected ? setSelected(null) : setIndexOpen(false)} onFolder={() => { setSelected(null); setIndexOpen(false); }} onIndex={() => { setSelected(null); setIndexOpen(true); }} />
  </div>;
}
