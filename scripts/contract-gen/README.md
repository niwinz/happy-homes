# HappyHomes contract generator

Generates a prefilled DOCX and PDF from:

1. `knowledge/business/legal-identity.json`
2. `knowledge/business/clients/<contract_id>/contract.json`
3. `knowledge/product/service-agreement-template.md`

Missing values become writing lines. No intermediate Markdown is retained.

```bash
pnpm --filter @happy-homes/contract-gen cli -- \
  --contract HH-TEST-001 \
  --format all \
  --draft \
  --overwrite
```

The files are created beside `contract.json` as `agreement-draft.docx` and
`agreement-draft.pdf`. Use `--overwrite` to regenerate them.

The eventual signed original is stored manually as `agreement-signed.pdf`. The
generator never creates or overwrites that file.

The contract lifecycle, invariants, and consolidated pending-work index are in
`knowledge/business/clients/AGENTS.md`. Routine intake is handled by the
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
