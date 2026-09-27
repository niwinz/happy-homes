# Critical information

## Project

HappyHomes is a static Astro marketing site for a proposed second-home care
service in the Costa Brava and Alt Empordà. The service, prices, operating
limits, and customer segments include hypotheses that have not yet been
validated. Do not turn a hypothesis into a public promise without approval.

## Memory map

```text
critical-info
├── brand/core
│   └── brand/design
├── product/core
├── business/core
│   ├── business/personas
│   └── business/pricing-and-economics
├── web/core
│   └── brand/design
├── research/serenohome-competitive-analysis
├── plans/serenohome-improvements
└── workflow/core
    └── workflow/creating-commits
```

Read this file first. Then read the `core.md` for every area affected by the
task. Follow links from that core only when they are relevant.

| Change | Required memory |
|---|---|
| Brand copy, tone, or claims | `brand/core.md` |
| Product, plans, service, protocol, communication, data, or claims | `product/core.md` |
| Audience or positioning | `business/core.md`, then `business/personas.md` |
| Plans, prices, service scope | `product/core.md`; then `business/pricing-and-economics.md` for analysis |
| UI, components, or accessibility | `web/core.md`, then `brand/design.md` |
| Logo or illustration assets | `brand/core.md`, then `brand/design.md` |
| Creating a commit | `workflow/core.md`, then `workflow/creating-commits.md` |

## Competitive research and implementation plans

- [`research/serenohome-competitive-analysis.md`](research/serenohome-competitive-analysis.md)
  records the observed offer, UX, visual system, trust model, conversion flow,
  local SEO and legal boundaries of SerenoHome. It separates observations,
  inferences and recommendations.
- [`plans/serenohome-improvements.md`](plans/serenohome-improvements.md) turns
  that research into a phased plan. Its business, legal and operational
  decisions are prerequisites, not approved public promises.

## Source precedence

- Manifests, config, and source code define how the current site runs.
- `product/core.md` is the source of truth for the product being designed:
  service, plans, prices, protocol, communication, evidence, extras, limits,
  data rules, and approved claims. Its status labels determine what still needs
  validation before publication.
- `brand/design.md` defines all visual, UI, asset, and accessibility rules.
- `business/pricing-and-economics.md` is the latest commercial analysis, but
  explains scenarios rather than defining the current product.
- `brand/core.md` defines voice and brand principles.
- `business/personas.md` contains research assumptions, not validated facts.

If implementation and business memory conflict, report the conflict. Do not
assume that current website copy is an approved business decision.

## Unresolved conflicts

- The product canon provisionally defines Lite at 79 euros, Care at 119 euros,
  and Complete at 229 euros, plus an annual prepaid option with two months of
  discount. The site still uses Basic, Standard, and Premium with ranges of
  59–249 euros. Do not publish the new table until its validation gates pass.
- The site makes claims about occupation control, 24-hour response, no minimum
  term, key custody, arrival preparation, and coordination. Operations and
  contract limits have not validated all of them; `product/core.md` now marks
  which are qualified, provisional, pending, or prohibited.
- The product direction now uses continuous video without audio as the primary
  visit evidence when the owner has signed explicit consent, with dated photos
  as the alternative. Contract, protected storage, access, deletion no later
  than 15 days after report delivery, and recording contingencies still gate
  the final public promise.
- Coverage remains pending. VAT presentation, a 150 m² standard-home limit,
  service hours, and included coordination now have provisional definitions in
  `product/core.md` and still require validation.
- The product proposal starts with Spanish and Catalan, leaves French and
  English subject to capacity, and excludes German at launch. Existing brand
  and site copy still advertise broader language coverage.
