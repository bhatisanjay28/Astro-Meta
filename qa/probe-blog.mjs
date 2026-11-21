// Probe: reproduce the blog page=2 PostgREST call directly (reads backend/.env, prints only statuses)
import { readFileSync } from "node:fs";
const env = readFileSync(new URL("../backend/.env", import.meta.url), "utf8");
const get = (k) => (env.match(new RegExp(`^${k}=(.*)$`, "m")) || [])[1]?.trim();
const url = (get("SUPABASE_URL") || "").replace(/\/$/, "");
const key = get("SUPABASE_SERVICE_ROLE_KEY");
if (!url || !key) throw new Error("creds missing");

const LIST_COLUMNS =
  "id,slug,title,excerpt,featured_image_url,alt_text,publish_at,reading_minutes,category_id,created_at";
const mk = (offset, perPage) => {
  const params = new URLSearchParams({
    select: LIST_COLUMNS,
    status: "eq.published",
    deleted_at: "is.null",
    order: "publish_at.desc.nullslast,created_at.desc",
    limit: String(perPage),
    offset: String(offset),
  });
  return `${url}/rest/v1/blog_posts?${params.toString()}`;
};
for (const [label, offset] of [["page1", 0], ["page2", 10], ["page2@5", 5]]) {
  const res = await fetch(mk(offset, 10), {
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "count=exact" },
  });
  const body = await res.text();
  console.log(label, "status=", res.status, "range=", res.headers.get("content-range"), "body=", body.slice(0, 200));
}
// count of published posts
const c = await fetch(`${url}/rest/v1/blog_posts?status=eq.published&deleted_at=is.null&select=id`, {
  headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: "count=exact" },
});
console.log("count status=", c.status, "range=", c.headers.get("content-range"));
