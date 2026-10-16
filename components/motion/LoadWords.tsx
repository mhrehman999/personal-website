import { Fragment, type CSSProperties } from "react";

export function LoadWords({ text, delay = 0, stagger = .055, highlight }: { text: string; delay?: number; stagger?: number; highlight?: string }) {
  return <>{text.split(" ").map((word, index, words) => <Fragment key={`${word}-${index}`}><span className={`load-word-mask${word === highlight ? " has-notice" : ""}`}><span className={`load-word${word === highlight ? " hero-notice" : ""}`} style={{ "--word-delay": `${delay + index * stagger}s` } as CSSProperties}>{word === highlight ? <><span className="hero-notice-ink">{word}</span><svg className="hero-notice-arc" viewBox="0 0 240 24" fill="none" aria-hidden="true"><path d="M4 17C60 2 166 1 235 12" pathLength="1" /></svg></> : word}</span></span>{index < words.length - 1 ? " " : ""}</Fragment>)}</>;
}
