# AI Agent Guide

## CRITICAL: Read project knowledge BEFORE planning or coding

`knowledge/critical-info.md` is the graph root and the first required read for
every task. Then identify every affected area below, read its starting point,
and follow the relevant links from there. Cross-cutting tasks require every
affected area; this also applies to small changes.

### Essential knowledge starting points

| Area | What belongs there | Start here | Continue with |
|---|---|---|---|
| Global project context | Project summary, memory map, source precedence, and unresolved conflicts | `knowledge/critical-info.md` | The affected areas below |
| Brand | Brand principles, positioning language, voice, tone, vocabulary, taglines, and customer-facing expression | `knowledge/brand/core.md` | `knowledge/brand/design.md` for visual identity, UI, accessibility, logos, icons, illustrations, or other assets |
| Product | The proposed service itself: plans, prices, scope, protocol, communication, evidence, extras, limits, data rules, and allowed or prohibited claims | `knowledge/product/core.md` | Its decision statuses and validation gates; this is the canonical product source |
| Business | General business context, audiences, positioning inputs, pricing analysis, economics, and commercial hypotheses | `knowledge/business/core.md` | `knowledge/business/personas.md` for audience hypotheses; `knowledge/business/pricing-and-economics.md` for prices, economics, VAT, scope, or coverage analysis |
| Web | Current runtime architecture, source locations, implementation constraints, required references, and known blockers | `knowledge/web/core.md` | The product, brand, business, and design sources it links for the specific change |
| Research | External observations and competitive evidence; never product approval | `knowledge/research/serenohome-competitive-analysis.md` | The relevant canonical area before applying a finding |
| Plans | Proposed implementation sequences; never approval of product or business decisions | `knowledge/plans/serenohome-improvements.md` | The source documents and validation gates referenced by the plan |
| Workflow | Repository procedures | `knowledge/workflow/core.md` | `knowledge/workflow/creating-commits.md` before every commit |

### Knowledge authority and conflicts

- `knowledge/product/core.md` defines what the proposed product is and what may
  be claimed. Never turn a provisional, pending, research, persona, pricing, or
  plan hypothesis into a public promise.
- `knowledge/brand/core.md` defines how HappyHomes speaks;
  `knowledge/brand/design.md` defines how it looks and behaves.
- `knowledge/business/` contains business context and analysis. Its personas and
  economic scenarios are inputs, not validated facts or current product terms.
- `knowledge/research/` records evidence and recommendations;
  `knowledge/plans/` records proposed sequencing. Neither overrides the product
  canon or constitutes implementation approval.
- Manifests, config, scripts, and current source wiring define current technical
  behavior. If they conflict with business memory, report the conflict rather
  than guessing or silently blending alternatives.

Do not proceed until the required knowledge has been read.

Before creating any commit, read `knowledge/workflow/creating-commits.md`. It is
the source of truth for commit format, line limits, AI attribution, and amend
permissions. Never amend a pushed commit unless the user explicitly asks.

## Tooling and commands

- Use Node `v24.21.0` (`.nvmrc`) and `pnpm@12.5.1`, both provided by the base image. The project intentionally has no `packageManager` pin and does not use Corepack.
- Install from the repository root with `pnpm install`. The workspace store is configured as `.pnpm-store` in `pnpm-workspace.yaml`.
- The only workspace package is the static Astro `7.3.5` site in `web/`.
- Run the development server from the root with `pnpm --filter happy-homes-web dev`; `astro.config.mjs` exposes it on `0.0.0.0:11001`, matching the first port reserved in `.manage.env`.
- The verification gate is `pnpm --filter happy-homes-web build`. It currently builds all five routes cleanly. There are no configured test, lint, formatter, or CI workflows.
- Do not rely on `pnpm --filter happy-homes-web check` yet: `@astrojs/check` and `typescript` are not declared, so Astro prompts for an interactive install.

## Site wiring

- Routes are `web/src/pages/*.astro`; all share `web/src/layouts/Base.astro`, which owns global styles, metadata, header/footer, and the small IntersectionObserver reveal script.
- Page content and data are currently inline in the route files. `web/prototype-content/*.md` is reference/prototype copy and is not imported at runtime; editing it does not change the site.
- Reuse primitives and composites in `web/src/components/`. Keep browser JavaScript exceptional: the only current client scripts are reveal handling in `Base.astro` and form behavior in `ContactForm.astro`.
- `web/dist/` and `web/.astro/` are generated and ignored; never edit them.

## UI constraints

- `knowledge/brand/design.md` is the source of truth for brand visuals, tokens, component composition, contrast, responsiveness, and accessibility.
- Put shared semantic values in `web/src/styles/tokens.css`; dark sections/components must carry `section--dark` so semantic text, border, card, and accent tokens flip together.
- Icons and illustrations are inline SVG maps in `Icon.astro` and `Illustration.astro`, not an icon package. The illustration paths are simple stand-ins rather than final brand artwork.

## Deployment placeholders

- Do not ship without replacing the default Formspree action `https://formspree.io/f/your-id` in `ContactForm.astro`, the placeholder phone number in `pages/contacto.astro`, and the placeholder `site` URL in `astro.config.mjs`.
