import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));
const expected = { orange: "#F63B05", cloud: "#C8D1D9", blue: "#2B4F9C", sky: "#5085C5", black: "#070707" };

test("the canonical palette and published CSS use the five exact supplied colours", () => {
  const paletteFile = path.join(root, "content/palette.json");
  assert.ok(existsSync(paletteFile), "A canonical palette must be present");
  assert.deepEqual(JSON.parse(readFileSync(paletteFile, "utf8")), expected);
  const css = readFileSync(path.join(root, "styles/tokens.css"), "utf8");
  for (const [name, value] of Object.entries(expected)) {
    assert.match(css, new RegExp(`--brand-${name}:\\s*${value};`, "i"));
  }
});

test("generated CSS and standalone service artwork stay in sync with the palette", () => {
  const script = path.join(root, "scripts/sync-palette.mjs");
  assert.ok(existsSync(script), "The palette outputs must have a synchronisation check");
  execFileSync(process.execPath, [script, "--check"], { cwd: root, stdio: "pipe" });
});

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const name = path.join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(name) : /\.(css|tsx?|svg)$/.test(name) ? [name] : [];
  });
}

test("active UI code and service artwork contain no obsolete lime palette values", () => {
  const legacy = /#(?:82db1a|b1ed6a|3f730e|d1f2a9|d8f6b8)\b|\b130\s+219\s+26\b|\b(?:169\s+236\s+101|109\s+183\s+34|48\s+91\s+12|239\s+255\s+218)\b/i;
  const files = ["styles", "components", "app", "public/services/previews"].flatMap((name) => sourceFiles(path.join(root, name)));
  const stale = files.filter((file) => legacy.test(readFileSync(file, "utf8"))).map((file) => path.relative(root, file));
  assert.deepEqual(stale, []);
});

test("the intended foreground pairings meet normal-text contrast", () => {
  const luminance = (hex) => {
    const rgb = hex.slice(1).match(/../g).map((channel) => parseInt(channel, 16) / 255).map((value) => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
    return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
  };
  for (const [ink, background] of [["black", "orange"], ["cloud", "black"], ["cloud", "blue"], ["black", "sky"], ["black", "cloud"]]) {
    const values = [luminance(expected[ink]), luminance(expected[background])].sort((a, b) => b - a);
    assert.ok((values[0] + .05) / (values[1] + .05) >= 4.5, `${ink} on ${background} must be readable`);
  }
  const css = readFileSync(path.join(root, "styles/tokens.css"), "utf8");
  const channels = (hex) => hex.slice(1).match(/../g).map((value) => parseInt(value, 16));
  for (const name of ["surface", "surface-hover"]) {
    const match = css.match(new RegExp(`--${name}: color-mix\\(in srgb, var\\(--secondary\\) (\\d+)%, var\\(--bg\\)\\)`));
    assert.ok(match, `${name} must have an explicit blue/cloud mix`);
    const amount = Number(match[1]) / 100;
    const mixed = channels(expected.blue).map((value, index) => Math.round(value * amount + channels(expected.cloud)[index] * (1 - amount)));
    const background = `#${mixed.map((value) => value.toString(16).padStart(2, "0")).join("")}`;
    assert.ok((luminance(background) + .05) / (luminance(expected.blue) + .05) >= 4.5, `Blue text on ${name} must remain readable`);
  }
});
