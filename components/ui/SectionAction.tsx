import Link from "next/link";
import type { ReactNode } from "react";

export function SectionAction({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return <Link className={`button button-primary button-small section-action ${className}`} href={href}><span>{children}</span><span className="button-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" /></svg></span></Link>;
}
