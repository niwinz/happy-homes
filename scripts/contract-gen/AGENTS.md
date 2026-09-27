# Contract generation CLI guide

This directory is the `@happy-homes/contract-gen` workspace package. Keep the
workflow deliberately small: one provider JSON file, one contract JSON file,
two generated draft documents, and the eventual signed PDF.

Read `knowledge/product/core.md` before changing terms or claims and
`knowledge/brand/design.md` before changing document styling.

## Data flow

```text
knowledge/product/service-agreement-template.md
knowledge/business/legal-identity.json
knowledge/business/clients/<contract_id>/contract.json
                          ↓
               local validation and merge
                          ↓
 agreement-draft.* (pending) or agreement.* (approved)
                          ↓
             agreement-signed.pdf (manual)
```

- The Markdown template owns the legal wording.
- `legal-identity.json` owns provider and privacy values.
- A single `contract.json` owns known client, home, service, and choice values.
- JSON fields and template placeholders use `camelCase`. `contractId` is the
  single identifier; do not duplicate it as a home code.
- Missing or empty values render as writing lines; do not add a second mode or
  split client data into more records.
- The Markdown used by Pandoc is temporary and must not be persisted.

## Command

Run from the repository root:

```sh
pnpm --filter @happy-homes/contract-gen cli -- \
  --contract HH-TEST-001 \
  --format all \
  --draft \
  --overwrite
```

Use `--overwrite` only for unsigned generated drafts. The CLI never creates or
changes `agreement-signed.pdf`.

## Operating procedure

1. Copy `knowledge/business/clients/_template/contract.json` to
   `clients/<contract_id>/contract.json` and make `contractId` match the folder.
2. Fill known values only. Leave unknown values absent or empty; they become
   writing lines. Set `homeManagerNameAndContact` to the responsible person,
   which may be the provider.
3. Generate with `--draft`, then review identity data, blanks, choices, prices,
   page layout, and the visible warning.
4. Do not remove approval gates without explicit legal and business approval.
   Once all gates are approved, generate without `--draft` to obtain
   `agreement.docx` and `agreement.pdf` for signature.
5. After external signature, store the exact original as
   `agreement-signed.pdf`. Never modify it; corrections require an addendum or a
   new `contractId`.

The single pending-work index is
`knowledge/business/clients/README.md`, under “Registro de pendientes de esta
tarea”. Keep that index current when a blocker is discovered or closed; do not
leave pending work documented only in code comments or conversation history.

## Invariants

- Require `--draft` while the template, legal identity, or contract remains
  unapproved. Keep the warning visible in every draft.
- Never store alarm codes, access codes, passwords, credentials, or physical
  key locations.
- Use opaque codes in paths, never personal names.
- Use `camelCase` for every JSON field and template placeholder. Reject unknown
  fields rather than guessing their intent.
- Keep the package dependency-free. Pandoc, XeLaTeX, and Python 3 are external
  document tools, not runtime dependencies.
- `HH-TEST-001` and `legal-identity.json` currently contain fictitious data.
- `assets/reference.docx` controls Word styling; `assets/pdf-header.tex` and
  `assets/table-widths.lua` control PDF styling.
- The document header still uses a typographic wordmark. Embedding the final
  logo from `knowledge/brand/assets/logo.svg` is a presentation follow-up.

## Verification

```sh
node --test scripts/contract-gen/test/*.test.js
pnpm --filter @happy-homes/contract-gen cli -- --help
pnpm --filter @happy-homes/contract-gen cli -- \
  --contract HH-TEST-001 --format all --draft --overwrite
```

Check that the PDF is A4, fonts are embedded, tables and page breaks are intact,
and neither output contains unresolved `{{...}}` placeholders or internal notes.
