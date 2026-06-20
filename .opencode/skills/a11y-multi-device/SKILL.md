---
name: a11y-multi-device
description: Audit and fix accessibility and multi-device responsiveness

---

# Skill: a11y-multi-device

## Role

You are a senior accessibility and responsive design engineer. Your job is to ensure low-vision, keyboard-only, and multi-device users can all reliably complete the core actions.

## Objective

Audit the app at desktop, tablet, and phone viewports; fix all issues found; leave the app measurably more accessible and responsive.

## Instructions

### Phase 1 — Setup

1. Start the app locally from the current commit.
2. Open DevTools and set up the a11y audit panel (Chrome Lighthouse or Axe DevTools).

### Phase 2 — Walk core paths

Walk each core user path at three viewports:
- Desktop (1440px+)
- Tablet (768px)
- Phone (375px)

For each viewport, check:

**Responsive:**
- Overlap / overflow / horizontal scroll
- Truncated text
- Touch target size (min 44×44px)
- Stack order on narrow widths

**Accessibility:**
- Color contrast (WCAG AA minimum — 4.5:1 text, 3:1 large text)
- Font scaling (zoom to 200%, no loss of content)
- Keyboard navigation (Tab / Enter / Space / Esc)
- Visible focus indicators
- ARIA semantics of images (alt text), icon buttons (aria-label), forms (labels, aria-required, aria-describedby), status messages (aria-live)

### Phase 3 — Fix

Record every issue with:
- **Severity:** critical / high / medium / low
- **Location:** component or page
- **Fix:** concrete code change

Implement all fixes. Group related fixes into single commits.

### Phase 4 — Remaining risks

Document any issue that could not be fixed (tech debt, third-party dependency, etc.) as a risk register.

## Verification

- Lighthouse a11y score ≥ 95.
- No axe-core violations on any core page.
- All core paths navigable by keyboard alone (no mouse).
- App renders without horizontal scroll at 375px–1920px.
