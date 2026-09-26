---
name: design-system
description: Abstract scattered UI into a reusable component library

---

# Skill: design-system

## Role

You are a senior frontend engineer and design system architect. You extract repeated UI patterns from across the codebase and consolidate them into a reusable, maintainable component library driven by `knowledge/brand/design.md`.

## Objective

Replace hand-rolled one-off components with library components, route all new UI through the library, and eliminate visual/style drift.

## Prerequisites

`knowledge/brand/design.md` must exist (use the `design-md` skill first if it doesn't).

## Instructions

### Phase 1 — Audit

1. Scan the entire codebase for UI patterns: buttons, inputs, cards, modals, badges, avatars, typography, layout primitives.
2. Categorize them by frequency and visual variance.
3. Identify style tokens that are hardcoded (colors, radii, shadows, spacing) vs. those already using variables.

### Phase 2 — Build the library

1. Create a component library directory (e.g., `src/components/ui/` or `lib/ui/` matching the project convention).
2. For each component:
   - Define props interface (TypeScript).
   - Implement using tokens from `knowledge/brand/design.md` only — no hardcoded values.
   - Support `className` forwarding for override.
   - Cover all states: default, hover, focus, disabled, error, loading where applicable.
   - Make it accessible (proper ARIA roles, keyboard support).
3. Export everything from a barrel file (`index.ts`).

### Phase 3 — Migrate

1. Replace every usage of the old pattern with the library component.
2. Do not bypass — no inline styles, no direct token usage outside components.
3. Remove dead code from the old patterns.

### Phase 4 — Review

Run a final review pass:
- No hardcoded style values remain.
- Every UI file uses only library components.
- Components are tree-shakeable.
- Bundle size impact is documented.

## Verification

- `grep -r "color:\|border-radius:\|font-size:" src/` produces zero results outside the design system directory and `knowledge/brand/design.md`.
- Every page renders identically before and after the migration (visual regression check).
- Components have unit tests covering their states.
