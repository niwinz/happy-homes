# Contract generation CLI guide

This directory is the `@happy-homes/contract-gen` workspace package. Keep the
workflow deliberately small: one provider JSON file, one contract JSON file,
generated agreement and visit-sheet derivatives, and the eventual signed PDF.

Read `knowledge/product/core.md` before changing terms or claims and
`knowledge/brand/design.md` before changing document styling.

## Data flow

```text
knowledge/product/service-agreement-template.md
knowledge/business/legal-identity.json
contracts/<contract_id>/contract.json
                          ↓
               local validation and merge
                           ↓
 agreement-draft.* / agreement.*   visit-sheet-draft.* / visit-sheet.*
                ↓                              ↓
 agreement-signed.pdf (manual)       internal print (return or destroy)
```

- The Markdown template owns the legal wording.
- `legal-identity.json` owns provider and privacy values.
- A single `contract.json` owns known client, home, service, and choice values.
- JSON fields and template placeholders use `camelCase`. `contractId` is the
  single identifier; do not duplicate it as a home code.
- Missing agreement values render as writing lines. Visit-sheet drafts mark
  missing operational values as pending, while final visit sheets reject them.
  Do not add a second data mode or split client data into more records.
- The Markdown used by Pandoc is temporary and must not be persisted.

## Command

Run from the repository root:

```sh
pnpm --filter @happy-homes/contract-gen cli -- \
  --contract HH-TEST-001 \
  --document all \
  --format all \
  --draft \
  --overwrite
```

Use `--overwrite` only for unsigned generated drafts. The CLI never creates or
changes `agreement-signed.pdf`.

`--document` accepts `agreement`, `visit-sheet`, or `all`; its default is
`agreement`. The visit sheet is a one-page operational derivative. It must use
only an opaque reference and must exclude identity, address, contacts, prices,
billing, signatures, access secrets, and key locations.

## Operating procedure

For routine intake, prefer the project skill `hh-new-contract`: it extracts
structured values from user-provided context, presents them for explicit
confirmation, writes `contract.json`, and invokes this CLI. The manual steps
below remain the auditable fallback and the contract the skill must follow.

1. Copy `contracts/_template/contract.json` to
   `contracts/<contract_id>/contract.json` and make `contractId` match the
   folder.
2. Fill known values only. Leave unknown values absent or empty; they become
   writing lines. Set `homeManagerNameAndContact` to the responsible person,
   which may be the provider.
3. Generate with `--document all --draft`, then review identity data, blanks,
   choices, prices, page layout, and visible warnings. Confirm separately that
   the visit sheet contains no personal or commercial data.
4. Do not remove approval gates without explicit legal and business approval.
   Once all gates are approved, generate without `--draft` to obtain
   `agreement.*` for signature and an operationally complete `visit-sheet.*`.
5. After external signature, store the exact original as
   `agreement-signed.pdf`. Never modify it; corrections require an addendum or a
   new `contractId`.

The single pending-work index is `contracts/AGENTS.md`, under
“Pendientes”. Keep that index current when a blocker is discovered or closed;
do not leave pending work documented only in code comments or conversation
history.

## Invariants

- Require `--draft` while the template, legal identity, or contract remains
  unapproved. Keep the warning visible in every draft.
- Never store alarm codes, access codes, passwords, credentials, or physical
  key locations.
- Never include personal data, a full address, price, billing, signatures, or
  secrets in `visit-sheet.*`. Printed copies must be returned or destroyed.
- Use opaque codes in paths, never personal names.
- Use `camelCase` for every JSON field and template placeholder. Reject unknown
  fields rather than guessing their intent.
- Keep the package dependency-free. Pandoc, XeLaTeX, and Python 3 are external
  document tools, not runtime dependencies.
- `HH-TEST-001` and `legal-identity.json` currently contain fictitious data.
- `assets/reference.docx` controls Word styling; `assets/pdf-header.tex` and
  `assets/table-widths.lua` control shared document layout.
- The document header still uses a typographic wordmark. Embedding the final
  logo from `knowledge/brand/assets/logo.svg` is a presentation follow-up.

## Verification

```sh
node --test scripts/contract-gen/test/*.test.js
pnpm --filter @happy-homes/contract-gen cli -- --help
pnpm --filter @happy-homes/contract-gen cli -- \
  --contract HH-TEST-001 --document all --format all --draft --overwrite
```

Check that the PDF is A4, fonts are embedded, tables and page breaks are intact,
and no output contains unresolved `{{...}}` placeholders or internal notes. The
visit sheet must remain one page and contain no known fixture identity, address,
contact, pricing, billing, signature, or access-secret values.
