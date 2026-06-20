# DESIGN.md — HappyHomes

> Source of truth for every UI build. Read before writing any component or page.
> Aesthetic: **Mediterráneo aspiracional / quiet luxury**. Calm, spacious, restrained.
> Stack: **Astro** (SSG, islands). Tokens below are framework-agnostic; expose them as CSS custom properties in `web/src/styles/tokens.css`.

---

## 0. North-star principles

1. **Calm over loud.** More whitespace than feels necessary. Few elements, more breath.
2. **60-30-10 color rule.** 60% Blanco/Crudo · 30% Azul Petróleo · 10% Terracota. Verde Olivo and Gris piedra only as punctuation.
3. **Evidence of care.** Hairline borders, soft shadows, no gradients, no glassmorphism, no neon.
4. **Accessibility is non-negotiable.** Respect the contrast caveats in §1. Never use Terracota or Gris piedra for body text on light.
5. **One serif, one sans.** Don't introduce a third typeface without updating this file.

---

## 1. Color

### Brand palette (raw)

| Token | Hex | Role |
|-------|-----|------|
| `--color-petrol` | `#1A3A4A` | Structure, primary text, primary buttons, dark sections |
| `--color-terracotta` | `#C76B4C` | Accents, icons, links, eyebrow text, focus ring |
| `--color-cream` | `#F2ECE4` | Section backgrounds, cards |
| `--color-white` | `#FAFAF8` | Page background, text on dark |
| `--color-olive` | `#6B8F71` | Success, nature details |
| `--color-stone` | `#8A8A8A` | Large text + borders ONLY (fails AA on light for body) |

### Semantic tokens — light theme (default)

Apply these in components; never raw brand hexes.

| Token | Value | Use |
|-------|-------|-----|
| `--bg-page` | `var(--color-white)` | Page background |
| `--bg-section` | `var(--color-cream)` | Alternating section bands |
| `--bg-card` | `var(--color-white)` | Cards on crudo sections |
| `--bg-dark` | `var(--color-petrol)` | Footer, dark hero band, CTA strip |
| `--text-primary` | `var(--color-petrol)` | Headings + body |
| `--text-muted` | `#4F5B62` | Secondary text (AA on light) |
| `--text-on-dark` | `var(--color-white)` | Text on petróleo |
| `--text-on-dark-muted` | `#C4D0D5` | Secondary text on petróleo |
| `--border-default` | `rgba(26,58,74,0.12)` | Hairline dividers, card edges |
| `--border-strong` | `rgba(26,58,74,0.24)` | Emphasised borders, inputs:focus-adjacent |
| `--accent` | `var(--color-terracotta)` | Links, eyebrow, icon strokes |
| `--accent-hover` | `#B25C40` | Hover/active on terracota elements |
| `--success` | `var(--color-olive)` | Positive states |
| `--warning` | `#C9A24A` | Caution (muted ochre, on-family) |
| `--error` | `#B14B3A` | Errors (deeper terracota-red, on-family) |

### Semantic tokens — dark section variant

Use when a section sits on `--bg-dark` (petróleo). Flip text + borders, keep terracota accent.

| Token | Value |
|-------|-------|
| `--bg-page` → `--bg-dark` | `var(--color-petrol)` |
| `--text-primary` → `--text-on-dark` | `var(--color-white)` |
| `--text-muted` → `--text-on-dark-muted` | `#C4D0D5` |
| `--border-default` | `rgba(250,250,248,0.16)` |
| `--border-strong` | `rgba(250,250,248,0.32)` |
| `--accent` | `var(--color-terracotta)` (unchanged) |
| `--bg-card` | `rgba(250,250,248,0.06)` |

### Contrast caveats (do not break)

- **Terracota `#C76B4C` + white text ≈ 3.9:1 → fails AA.** Never as a primary button fill with white text. Use terracota as **text on crudo** (passes AA at ≥18px / ≥14px bold) or as **outline button** with petróleo label.
- **Gris piedra `#8A8A8A` on blanco ≈ 3.3:1 → fails AA.** Body text must use `--text-muted` (`#4F5B62`). Piedra only for ≥18px text or decorative borders.
- **Azul Petróleo `#1A3A4A` + white ≈ 13:1 → AAA.** This is the primary CTA combination.

---

## 2. Typography

**Stacks**

| Token | Family | Fallback |
|-------|--------|----------|
| `--font-heading` | `'EB Garamond', 'Literata', Georgia, serif` | Serif humanista, warm, timeless |
| `--font-body` | `'Inter', 'Nunito Sans', 'DM Sans', system-ui, sans-serif` | Clean sans for body + UI |
| `--font-mono` | `'JetBrains Mono', ui-monospace, monospace` | Informe técnico / metadata only |

