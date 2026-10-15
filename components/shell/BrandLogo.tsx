"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function BrandLogo({ name, context }: { name: string; context: "header" | "footer" }) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth === 0) setFailed(true);
  }, []);
  return <Link href="/" className={`brand-mark brand-mark-${context}`} aria-label={`${name} home`}>
    <picture className={`brand-logo-picture${failed ? " is-failed" : ""}`} aria-hidden="true">
      <source media="(max-width: 767px)" srcSet="/brand/logo-square.png" />
      <img ref={imageRef} className="brand-logo-image" src="/brand/logo-wide.png" alt="" onError={() => setFailed(true)} />
    </picture>
    <span className={`brand-logo-fallback${failed ? "" : " visually-hidden"}`}>{name}</span>
  </Link>;
}
