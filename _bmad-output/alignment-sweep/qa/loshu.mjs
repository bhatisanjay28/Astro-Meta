// Debug lo-shu mobile overlap: dt-trigger × btn
import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.addInitScript(() => { try { localStorage.setItem("vyotish.consent.v1", "acknowledged"); } catch {} });
await page.goto("http://127.0.0.1:4321/calculators/lo-shu/", { waitUntil: "networkidle" });
const d = await page.evaluate(() => {
  const form = document.querySelector("form[data-calc-endpoint]");
  const cs = getComputedStyle(form);
  const out = { gtc: cs.gridTemplateColumns, items: [] };
  for (const el of form.children) {
    const r = el.getBoundingClientRect();
    const c = getComputedStyle(el);
    out.items.push({
      tag: el.tagName, cls: (el.className || "").slice(0, 60),
      rect: `x=${Math.round(r.left)}..${Math.round(r.right)} y=${Math.round(r.top)}..${Math.round(r.bottom)} w=${Math.round(r.width)} h=${Math.round(r.height)}`,
      colStart: c.gridColumnStart, colEnd: c.gridColumnEnd, pos: c.position,
    });
  }
  const trig = document.querySelector("[data-dt-trigger]");
  const tr = trig.getBoundingClientRect();
  out.trigger = `x=${Math.round(tr.left)}..${Math.round(tr.right)} y=${Math.round(tr.top)}..${Math.round(tr.bottom)}`;
  const btn = form.querySelector("button.btn");
  const br = btn.getBoundingClientRect();
  out.btn = `x=${Math.round(br.left)}..${Math.round(br.right)} y=${Math.round(br.top)}..${Math.round(br.bottom)}`;
  return out;
});
console.log(JSON.stringify(d, null, 1));
await browser.close();