Display impact (optional, hero only): `Playfair Display` swapped into `--font-heading` for the single hero `<h1>`. Document if used.

**Type scale** (rem, 16px base, mobile-first)

| Token | Size / Line / Weight | Family | Use |
|-------|----------------------|--------|-----|
| `--text-display` | `3.25rem / 1.1 / 600` | heading | Hero `<h1>` (md+: `4rem`) |
| `--text-h1` | `2.5rem / 1.15 / 600` | heading | Page title |
| `--text-h2` | `2rem / 1.2 / 600` | heading | Section title |
| `--text-h3` | `1.5rem / 1.3 / 500` | heading | Card / sub-section title |
| `--text-h4` | `1.25rem / 1.4 / 500` | heading | Small heading |
| `--text-lead` | `1.25rem / 1.6 / 400` | body | Hero subtitle / lead paragraph |
| `--text-body` | `1rem / 1.65 / 400` | body | Default body |
| `--text-sm` | `0.875rem / 1.6 / 400` | body | Secondary body, form labels |
| `--text-caption` | `0.75rem / 1.5 / 400` | body | Captions, table cells |
| `--text-eyebrow` | `0.75rem / 1.4 / 600` | body | Uppercase, `letter-spacing: 0.12em`, terracota — section kickers |
| `--text-button` | `0.9375rem / 1 / 500` | body | Button label |

Default body color `--text-primary`. Default `letter-spacing: 0` except eyebrow and logo wordmark (+0.05em). Measure: `max-width: 65ch` on prose blocks.

---

## 3. Spacing

4px base. Use these tokens — never raw px for layout.

| Token | rem | px | Typical use |
|-------|-----|----|-------------|
| `--space-0` | 0 | 0 | — |
| `--space-xs` | 0.25 | 4 | Icon↔label gap, tight padding |
| `--space-sm` | 0.5 | 8 | Inline element gaps, input padding-y |
| `--space-md` | 1 | 16 | Default gap, list item rhythm |
| `--space-lg` | 1.5 | 24 | Card padding, container side padding |
| `--space-xl` | 2 | 32 | Between cards, section sub-gap |
| `--space-2xl` | 3 | 48 | Between elements in a section |
| `--space-3xl` | 4 | 64 | Section vertical padding (mobile) |
| `--space-4xl` | 6 | 96 | Section vertical padding (desktop) |
| `--space-5xl` | 8 | 128 | Hero vertical rhythm |

**Container:** `max-width: 72rem` (1152px), `padding-inline: var(--space-lg)`, `margin-inline: auto`.
**Section vertical padding:** `clamp(4rem, 8vw, 6rem)`.

---

## 4. Border radius

Quiet luxury → restrained, not pill-round.

| Token | Value | Use |
|-------|-------|-----|
| `--radius-none` | `0` | Dividers, full-bleed images |
| `--radius-sm` | `4px` | Inputs, chips, small buttons |
| `--radius-md` | `8px` | Buttons, default cards |
| `--radius-lg` | `12px` | Large cards, modal, media |
| `--radius-pill` | `999px` | Tags, status pills |
| `--radius-circle` | `50%` | Avatars, icon buttons |

---

## 5. Shadows

Subtle, petrol-tinted. No drop shadows on text.

| Token | Value | Use |
|-------|-------|-----|
| `--shadow-sm` | `0 1px 2px rgba(26,58,74,0.06)` | Cards default (or use border instead) |
| `--shadow-md` | `0 4px 12px rgba(26,58,74,0.08)` | Cards on hover, popover |
| `--shadow-lg` | `0 12px 32px rgba(26,58,74,0.12)` | Modal, sticky header on scroll |
| `--ring-focus` | `0 0 0 3px rgba(199,107,76,0.35)` | Focus-visible on all interactive elements |

Prefer a `1px solid var(--border-default)` over `--shadow-sm` where possible — borders read quieter than shadows here.

---

## 6. Breakpoints & layout

Mobile-first. Min-width media queries.

| Token | Width | Target |
|-------|-------|--------|
| `--bp-sm` | `640px` | Large phones, small tablets |
| `--bp-md` | `768px` | Tablets |
| `--bp-lg` | `1024px` | Small laptops |
| `--bp-xl` | `1280px` | Desktop |
| `--bp-2xl` | `1536px` | Wide desktop (cap) |

Grid: 12-col at `--bp-lg+`, `gap: var(--space-lg)`. Below `--bp-md` single column, stacked.
Max content width `72rem`; wide hero imagery may bleed to `--bp-2xl`.

