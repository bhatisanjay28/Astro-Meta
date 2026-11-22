// Inspect the booking form grid geometry on /poojan/ @1366
import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" });
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
await page.goto("http://127.0.0.1:4321/poojan/", { waitUntil: "networkidle" });

const info = await page.evaluate(() => {
  const form = document.querySelector("form[data-booking-endpoint]");
  if (!form) return { error: "no form", forms: [...document.querySelectorAll("form")].map((f) => f.id || f.className) };
  const cs = getComputedStyle(form);
  const fr = form.getBoundingClientRect();
  const out = {
    form: {
      rect: { l: Math.round(fr.left), r: Math.round(fr.right), w: Math.round(fr.width) },
      display: cs.display,
      gtc: cs.gridTemplateColumns,
      gap: cs.gap,
      width: cs.width,
      boxSizing: cs.boxSizing,
      classes: form.className,
    },
    kids: [],
  };
  for (const el of [...form.children].slice(0, 8)) {
    const r = el.getBoundingClientRect();
    const c = getComputedStyle(el);
    out.kids.push({
      tag: el.tagName,
      cls: (el.className || "").slice(0, 40),
      rect: { l: Math.round(r.left), r: Math.round(r.right), w: Math.round(r.width) },
      minWidth: c.minWidth,
      width: c.width,
      margin: c.margin,
    });
  }
  // panel + its content box
  const panel = document.querySelector(".formpanel");
  const pc = getComputedStyle(panel);
  const pr = panel.getBoundingClientRect();
  out.panel = { rect: { l: Math.round(pr.left), r: Math.round(pr.right), w: Math.round(pr.width) }, pad: pc.padding, border: pc.borderRightWidth };
  return out;
});
console.log(JSON.stringify(info, null, 1));
await browser.close();
