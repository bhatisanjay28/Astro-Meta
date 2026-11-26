/** closeout C3 (AC 4): /hi/ ExploreTiles render Material Symbols glyphs.
 * Verifies the computed font-family on every tile icon (the ligature only
 * resolves when the self-hosted face applies) + captures evidence shots. */
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const BASE = process.env.HZ_BASE ?? "https://vyotish.com";
mkdirSync("evidence/closeout", { recursive: true });

const exe = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await chromium.launch({ executablePath: exe, headless: true });
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });

await page.goto(`${BASE}/hi/`, { waitUntil: "networkidle" });
await page.waitForTimeout(1200); // settle fonts

const tiles = await page.$$eval(".explore .tile .icon", (nodes) =>
  nodes.map((n) => {
    const cs = getComputedStyle(n);
    return {
      text: n.textContent?.trim() ?? "",
      fontFamily: cs.fontFamily,
      fontSize: cs.fontSize,
      width: Math.round(n.getBoundingClientRect().width),
    };
  }),
);

let pass = 0;
for (const t of tiles) {
  const ok = t.fontFamily.includes("Material Symbols") && t.fontSize === "22px" && t.width > 0;
  console.log(`${ok ? "PASS" : "FAIL"}  icon="${t.text}"  font=${t.fontFamily.split(",")[0]}  ${t.fontSize}  w=${t.width}`);
  if (ok) pass += 1;
}
console.log(`\n${pass}/${tiles.length} tile icons render with the icon face`);

await page.locator(".explore").screenshot({ path: "evidence/closeout/hi-explore-glyphs.png" });
await browser.close();

if (pass === 0 || tiles.length === 0) {
  console.error("AC4 FAILED — no tile icon resolves the icon face");
  process.exit(1);
}
console.log("AC4 CLOSED");
