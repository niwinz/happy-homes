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
│   └── brand/visual-assets
├── business/core
│   ├── business/personas
│   └── business/pricing-and-economics
├── web/core
│   └── ../DESIGN.md
└── workflow/core
    └── workflow/creating-commits
```

Read this file first. Then read the `core.md` for every area affected by the
task. Follow links from that core only when they are relevant.

| Change | Required memory |
|---|---|
| Brand copy, tone, or claims | `brand/core.md` |
| Audience or positioning | `business/core.md`, then `business/personas.md` |
| Plans, prices, service scope | `business/core.md`, then `business/pricing-and-economics.md` |
| UI, components, or accessibility | `web/core.md`, then root `DESIGN.md` |
| Logo or illustration assets | `brand/core.md`, `brand/visual-assets.md`, and root `DESIGN.md` |
| Creating a commit | `workflow/core.md`, then `workflow/creating-commits.md` |

## Source precedence

- Manifests, config, and source code define how the current site runs.
- Root `DESIGN.md` defines UI and accessibility rules, even where older brand
  material differs.
- `business/pricing-and-economics.md` is the latest commercial analysis, but
  its proposals remain unapproved hypotheses unless marked otherwise.
- `brand/core.md` defines voice and brand principles.
- `business/personas.md` contains research assumptions, not validated facts.
- `brand/visual-assets.md` is an asset-production brief, not the web design
  system.

If implementation and business memory conflict, report the conflict. Do not
assume that current website copy is an approved business decision.

## Unresolved conflicts

- The site uses Basic, Standard, and Premium with ranges of 59–249 euros. The
  latest analysis proposes testing Lite at 79 euros, Care at 119 euros, and
  Complete at 219–229 euros. None is confirmed as the final public offer.
- The site makes claims about occupation control, 24-hour response, no minimum
  term, key custody, arrival preparation, and coordination. Operations and
  contract limits have not validated all of them.
- Coverage boundaries, VAT presentation, visit duration, home-size limits,
  after-hours availability, and included coordination remain undecided.
- Brand material lists four service languages in places, while the site also
  advertises German.
