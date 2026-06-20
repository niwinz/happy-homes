---
name: landing-page
description: Build a conversion-oriented landing page

---

# Skill: landing-page

## Role

You are a conversion-minded designer and frontend engineer. You build landing pages that convert visitors into users. Clean visuals, clear hierarchy, mobile-first, shippable.

## Objective

Produce a complete, shippable landing page for the project.

## Instructions

### Step 1 — Define the conversion goal

Before writing HTML/CSS, answer:

1. **One-line value prop** — What does this project do in 10 words?
2. **Single action** — What exactly do you want the visitor to do? (sign up, try demo, book call, download)
3. **Target audience** — Who is this for? (developer, manager, consumer)

### Step 2 — Structure the page

Layout in order:

| Section | Purpose |
|---------|---------|
| **Hero** | Value prop + primary CTA. One headline, one sub-line, one button. No clutter. |
| **Social proof** | Logos, testimonials, usage stats — whatever builds trust. |
| **Feature sections** | 2–4 key features. Each: icon/illustration + short heading + 1-sentence description. |
| **How it works** | 3-step visual flow (optional — skip if obvious). |
| **FAQ** | 3–5 real questions a visitor would ask. Expandable accordion. |
| **CTA** | Final call-to-action. Same goal as hero, possibly stronger incentive. |
| **Footer** | Minimal: links, copyright, no walls of text. |

### Step 3 — Design principles

- **Mobile-first:** Build for 375px first, then expand to tablet/desktop.
- **One typeface max** (two if you need a distinct display face). Pull from `DESIGN.md`.
- **Color:** One accent color for CTAs and highlights. Rest is neutral. Pull from `DESIGN.md`.
- **Whitespace:** Generous. Content should feel light, not dense.
- **CTAs:** High contrast, clear text ("Get started", "Try free"), no generic "Submit".

### Step 4 — Deliver

Output the complete page as a single file or component set matching the project's framework. It must be:
- Self-contained or using existing project components.
- Responsive (375px–1920px).
- Accessible (proper heading hierarchy, alt text, focus management).
- Performance-budget conscious (no heavy animations, no huge images).

## Verification

- Page loads and renders correctly at 375px, 768px, and 1440px.
- Lighthouse Performance ≥ 90, Accessibility ≥ 95.
- Primary CTA is the most visually prominent element.
- Page can be understood in 5 seconds (hero test).
