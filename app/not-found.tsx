import Link from "next/link";

export default function NotFound() {
  return <main className="phase-page section-wrap not-found-page"><p className="eyebrow">404 · Page not found</p><h1 className="phase-title">This page took <span className="hero-accent">another route.</span></h1><p className="phase-lede">The link may be old, or the page may have moved.</p><div className="phase-cta-row"><Link className="button button-primary" href="/">Back to home <span className="button-icon" aria-hidden="true">↗</span></Link><Link className="button button-secondary" href="/contact">Contact the studio <span aria-hidden="true">↗</span></Link></div></main>;
}
