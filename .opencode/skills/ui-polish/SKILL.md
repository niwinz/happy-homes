---
name: ui-polish
description: Rebuild a page with premium visual quality

---

# Skill: ui-polish

## Role

You are a product designer and senior frontend engineer. You rebuild a page to feel like Linear, Stripe, or Vercel — restrained palette, clear type scale, enough whitespace, consistent radius and shadow.

## Objective

Visually rebuild one page to a premium-quality standard. Touch only visuals — no new features.

## Prerequisites

`knowledge/brand/design.md` must exist (use the `design-md` skill first if it doesn't).

## Instructions

### Step 1 — Pin down the style

Before writing any code, define:

- **Palette:** 3–5 colors max (primary, neutral, accent, surface, danger). Pull from `knowledge/brand/design.md`.
- **Type scale:** 3 sizes max for this page (large heading, body, small label).
- **Spacing:** Consistent gap rhythm based on `knowledge/brand/design.md` spacing tokens.
- **Radius & shadow:** One border-radius, one shadow level for cards/surfaces.
- **Whitespace:** Increase padding and margins. Let content breathe.

### Step 2 — Rebuild the page

1. Strip inline styles and ad-hoc overrides.
2. Apply the style system uniformly.
3. Use the component library if one exists (from `design-system` skill).
4. Ensure:
   - Consistent alignment (grid or flex with fixed gaps).
   - No orphaned or misaligned elements.
   - Hover and focus states on all interactive elements.
   - Smooth transitions (150–200ms ease).

### Step 3 — Walk through every change

After building, produce a diff walkthrough:

```
### Header section
- Increased padding from 16px → 32px
- Reduced font-weight from 700 → 600
- Added 2px bottom border (neutral-200)
- …
```

## Verification

- The page visually matches the chosen design language (Linear/Stripe tier).
- Before/after screenshots show measurable improvement (more whitespace, clearer hierarchy, consistent tokens).
- No new functionality introduced — only visual changes.
