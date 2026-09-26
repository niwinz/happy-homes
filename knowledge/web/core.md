# Web core

## Runtime structure

- `web/` is the only workspace package and builds a static Astro site.
- Routes live in `web/src/pages/*.astro` and use
  `web/src/layouts/Base.astro`.
- Runtime page copy and data are inline in route files.
  `web/prototype-content/*.md` is reference material and is not imported.
- Shared UI lives in `web/src/components/`; shared CSS tokens live in
  `web/src/styles/tokens.css`.
- Client JavaScript is limited to reveal handling in `Base.astro` and contact
  form behavior in `ContactForm.astro`.

## Required references

- Read root [`../../DESIGN.md`](../../DESIGN.md) before any UI change. It is the
  source of truth for visual tokens, composition, contrast, responsiveness,
  and accessibility.
- Read [`../brand/core.md`](../brand/core.md) for customer-facing copy.
- Read [`../business/core.md`](../business/core.md) before changing plans,
  prices, coverage, or service promises.

## Current blockers

- Formspree, the contact phone, and the canonical site URL are placeholders.
- Inline SVG illustrations are temporary stand-ins.
- The build succeeds but reports malformed CSS in `Header.astro` after the
  `.nav-mobile-menu` rule.
