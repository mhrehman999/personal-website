"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/** A desktop popover and a top-layer sheet on phones, outside section clipping. */
export function SubservicePanel({ label, onClose, children }: { label: string; onClose: () => void; children: ReactNode }) {
  const [mobile, setMobile] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches);
  const dialog = useRef<HTMLDialogElement>(null);
  const backdropPress = useRef(false);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useLayoutEffect(() => {
    if (!mobile || !dialog.current) return;
    const element = dialog.current;
    const trigger = document.activeElement as HTMLElement | null;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    element.showModal();
    // Focus the close control, avoiding an unsolicited mobile keyboard.
    element.querySelector<HTMLButtonElement>(".package-sub-header button")?.focus({ preventScroll: true });
    return () => {
      element.close();
      document.documentElement.style.overflow = previousOverflow;
      trigger?.focus({ preventScroll: true });
    };
  }, [mobile]);

  useEffect(() => {
    if (mobile) return;
    const outside = (event: PointerEvent) => {
      if (!(event.target as Element).closest(".package-sub-dropdown")) closeRef.current();
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [mobile]);

  const content = <div className="package-sub-panel" id="package-sub-panel" role={mobile ? undefined : "dialog"} aria-label={mobile ? undefined : label} onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); onClose(); } }} data-lenis-prevent>{children}</div>;
  if (!mobile) return content;
  return createPortal(<dialog ref={dialog} className="package-mobile-dialog" aria-label={label} onCancel={(event) => { event.preventDefault(); onClose(); }}
    onPointerDown={(event) => { backdropPress.current = event.target === event.currentTarget; }}
    onPointerUp={(event) => { if (backdropPress.current && event.target === event.currentTarget) onClose(); backdropPress.current = false; }}>
    {content}
  </dialog>, document.body);
}
