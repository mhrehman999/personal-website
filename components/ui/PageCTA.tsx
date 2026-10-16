import Link from "next/link";

export function PageCTA({ title = "Let's make the next move clear.", description = "Tell me what you are working on. We can shape the right direction together.", href = "/contact", label = "Start a conversation" }: { title?: string; description?: string; href?: string; label?: string }) {
  return <section className="inner-cta"><div><h2>{title}</h2><p>{description}</p></div><Link className="button button-primary" href={href}><span>{label}</span><span className="button-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" /></svg></span></Link></section>;
}
