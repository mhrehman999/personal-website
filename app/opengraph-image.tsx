import { ImageResponse } from "next/og";
import { brandName } from "@/content/site";
import palette from "@/content/palette.json";

export const alt = `${brandName} — Brand & Presentation Studio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: palette.blue, color: palette.cloud, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, color: palette.cloud, fontSize: 24, letterSpacing: 3, textTransform: "uppercase" }}>MH REHMAN <span style={{ color: palette.orange }}>•</span> STUDIO</div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 76, lineHeight: 1, letterSpacing: -4, fontWeight: 600 }}><span>Brand identity.</span><span>Pitch decks.</span><span>Presentations.</span></div>
      <div style={{ color: palette.cloud, fontSize: 25 }}>Clear thinking, expressed with intent.</div>
    </div>, size,
  );
}