---

## 7. Motion

| Token | Duration / Easing | Use |
|-------|-------------------|-----|
| `--motion-fast` | `150ms ease-out` | Hover, toggle, focus |
| `--motion-base` | `200ms ease-out` | Buttons, links, color shifts |
| `--motion-slow` | `300ms cubic-bezier(0.2,0.8,0.2,1)` | Modal, panel, section reveal |

`prefers-reduced-motion: reduce` → all transitions `0ms`, no transform/opacity reveal animations. Honor it.

---

## 8. Z-index

| Token | Value | Use |
|-------|-------|-----|
| `--z-base` | `0` | Default flow |
| `--z-header` | `10` | Sticky header |
| `--z-dropdown` | `20` | Menus, language switcher |
| `--z-modal` | `30` | Dialog, contact overlay |
| `--z-toast` | `40` | Confirmation toast |

---

## 9. Iconography & illustration

- **Icons:** 1.5px stroke, `currentColor`, 24px box, rounded line caps. Set: Lucide (matches linear + minimal). Avoid filled glyphs.
- **Illustrations:** linear + flat color wash, 1.5–2px stroke, brand palette only. Hero illustration occupies the hero block — **no photographs**. Transparent or `--color-white` background. See `knowledge/brand.md` §Ilustraciones.

---

## 10. Components — naming & composition

Astro components in `web/src/components/`, PascalCase, one component per file.

### Primitives

| Component | Props / variants | Notes |
|-----------|------------------|-------|
| `Container` | — | `max-w 72rem`, centered, side padding |
| `Section` | `tone: 'light' \| 'dark'`, `spacing: 'md' \| 'lg'` | Wraps a page band; flips dark tokens when `dark` |
| `Eyebrow` | — | Uppercase terracota kicker above headings |
| `Heading` | `level: 1..4`, `size?: display\|h1\|h2\|h3\|h4` | Serif; size may decouple from semantic level |
| `Button` | `variant: 'primary' \| 'outline' \| 'ghost' \| 'on-dark'`, `size: 'sm' \| 'md' \| 'lg'`, `href?`, `type?` | See button rules below |
| `Link` | `href`, `external?` | Inline accent link, underline offset 3px |
| `Icon` | `name`, `size?` | Lucide wrapper |
| `Illustration` | `name`, `alt` | Decorative: `aria-hidden` unless informative |
| `Card` | `tone?: 'light' \| 'dark'`, `pad?: 'md' \| 'lg'`, `bordered?` | `--radius-md`, 1px border OR `--shadow-sm` |
| `Pill` / `Tag` | `tone?: 'neutral' \| 'accent' \| 'success' \| 'warning' \| 'error'` | `--radius-pill`, `--text-sm` |
| `Field` | `label`, `hint?`, `error?`, `required?` | See states-interactions skill |
| `Input` / `Textarea` / `Select` | — | `--radius-sm`, 1px border, 8px padding-y, focus ring |
| `Divider` | — | 1px `--border-default` |

### Composites (page-level)

`Header`, `Footer`, `HeroSection`, `HowItWorks`, `PlanCard`, `PlanGrid`, `AddOnList`, `FeatureList`, `VideoProof` (the "cada visita grabada" band), `CoverageMap`, `Languages`, `Faq`, `ContactForm`, `Quote` (testimonial / persona quote).

### Button rules

| Variant | Background | Text | Border | Use |
|---------|-----------|------|--------|-----|
| `primary` | `--color-petrol` | `--color-white` | none | Main CTA (AAA contrast) |
| `outline` | transparent | `--color-petrol` | `1px solid --border-strong` | Secondary action on light |
| `ghost` | transparent | `--color-petrol` | none | Tertiary, in-card actions |
| `on-dark` | transparent | `--color-white` | `1px solid rgba(250,250,248,0.32)` | Secondary CTA on petróleo band |
| `accent` | transparent | `--color-terracotta` | `1px solid --color-terracotta` | Tertiary accent; **never terracota fill + white text** |

Hover: darken text/fill toward `--accent-hover` (terracota) or `#0F2A36` (petróleo deep); add `--shadow-sm`. Focus: `--ring-focus`. Disabled: `opacity: 0.5`, `pointer-events: none`, `aria-disabled`.

### Composition rules

