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
| Business | General business context, audiences, positioning inputs, pricing analysis, economics, commercial hypotheses, and legal identity | `knowledge/business/core.md` | `knowledge/business/personas.md` for audience hypotheses; `knowledge/business/pricing-and-economics.md` for prices, economics, VAT, scope, or coverage analysis; `knowledge/business/legal-identity.json` for the provider identity |
| Contracts | Operational contract records and generated documents | `contracts/AGENTS.md` | `knowledge/product/service-agreement-template.md`, `knowledge/business/legal-identity.json`, then `scripts/contract-gen/AGENTS.md` |
| Web | Current runtime architecture, source locations, implementation constraints, required references, and known blockers | `knowledge/web/core.md` | The product, brand, business, and design sources it links for the specific change |
| Research | External observations and competitive evidence; never product approval | `knowledge/research/serenohome-competitive-analysis.md` | The relevant canonical area before applying a finding |
| Plans | Proposed implementation sequences; never approval of product or business decisions | `knowledge/plans/2026-09-27-1-serenohome-improvements.md` | The source documents and validation gates referenced by the plan |
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

## Creating plans

- Save every new implementation plan in `knowledge/plans/`.
- Name plans `YYYY-MM-DD-N-<slug>.md`, where the date is the plan creation date,
  `N` is the next positive integer for that date, and `<slug>` is short,
  lowercase, and hyphen-separated. Inspect the directory before choosing `N`.
- Organize plans as `Paso 0`, `Paso 1`, and so on; do not introduce phases.
- Give every executable task a document-wide unique identifier in the form
  `T001`, `T002`, and so on. Number tasks continuously and never restart task
  numbering in a new step.
- State status, scope, dependencies, affected files, acceptance criteria, and
  verification. A plan records proposed work and never approves product or
  business decisions by itself.

## Tooling and commands

- Use Node `v24.21.0` (`.nvmrc`) and `pnpm@12.5.1`, both provided by the base image. The project intentionally has no `packageManager` pin and does not use Corepack.
- Install from the repository root with `pnpm install`. The workspace store is configured as `.pnpm-store` in `pnpm-workspace.yaml`.
- Workspace packages are the static Astro `7.3.5` site in `web/`, the local
  contract generator in `scripts/contract-gen/`, and the dependency-free
  OpenRouter video CLI in `scripts/video-gen/`.
- Run the development server from the root with `pnpm --filter happy-homes-web dev`; `astro.config.mjs` exposes it on `0.0.0.0:11001`, matching the first port reserved in `.manage.env`.
- The web verification gate is `pnpm --filter happy-homes-web build`. It builds
  all configured routes. There are no configured lint, formatter, or CI
  workflows.
- Do not rely on `pnpm --filter happy-homes-web check` yet: `@astrojs/check` and `typescript` are not declared, so Astro prompts for an interactive install.
- Run the video CLI from the root with
  `pnpm --filter @happy-homes/video-gen cli -- --help`. Its unit tests run with
  `node --test scripts/video-gen/test/*.test.js`; never submit a paid generation
  merely to verify code.

## Video generation CLI

- Read [`scripts/video-gen/AGENTS.md`](scripts/video-gen/AGENTS.md) before
  changing or operating the OpenRouter video tooling. It is the module's
  canonical guide for commands, architecture, safety rules, and verification.
- The module has one entrypoint, `scripts/video-gen/src/cli.js`, exposed through
  the package's sole `cli` script. Use `--list-models` for discovery,
  `--preview` for a non-generating request preview, and no mode flag for an
  explicitly confirmed generation.
- Preview and automated verification must never submit a paid video job. A real
  generation requires an explicit model and interactive confirmation or
  `--yes`.

## Contract generation CLI

- Read [`scripts/contract-gen/AGENTS.md`](scripts/contract-gen/AGENTS.md) before
  changing or operating the agreement generator. It is the module's canonical
  guide for data sources, commands, approval gates, outputs, and verification.
- Generate the fictitious example from the root with
  `pnpm --filter @happy-homes/contract-gen cli -- --contract HH-TEST-001 --document all --format all --draft --overwrite`.
- `knowledge/product/service-agreement-template.md` is the canonical agreement
  text. `knowledge/business/legal-identity.json` provides the business data and
  each `contracts/<id>/contract.json` provides known client and service values.
- Never store alarm or access codes, passwords, credentials, or physical key
  locations in contract records. Never overwrite `agreement-signed.pdf`.
- Missing client values become blank writing lines. While any legal approval
  gate remains open, only visibly marked `--draft`
  output is allowed. Tests run with
  `node --test scripts/contract-gen/test/*.test.js`.

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
