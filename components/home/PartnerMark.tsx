import type { Partner } from "@/content/partners";

export function PartnerMark({ mark }: { mark: Partner["mark"] }) {
  return <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
    {mark === "ribbon" && <path d="M8 6h24v12H20L8 6Zm0 13h24v15L8 19Z" fill="currentColor" />}
    {mark === "orbit" && <><circle cx="20" cy="20" r="5" fill="currentColor" /><ellipse cx="20" cy="20" rx="17" ry="8" transform="rotate(-45 20 20)" stroke="currentColor" strokeWidth="1.7" /><ellipse cx="20" cy="20" rx="17" ry="8" transform="rotate(45 20 20)" stroke="currentColor" strokeWidth="1.7" /></>}
    {mark === "monogram" && <><path d="m7 15 13-8 13 8v14l-13 8-13-8V15Z" stroke="currentColor" strokeWidth="2" /><path d="m7 15 13 8 13-8M20 23v14M14 19v-7l12 7v14" stroke="currentColor" strokeWidth="2" /></>}
    {mark === "spark" && <><path d="M20 3v10m0 14v10M3 20h10m14 0h10M8 8l7 7m10 10 7 7M8 32l7-7m10-10 7-7" stroke="currentColor" strokeWidth="4" /><circle cx="20" cy="20" r="5" fill="currentColor" /></>}
  </svg>;
}