- **Every page section** is `<Section><Container>…</Container></Section>`. Never pad the page directly.
- Alternate `Section tone="light"` and `tone="dark"` (crudo vs petróleo) only where the brand calls for emphasis (hero band, video-proof band, footer). Most sections are light.
- Cards live on `--bg-section` (crudo) sections with `--bg-card` (blanco). A card on a blanco section uses `--border-default` instead of shadow.
- Eyebrow → Heading → lead/body is the default rhythm. Don't skip the eyebrow on section headers.
- One primary CTA per section. Secondary actions use `outline` or `ghost`.
- Icon + label spacing: `var(--space-sm)`. Icon + heading: icon above heading, `--space-sm` between.

### Do / Don't

- **Do** use serif for all headings, sans for everything else.
- **Do** use 1px hairline borders over shadows for card edges.
- **Do** keep hero illustration as the visual anchor; no stock photos.
- **Don't** use Terracota as a button fill with white text (fails AA).
- **Don't** use Gris piedra for body text or borders under 18px.
- **Don't** introduce gradients, glassmorphism, or a third typeface.
- **Don't** use red/green success-error colors outside the `--success` / `--error` tokens.
- **Don't** hardcode hex values in components — reference CSS variables from `tokens.css`.
- **Don't** bypass this file. If a token is missing, add it here first, then use it.

---

## 11. CSS variable scaffolding

Drop into `web/src/styles/tokens.css`, import once in the Astro layout root.

```css
:root {
  /* Brand */
  --color-petrol: #1A3A4A;
  --color-terracotta: #C76B4C;
  --color-cream: #F2ECE4;
  --color-white: #FAFAF8;
  --color-olive: #6B8F71;
  --color-stone: #8A8A8A;

  /* Semantic — light */
  --bg-page: var(--color-white);
  --bg-section: var(--color-cream);
  --bg-card: var(--color-white);
  --bg-dark: var(--color-petrol);
  --text-primary: var(--color-petrol);
  --text-muted: #4F5B62;
  --text-on-dark: var(--color-white);
  --text-on-dark-muted: #C4D0D5;
  --border-default: rgba(26,58,74,0.12);
  --border-strong: rgba(26,58,74,0.24);
  --accent: var(--color-terracotta);
  --accent-hover: #B25C40;
  --success: var(--color-olive);
  --warning: #C9A24A;
  --error: #B14B3A;

  /* Type */
  --font-heading: 'EB Garamond', 'Literata', Georgia, serif;
  --font-body: 'Inter', 'Nunito Sans', 'DM Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  /* Spacing */
  --space-xs: 0.25rem; --space-sm: 0.5rem; --space-md: 1rem;
  --space-lg: 1.5rem; --space-xl: 2rem; --space-2xl: 3rem;
  --space-3xl: 4rem; --space-4xl: 6rem; --space-5xl: 8rem;

  /* Radius */
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --radius-pill: 999px; --radius-circle: 50%;

  /* Shadow */
  --shadow-sm: 0 1px 2px rgba(26,58,74,0.06);
  --shadow-md: 0 4px 12px rgba(26,58,74,0.08);
  --shadow-lg: 0 12px 32px rgba(26,58,74,0.12);
  --ring-focus: 0 0 0 3px rgba(199,107,76,0.35);

  /* Breakpoints (reference only — use in media queries) */
  --bp-sm: 640px; --bp-md: 768px; --bp-lg: 1024px;
  --bp-xl: 1280px; --bp-2xl: 1536px;

  /* Motion */
  --motion-fast: 150ms ease-out;
  --motion-base: 200ms ease-out;
  --motion-slow: 300ms cubic-bezier(0.2,0.8,0.2,1);

  /* Z-index */
  --z-base: 0; --z-header: 10; --z-dropdown: 20;
  --z-modal: 30; --z-toast: 40;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition-duration: 0ms !important; animation: none !important; }
}
```

Dark sections override locally:

```css
.section--dark {
  --bg-page: var(--bg-dark);
  --text-primary: var(--text-on-dark);
  --text-muted: var(--text-on-dark-muted);
  --border-default: rgba(250,250,248,0.16);
  --border-strong: rgba(250,250,248,0.32);
  --bg-card: rgba(250,250,248,0.06);
}
```

---

## 12. Verification checklist (run before merging UI)

- [ ] No raw hex in components — only `var(--*)`.
- [ ] No Terracota fill with white text. No Gris piedra body text.
- [ ] Every heading uses `--font-heading`; every body uses `--font-body`.
- [ ] Every interactive element has a `:focus-visible` ring using `--ring-focus`.
- [ ] Every page section is `<Section><Container>…</Container></Section>`.
- [ ] `prefers-reduced-motion` honored.
- [ ] Images/illustrations have `alt` or `aria-hidden` as appropriate.
- [ ] Color contrast ≥ AA for all text (≥ AAA for primary CTA).
