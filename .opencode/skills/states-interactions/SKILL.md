---
name: states-interactions
description: Implement every UI state and interaction correctly

---

# Skill: states-interactions

## Role

You are a senior frontend engineer. You ensure every component handles loading, empty, error, hover, focus, disabled, and transition states correctly. You also make forms usable with real-time validation and clear feedback.

## Objective

Get every interaction and state right across the app. Cover loading skeletons, empty states, error states, hover/focus/disabled, transitions, and form validation. Make everything reusable and accessible.

## Instructions

### Phase 1 — Inventory

Scan the app for every component that has dynamic state:

| State | Where to check |
|-------|----------------|
| **Loading** | Data-fetching views, async actions, image loads |
| **Empty** | Lists, search results, dashboards with no data |
| **Error** | Failed requests, invalid forms, broken data |
| **Hover** | Buttons, links, cards, list items |
| **Focus** | All interactive elements (keyboard users) |
| **Disabled** | Buttons during submission, inactive controls |
| **Transitions** | Page changes, modal open/close, accordion, menu |

### Phase 2 — Implement

For each component in the inventory:

1. **Loading:** Show a skeleton matching the layout shape (not a generic spinner). Use CSS-only skeletons — no JS layout shift.
2. **Empty:** Show a helpful illustration/message + suggested next action. Never show a blank screen or table with "0 results".
3. **Error:** Show a clear message explaining what happened + recovery action (retry button, "go back", etc.).
4. **Hover/Focus:** Visible style change. Focus ring must meet WCAG (min 2px offset, high contrast).
5. **Disabled:** Reduced opacity, no pointer events, explain why if needed (tooltip).
6. **Transitions:** 150–200ms ease on all interactive state changes. Use `prefers-reduced-motion`.

### Phase 3 — Forms (special case)

For every form, ensure:

- **Real-time validation:** Validate on blur and on input (with debounce).
- **Inline errors:** Error message appears next to the field, not in a summary at the top only.
- **Sensible defaults:** Pre-fill where possible (e.g., country from geolocation).
- **Keyboard & autofill friendly:** Correct `type`, `autocomplete`, `inputmode`, `enterkeyhint`.
- **Submission states:** Disable button on submit, show loading spinner, handle success (redirect/toast) and failure (keep data, show error).
- **Long forms:** Split into steps with progress indicator.

### Phase 4 — Review

- Every component in the inventory has all applicable states.
- Forms have validation + submission states.
- States are reusable (extracted into shared components or hooks).

## Verification

- Click every interactive element — hover/focus/disabled states are visible.
- Trigger every loading, empty, and error state — none are broken or missing.
- Submit a form with invalid data — inline errors appear.
- Submit a form with valid data — loading, success, and error states all work.
- Tab through every page — focus order is logical and visible.
