import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const output = path.resolve("public/work/perspective");
await mkdir(output, { recursive: true });
const assets = [
  ["Perspective Branding-01.png", "cover.webp"],
  ["Tablet on orange chair.png", "tablet.webp"],
  ["INDOOR VERTICAL BILLBOARD MOCKUP.png", "billboard.webp"],
  ["Untitled-1.png", "concept.webp"],
  ["Firefly make the background a strong but abstract concept 18226.jpg", "atmosphere.webp"],
];
for (const [file, name] of assets) {
  const result = await sharp(path.join("C:/Users/Super/Downloads", file)).rotate().resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 88, effort: 5 }).toFile(path.join(output, name));
  console.log(`${name}: ${result.width}×${result.height}, ${Math.round(result.size / 1024)}KB`);
}
