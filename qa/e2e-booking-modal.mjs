// BUG-01 regression e2e — booking modal must actually POST to
// /api/v1/requests/consultation (Epic 5.2) and reflect real success/failure.
// API is mocked via route interception: no probe rows are created.
// Run: bun qa/e2e-booking-modal.mjs   (preview server on :4321 required)
import { chromium } from "playwright-core";

const BASE = "http://127.0.0.1:4321";
const API = "**/api/v1/requests/consultation";
let failures = 0;
const assert = (cond, label) => {
  if (cond) console.log("  ok:", label);
  else { failures++; console.log("  FAIL:", label); }
};

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();

// ---- Path 1: success (201) ----
{
  let posts = [];
  await page.route(API, async (route) => {
    posts.push(route.request().postDataJSON());
    await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ data: { id: "test-id", status: "received" } }) });
  });
  await page.goto(BASE + "/", { waitUntil: "load" });
  await page.click("[data-open-booking]");
  await page.fill("#bk-name", "QA Regression");
  await page.fill("#bk-phone", "+91 98000 00000");
  await page.fill("#bk-email", "qa-regression@example.com");
  await page.check("#consent-check");
  await page.selectOption("#bk-topic", { index: 1 });
  // S16 made #bk-date a hidden DateField input — drive the visible segments
  const dsegs = page.locator(".dt:has(#bk-date) [data-dt-seg]");
  await dsegs.nth(0).fill("05");
  await dsegs.nth(1).fill("12");
  await dsegs.nth(2).fill("2026");
  await dsegs.nth(0).blur();
  await page.waitForTimeout(200);
  await page.check("#consent-check");
  await page.click('[data-booking-form] [type="submit"]');
  await page.waitForTimeout(600);
  assert(posts.length === 1, "one POST made to consultation endpoint");
  const body = posts[0] ?? {};
  assert(body.name === "QA Regression" && body.phone === "+91 98000 00000", "payload carries name+phone");
  assert(body.topic && typeof body.preferred_date === "string", "payload carries topic+date");
  assert(!("birth_details" in body) && !("message" in body), "no birth details / message transmitted (Epic 6.4 boundary)");
  assert(await page.isVisible("[data-booking-ok]"), "success message shown");
  assert(await page.isHidden("[data-booking-fail]"), "failure message hidden");
}

// ---- Path 2: validation failure (400) — data must survive, error surfaced ----
{
  let posts = 0;
  await page.reload({ waitUntil: "load" });
  await page.route(API, async (route) => {
    posts++;
    await route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ error: { code: "validation_error", message: "Validation failed", details: ["phone must be a valid phone number"] } }) });
  });
  await page.click("[data-open-booking]");
  await page.fill("#bk-name", "QA Keep Me");
  await page.fill("#bk-phone", "+91 98000 00000");
  await page.fill("#bk-email", "qa-regression@example.com");
  await page.check("#consent-check");
  await page.click('[data-booking-form] [type="submit"]');
  await page.waitForTimeout(400);
  assert(posts === 1, "failure path posts once");
  assert(await page.isVisible("[data-booking-fail]"), "failure message shown");
  const failText = await page.textContent("[data-booking-fail]");
  assert(failText.includes("phone must be a valid phone number"), "backend validation details surfaced to user");
  assert((await page.inputValue("#bk-name")) === "QA Keep Me", "form NOT reset on failure — user data preserved");
  assert(await page.isHidden("[data-booking-ok]"), "no fake success on failure");
}

// ---- Path 3: double-click submits once ----
{
  let posts = 0;
  await page.reload({ waitUntil: "load" });
  await page.route(API, async (route) => {
    posts++;
    await new Promise((r) => setTimeout(r, 400));
    await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ data: { id: "test-id", status: "received" } }) });
  });
  await page.click("[data-open-booking]");
  await page.fill("#bk-name", "QA Double Click");
  await page.fill("#bk-phone", "+91 98000 00000");
  await page.fill("#bk-email", "qa-regression@example.com");
  await page.check("#consent-check");
  const btn = page.locator('[data-booking-form] [type="submit"]');
  await btn.click();
  await btn.click({ force: true }); // second click while in flight
  await page.waitForTimeout(900);
  assert(posts === 1, "double-click during in-flight submit yields ONE request");
  assert(await btn.isDisabled() === false, "submit button re-enabled after completion");
}

// ---- Path 4 (BUG-03): privacy link opens in a new tab, keeps form data ----
{
  const ctxPage = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await ctxPage.goto(BASE + "/", { waitUntil: "load" });
  await ctxPage.click("[data-open-booking]");
  await ctxPage.fill("#bk-name", "QA Tab Check");
  const privacy = ctxPage.locator('#consent-check ~ label a[href="/privacy"]');
  const target = await privacy.getAttribute("target");
  const rel = (await privacy.getAttribute("rel")) ?? "";
  assert(target === "_blank", "privacy link targets a new tab");
  assert(rel.includes("noopener"), "privacy link uses rel=noopener");
  // clicking a target=_blank link must not navigate the page
  await privacy.click();
  await ctxPage.waitForTimeout(400);
  assert(ctxPage.url() === BASE + "/", "main tab did not navigate away");
  assert((await ctxPage.inputValue("#bk-name")) === "QA Tab Check", "form data intact after link click");
  await ctxPage.close();
}

// ---- Path 5: email is OPTIONAL (privacy-policy parity) — submit without it ----
{
  let posts = [];
  await page.reload({ waitUntil: "load" });
  await page.route(API, async (route) => {
    posts.push(route.request().postDataJSON());
    await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ data: { id: "test-id", status: "received" } }) });
  });
  await page.click("[data-open-booking]");
  await page.fill("#bk-name", "QA No Email");
  await page.fill("#bk-phone", "+91 98000 00000");
  await page.check("#consent-check");
  await page.click('[data-booking-form] [type="submit"]');
  await page.waitForTimeout(600);
  assert(posts.length === 1, "no-email — request still posts");
  const body = posts[0] ?? {};
  assert(typeof body.email === "string" && body.email.trim() === "", "no-email — payload carries empty email (backend stores null)");
  assert(await page.isVisible("[data-booking-ok]"), "no-email — success message shown");
}

await browser.close();
console.log(failures ? `\n${failures} assertion(s) FAILED` : "\nALL PASS");
process.exit(failures ? 1 : 0);
