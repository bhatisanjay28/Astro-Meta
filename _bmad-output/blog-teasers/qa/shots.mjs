// S-TB QA — text assertions + screenshots of the three affected surfaces.
// Run: bun shots.mjs  (preview server must be up on 127.0.0.1:4321)
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

mkdirSync(fileURLToPath(new URL("shots/", import.meta.url)), { recursive: true });
const base = "http://127.0.0.1:4321";
const out = (p) => fileURLToPath(new URL(`shots/${p}`, import.meta.url));

let fails = 0;
async function expect(page, url, checks) {
  await page.goto(base + url, { waitUntil: "networkidle" });
  for (const [label, fn] of checks) {
    const ok = await fn();
    if (!ok) { fails++; console.log(`FAIL ${url} — ${label}`); }
    else console.log(`pass ${url} — ${label}`);
  }
}

const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

// 1. /blog — 5 cards, 4 category chips, no sample names
await expect(page, "/blog", [
  ["5 post cards link out", async () =>
    (await page.locator('a[href^="/blog/"]:not([href="/blog"]):not([href^="/blog/category"]):not([href^="/blog/tag"]):not([href^="/blog/page"]):not([href^="/blog/rss"])').count()) >= 5],
  ["category chips: Kundli Science + Muhurat Shastra present", async () =>
    (await page.locator('a[href="/blog/category/kundli-science"]').count()) === 1 &&
    (await page.locator('a[href="/blog/category/muhurat-shastra"]').count()) === 1],
  ["no sample astrologer names", async () =>
    !(await page.content()).match(/Shastri|Ananya Dave|Rakesh Mishra/)],
]);

// 2. new article page — Team Vyotish byline, breadcrumb to new category
await expect(page, "/blog/why-the-vedic-day-begins-at-sunrise", [
  ["byline Team Vyotish", async () => (await page.locator(".byline", { hasText: "Team Vyotish" }).count()) === 1],
  ["breadcrumb Panchang Guides", async () =>
    (await page.locator('nav.crumbs a[href="/blog/category/panchang-guides"]').count()) === 1],
  ["TOC present (5 h2 sections)", async () => (await page.locator(".toc li").count()) >= 5],
  ["tags chips render", async () => (await page.locator(".tags .chip").count()) >= 3],
]);
await page.screenshot({ path: out("article-sunrise-light.png"), fullPage: false });

await expect(page, "/blog/demystifying-manglik-dosha", [
  ["byline Team Vyotish", async () => (await page.locator(".byline", { hasText: "Team Vyotish" }).count()) === 1],
  ["breadcrumb Kundli Science", async () =>
    (await page.locator('nav.crumbs a[href="/blog/category/kundli-science"]').count()) === 1],
  ["myths table renders", async () => (await page.locator(".prose table").count()) >= 1],
]);
await page.screenshot({ path: out("article-manglik-light.png") });

await expect(page, "/blog/choghadiya-abhijit-muhurat-everyday-decisions", [
  ["byline Team Vyotish", async () => (await page.locator(".byline", { hasText: "Team Vyotish" }).count()) === 1],
  ["breadcrumb Muhurat Shastra", async () =>
    (await page.locator('nav.crumbs a[href="/blog/category/muhurat-shastra"]').count()) === 1],
  ["choghadiya table renders", async () => (await page.locator(".prose table").count()) >= 1],
]);
await page.screenshot({ path: out("article-choghadiya-light.png") });

// 3. category pages — new categories render with their post
await expect(page, "/blog/category/kundli-science", [
  ["heading", async () => (await page.locator("h1", { hasText: "Kundli Science" }).count()) === 1],
  ["1 post card", async () => (await page.locator(".grid .card").count()) === 1],
]);
await expect(page, "/blog/category/muhurat-shastra", [
  ["heading", async () => (await page.locator("h1", { hasText: "Muhurat Shastra" }).count()) === 1],
  ["1 post card", async () => (await page.locator(".grid .card").count()) === 1],
]);

// 4. homepage teasers — byline + stretched link navigates
await page.goto(base + "/", { waitUntil: "networkidle" });
const teaserAuthors = await page.locator("#blog article >> nth=0 >> xpath=ancestor::section").locator("article").allTextContents();
const joined = teaserAuthors.join(" ");
console.log(joined.match(/By Team Vyotish/g)?.length === 3 ? "pass / — 3× By Team Vyotish" : (fails++, "FAIL / — bylines"));
// sample names may exist only in the consultations astrologer cards (D11), never in #blog
const articlesSec = await page.locator("#blog").textContent();
console.log(!articlesSec.match(/Shastri|Ananya Dave|Rakesh Mishra/) ? "pass / — Articles section: no sample names" : (fails++, "FAIL / — sample names in Articles section"));
// click-through: overlay anchor on the manglik card (local preview serves without slash)
await page.locator('a[aria-label^="Read the full article: Demystifying"]').click();
await page.waitForURL("**/blog/demystifying-manglik-dosha");
console.log("pass / — teaser card click-through → manglik article");
await page.goto(base + "/", { waitUntil: "networkidle" });
const blogSec = page.locator("#blog");
await blogSec.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await blogSec.screenshot({ path: out("home-teasers-light.png") });

// 5. dark mode spot-check of /blog + teaser section
await page.emulateMedia({ colorScheme: "dark" });
await page.goto(base + "/blog", { waitUntil: "networkidle" });
await page.screenshot({ path: out("blog-dark.png") });

await browser.close();
console.log(fails === 0 ? "\nALL PASS" : `\n${fails} FAILURES`);
process.exit(fails === 0 ? 0 : 1);
