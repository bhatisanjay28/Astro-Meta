/**
 * secret-scan.ts — best-effort pre-commit secret scan (Epic 0.5b).
 *
 * gitleaks is not installed on this workstation, so this portable Bun script
 * covers the staged-diff scan instead. It reads `git diff --cached -U0` from
 * the CURRENT directory's repo and inspects ADDED lines only, against a
 * short list of high-confidence patterns (tuned for low noise):
 *
 *   PEM private keys, AWS AKIA, Google AIza, GitHub tokens, Slack tokens,
 *   Stripe live keys, Supabase sb_secret_, and generic credential
 *   assignments (key/secret/password/token = "…20+ chars…").
 *
 * A line containing `secret-scan:allow` is skipped (documented exceptions).
 * Upgrading to gitleaks later should replace, not extend, this script —
 * swap the hook bodies, keep the exit contract (0 clean / 1 leak found).
 *
 * Usage: bun scripts/secret-scan.ts [--all]
 *   --all  scan the entire tracked tree instead of the staged diff
 *          (used for one-off repo sweeps)
 */

const PATTERNS: Array<{ name: string; re: RegExp }> = [
  { name: "private-key-block", re: /-----BEGIN (RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY/ },
  { name: "aws-access-key", re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: "google-api-key", re: /\bAIza[0-9A-Za-z_-]{35}\b/ },
  { name: "github-token", re: /\bgh[pousr]_[A-Za-z0-9]{30,}\b/ },
  { name: "github-fine-grained", re: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/ },
  { name: "slack-token", re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/ },
  { name: "stripe-live-key", re: /\b[sr]k_live_[A-Za-z0-9]{20,}\b/ },
  { name: "supabase-secret-key", re: /\bsb_secret_[A-Za-z0-9_]{20,}\b/ },
  {
    name: "credential-assignment",
    re: /\b(api[_-]?key|secret|password|passwd|token|credential)[_a-z0-9]*\s*[:=]\s*["'][^"']{20,}["']/i,
  },
];

const ALLOW_MARKER = "secret-scan:allow";

function scanLines(lines: string[], source: string): number {
  let hits = 0;
  for (const line of lines) {
    if (line.includes(ALLOW_MARKER)) continue;
    for (const { name, re } of PATTERNS) {
      if (re.test(line)) {
        console.error(`SECRET-SCAN ${name} in ${source}:`);
        console.error(`  ${line.trim().slice(0, 160)}`);
        hits += 1;
        break; // one verdict per line is enough
      }
    }
  }
  return hits;
}

async function main() {
  const all = process.argv.includes("--all");
  let content: string;
  if (all) {
    const proc = Bun.spawnSync(["git", "ls-files", "-z"], { stdout: "pipe" });
    const files = proc.stdout
      .toString()
      .split("\0")
      .filter((f) => f.length > 0);
    const chunks: string[] = [];
    for (const f of files) {
      try {
        chunks.push(await Bun.file(f).text());
      } catch {
        // binary or unreadable — skip
      }
    }
    content = chunks.join("\n");
    const hits = scanLines(content.split("\n"), "tracked tree");
    finish(hits);
    return;
  }

  const proc = Bun.spawnSync(["git", "diff", "--cached", "-U0"], { stdout: "pipe" });
  content = proc.stdout.toString();
  const added: string[] = [];
  for (const line of content.split("\n")) {
    if (line.startsWith("+") && !line.startsWith("+++")) added.push(line.slice(1));
  }
  finish(scanLines(added, "staged diff"));
}

function finish(hits: number): never {
  if (hits > 0) {
    console.error(`\nsecret-scan: ${hits} suspect line(s) — commit blocked.`);
    console.error(`If this is a deliberate non-secret, add 'secret-scan:allow' to the line.`);
    process.exit(1);
  }
  console.log("secret-scan: clean");
  process.exit(0);
}

await main();
