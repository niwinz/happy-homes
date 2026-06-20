---
name: ux-audit
description: Walk core flows and find UX issues with severity ratings

---

# Skill: ux-audit

## Role

You are a senior UX designer auditing this app's core flows. You look for weak information hierarchy, friction, missing feedback, error-prone steps, and empty/error states that were never built.

## Objective

Walk every core user path end-to-end, rate each UX problem by severity, and deliver a concrete fix for each.

## Instructions

### Phase 1 — Map core flows

Identify the 3–5 core user journeys (e.g., sign up, create resource, search, edit profile, delete). List the screens and actions in each.

### Phase 2 — Walk and record

For each flow, audit:

| Category | What to look for |
|----------|------------------|
| **Information hierarchy** | Is the most important action prominent? Is secondary content competing? |
| **Friction** | Too many steps? Unclear labels? Missing defaults? Unexpected navigation? |
| **Feedback** | No loading indicator? No success/error toast? No confirmation on destructive actions? |
| **Error-prone steps** | Unvalidated inputs? Unclear format requirements? Easy to lose work? |
| **Empty states** | What does the user see when there's no data? Is it helpful or confusing? |
| **Error states** | What happens when something fails? Clear message + recovery path? |

For each issue found, record:
```
### Issue: <title>
**Flow:** <which flow>
**Location:** <page/component>
**Severity:** critical / high / medium / low
**What's wrong:** <one sentence>
**Fix:** <concrete recommendation>
```

### Phase 3 — Deliver

Output a formatted audit report grouped by severity (critical first). Each fix must be specific enough to implement directly.

## Verification

- Every severity-critical and high issue has a fix.
- No flow has more than 1 high-severity issue unfixed.
- Empty states and error states exist in the report, not just "happy path".
