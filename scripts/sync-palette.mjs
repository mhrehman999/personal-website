import { readFile, writeFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const palette = JSON.parse(await readFile(path.join(root, "content/palette.json"), "utf8"));
const entries = Object.entries(palette);
if (entries.length !== 5 || entries.some(([name, value]) => !/^(orange|cloud|blue|sky|black)$/.test(name) || !/^#[\dA-F]{6}$/.test(value))) {
  throw new Error("The brand palette must contain the five named, six-digit hex colours.");
}

const check = process.argv.includes("--check");
const stale = [];
async function update(relativePath, transform) {
  const file = path.join(root, relativePath);
  const before = (await readFile(file, "utf8")).replace(/\r\n/g, "\n");
  const after = transform(before);
  if (before === after) return;
  if (check) stale.push(relativePath);
  else await writeFile(file, after);
}

const cssBlock = `/* brand-palette:start */\n${entries.map(([name, value]) => `  --brand-${name}: ${value};`).join("\n")}\n  /* brand-palette:end */`;
await update("styles/tokens.css", (source) => {
  if (!source.includes("/* brand-palette:start */")) throw new Error("Missing CSS palette marker");
  return source.replace(/\/\* brand-palette:start \*\/[\s\S]*?\/\* brand-palette:end \*\//, cssBlock);
});

const svgBlock = `<style data-brand-palette="true">:root{${entries.map(([name, value]) => `--brand-${name}:${value}`).join(";")}}</style>`;
for (const name of await readdir(path.join(root, "public/services/previews"))) {
  if (!name.endsWith(".svg")) continue;
  await update(`public/services/previews/${name}`, (source) => {
    if (source.includes("<style data-brand-palette")) return source.replace(/<style data-brand-palette(?:="true")?>[\s\S]*?<\/style>/, svgBlock);
    return source.replace(/(<svg\b[^>]*>)/, `$1\n  ${svgBlock}`);
  });
}

if (stale.length) {
  console.error(`Palette outputs are stale: ${stale.join(", ")}. Run npm run tokens:sync.`);
  process.exitCode = 1;
} else console.log(check ? "Palette outputs are in sync." : "Brand palette synchronised.");
