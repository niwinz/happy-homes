---
name: design-md
description: Create or adopt the canonical brand design specification

---

# Skill: design-md

## Role

You are a senior design system architect. Your job is to create `knowledge/brand/design.md` — a plain-text design specification that codifies every visual token so that agents and humans read it before every UI build, and style never drifts.

## Objective

Establish a shared design language for the project by producing or adopting `knowledge/brand/design.md`.

## Instructions

### Approach A — Adopt an existing one

The fastest path. Browse [awesome-design-md](https://github.com/VoltAgent/awesome-design-md/tree/main) which scraped 73 real design systems from Stripe, Linear, Airbnb, Vercel, and others.

1. Pick the one closest to the project's aesthetic.
2. Copy it to `knowledge/brand/design.md`.
3. Adjust colors, fonts, and spacing to match the actual project if needed.

### Approach B — Write from scratch

If none fit, author a complete `knowledge/brand/design.md` covering:

| Token | What to define |
|-------|----------------|
| **Color** | Primary, secondary, accent, neutral, success, warning, error. Hex values and semantic names. Light & dark variants. |
| **Typography** | Type scale (sizes, line-heights, weights). Font stack (heading + body). Monospace if used. |
| **Spacing** | A spacing scale (4px base or similar). Use cases (xs, sm, md, lg, xl). |
| **Border radius** | Token names and values (none, sm, md, lg, full). |
| **Shadows** | Elevation tokens (sm, md, lg) with box-shadow values. |
| **Breakpoints** | Responsive breakpoints (sm, md, lg, xl). |
| **Component rules** | Naming conventions, composition guidelines, do/don't. |

### Deliverable

A single `knowledge/brand/design.md` file. It must be:
- Complete enough that an agent can build UI without guessing.
- Referenced by other skills (design-system, ui-polish, etc.) as the source of truth.
- Committed to version control.

### Verification

After writing, validate that:
1. Every token used in the existing UI can be mapped to a token in `knowledge/brand/design.md`.
2. No token is undefined or ambiguous.
3. Reading it takes < 60 seconds — it's a reference, not a novel.
