# AI Agent Guide

## CRITICAL: Read module memories BEFORE writing any code

Do this before planning, coding, or touching an application file:

1. Read `knowledge/critical-info.md`; it is the graph root for project memory.
2. Identify every knowledge area affected by the task.
3. Read each affected area's `core.md` and follow its relevant links.
4. For UI work, also read root `DESIGN.md`; it takes precedence over older visual guidance.
5. If memory prose conflicts with manifests, config, scripts, or current source wiring, trust executable sources for current behavior and flag business conflicts rather than guessing intent.

Do not proceed until you have read the relevant memories. This requirement also applies to small code changes.

Before creating any commit, read `knowledge/workflow/creating-commits.md`. It is the source of truth for commit format, line limits, AI attribution, and amend permissions. Never amend a pushed commit unless the user explicitly asks.

## Tooling and commands

- Use Node `v24.15.0` (`.nvmrc`) and the root-pinned `pnpm@11.8.0`; install from the repository root with `pnpm install`.
- The only workspace package is the static Astro site in `web/`. Run it from the root with `pnpm --filter happy-homes-web dev`; `astro.config.mjs` exposes it on `0.0.0.0:4169`.
- The current verification gate is `pnpm --filter happy-homes-web build`. There are no configured test, lint, formatter, or CI workflows.
- Do not rely on `pnpm --filter happy-homes-web check` yet: Astro prompts to install undeclared `@astrojs/check` and `typescript`, so it is not a non-interactive check.
- The build currently completes all five routes but emits a CSS syntax warning: `web/src/components/Header.astro` has `display`/`flex-direction`/`gap` declarations outside `.nav-mobile-menu` after its closing brace. Do not mistake this baseline warning for a clean build.

## Site wiring

- Routes are `web/src/pages/*.astro`; all share `web/src/layouts/Base.astro`, which owns global styles, metadata, header/footer, and the small IntersectionObserver reveal script.
- Page content and data are currently inline in the route files. `web/prototype-content/*.md` is reference/prototype copy and is not imported at runtime; editing it does not change the site.
- Reuse primitives and composites in `web/src/components/`. Keep browser JavaScript exceptional: the only current client scripts are reveal handling in `Base.astro` and form behavior in `ContactForm.astro`.
- `web/dist/` and `web/.astro/` are generated and ignored; never edit them.

## UI constraints

- Root `DESIGN.md` is the detailed source of truth for tokens, component composition, contrast, responsiveness, and accessibility.
- Put shared semantic values in `web/src/styles/tokens.css`; dark sections/components must carry `section--dark` so semantic text, border, card, and accent tokens flip together.
- Icons and illustrations are inline SVG maps in `Icon.astro` and `Illustration.astro`, not an icon package. The illustration paths are simple stand-ins rather than final brand artwork.

## Deployment placeholders

- Do not ship without replacing the default Formspree action `https://formspree.io/f/your-id` in `ContactForm.astro`, the placeholder phone number in `pages/contacto.astro`, and the placeholder `site` URL in `astro.config.mjs`.
