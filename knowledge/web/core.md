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

- Read [`../product/core.md`](../product/core.md) before changing product copy,
  plans, protocol, communication, forms, data handling, or public claims. The
  website must express that product and must not define a different one.
- Read [`../brand/design.md`](../brand/design.md) before any UI change. It is
  the source of truth for visual tokens, composition, contrast,
  responsiveness, and accessibility.
- Read [`../brand/core.md`](../brand/core.md) for customer-facing copy.
- Read [`../business/core.md`](../business/core.md) before changing plans,
  prices, coverage, or service promises.
- Competitive findings and the proposed implementation sequence live in
  [`../research/serenohome-competitive-analysis.md`](../research/serenohome-competitive-analysis.md)
  and [`../plans/serenohome-improvements.md`](../plans/serenohome-improvements.md).

## Current blockers

- Formspree, the contact phone, and the canonical site URL are placeholders.
- Inline SVG illustrations are temporary stand-ins.
- The build succeeds but reports malformed CSS in `Header.astro` after the
  `.nav-mobile-menu` rule.
