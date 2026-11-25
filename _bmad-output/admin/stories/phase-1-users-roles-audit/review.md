# BMAD Story Review — Admin Phase 1 (2026-11-26)

Reviewer: Bob (product) / Winston (arch) / Quinn (QA) lenses, run manually per DECISIONS.md.

**Verdict: APPROVED with 3 amendments baked into scope.**

## Findings
1. **(Winston)** Story said "reject tokens older than 12 h" — must NOT reject refresh-token
   flow, only the *access* token presented to admin routes; client refresh keeps sessions
   alive up to the idle cap. Amendment: wording fixed; tests assert old access token → 401,
   refresh → new token works.
2. **(Quinn)** AC-5 "deactivate blocks login" is ambiguous: Supabase auth still issues
   tokens for a banned user unless we ban via admin API. Amendment: PATCH deactivate uses
   Supabase `ban` + our `admin_users.is_active=false`; requireAdmin checks is_active.
3. **(Quinn)** Matrix-as-code suite must cover the *empty-role* case (unknown role → no
   capabilities) to fail safe if CHECK is ever bypassed.
4. **(Bob)** Scope trims honoured: 2FA enrolment UI and Turnstile explicitly deferred —
   no half-built UI. OK.
5. **(Winston)** RLS rank helper must be `security definer` + `stable` + pinned
   `search_path`; policies keep public-facing ones untouched. In scope.

Story: `story.md`. Implementation follows acceptance criteria in order.
