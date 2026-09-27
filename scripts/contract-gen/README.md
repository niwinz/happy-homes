# HappyHomes contract generator

Generates a prefilled agreement and a privacy-minimized operational visit sheet
as DOCX and PDF from:

1. `knowledge/business/legal-identity.json`
2. `contracts/<contract_id>/contract.json`
3. `knowledge/product/service-agreement-template.md`

Missing values become writing lines. No intermediate Markdown is retained.

```bash
pnpm --filter @happy-homes/contract-gen cli -- \
  --contract HH-TEST-001 \
  --document all \
  --format all \
  --draft \
  --overwrite
```

The files are created beside `contract.json`. `--document agreement` produces
`agreement-draft.*`; `--document visit-sheet` produces `visit-sheet-draft.*`;
and `--document all` produces both. Use `--overwrite` to regenerate them.

The visit sheet is a one-page internal aid identified only by `contractId`. It
excludes client identity, address, contacts, prices, billing, signatures,
credentials, codes, and key locations. Return or destroy printed copies after
the visit. A final visit sheet is refused while required operational values are
missing; drafts show them as pending.

The eventual signed original is stored manually as `agreement-signed.pdf`. The
generator never creates or overwrites that file.

The contract lifecycle, invariants, and consolidated pending-work index are in
`contracts/AGENTS.md`. Routine intake is handled by the
project skill `hh-new-contract`.

`--draft` is mandatory while legal approval remains pending. Never store access
codes, passwords, credentials, or key locations in `contract.json`.

## Requirements and verification

The generator uses Node.js 24, Pandoc 3, XeLaTeX, Python 3, EB Garamond, Inter,
and Noto Sans Symbols 2.

```bash
node --test scripts/contract-gen/test/*.test.js
pnpm --filter @happy-homes/contract-gen cli -- --help
```

Agent-specific architecture and safety instructions are in `AGENTS.md`.
