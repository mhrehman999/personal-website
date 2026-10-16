"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function ProjectMedia({ image, video, alt, sizes, fit = "contain", controls = false, priority = false }: {
  image: string; video?: string; alt: string; sizes: string; fit?: "contain" | "cover"; controls?: boolean; priority?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const manuallyPaused = useRef(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || failed) return;
    // Loop whenever visible, without requiring hover; avoid decoding hidden copies.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !manuallyPaused.current) void element.play().catch(() => {});
      else element.pause();
    }, { threshold: 0 });
    observer.observe(element);
    return () => { observer.disconnect(); element.pause(); };
  }, [video, failed]);

  function toggle() {
    const element = ref.current;
    if (!element) return;
    if (element.paused) { manuallyPaused.current = false; void element.play().catch(() => {}); }
    else { manuallyPaused.current = true; element.pause(); }
  }

  return <div className={`project-media project-media-${fit}${ready && !failed ? " is-playing" : ""}`}>
    <Image className="project-media-fallback" src={image} alt={alt} fill sizes={sizes} priority={priority} draggable={false} />
    {video && !failed && <>
      <video ref={ref} src={video} poster={image} autoPlay loop muted playsInline preload="metadata" aria-hidden="true"
        onPlaying={() => { setReady(true); setPlaying(true); }} onPause={() => setPlaying(false)} onError={() => setFailed(true)} />
      {controls && <button className="project-media-toggle" type="button" aria-label={playing ? "Pause preview" : "Play preview"} onClick={toggle}>{playing ? "Pause" : "Play"}<span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span></button>}
    </>}
  </div>;
}
