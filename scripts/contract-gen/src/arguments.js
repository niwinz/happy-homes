import { parseArgs } from "node:util";

const FORMATS = new Set(["docx", "pdf", "all"]);
const DOCUMENTS = new Set(["agreement", "visit-sheet", "all"]);

export class UsageError extends Error {
  constructor(message) {
    super(message);
    this.name = "UsageError";
  }
}

function nonEmpty(name, value) {
  if (value === undefined) return undefined;
  const normalized = value.trim();
  if (!normalized) throw new UsageError(`${name} cannot be empty.`);
  return normalized;
}

export function parseCliArguments(argv) {
  const normalizedArgv = argv[0] === "--" ? argv.slice(1) : argv;
  let values;
  try {
    ({ values } = parseArgs({
      args: normalizedArgv,
      options: {
        help: { type: "boolean", short: "h" },
        contract: { type: "string" },
        document: { type: "string" },
        format: { type: "string" },
        output: { type: "string" },
        draft: { type: "boolean" },
        overwrite: { type: "boolean" },
      },
      strict: true,
      allowPositionals: false,
    }));
  } catch (error) {
    throw new UsageError(error.message);
  }

  if (values.help) return { action: "help" };

  const contractId = nonEmpty("--contract", values.contract);
  if (!contractId) throw new UsageError("--contract is required.");
  if (!/^[A-Z0-9][A-Z0-9-]{2,63}$/.test(contractId)) {
    throw new UsageError("--contract must be an uppercase identifier using letters, numbers, and hyphens.");
  }

  const format = nonEmpty("--format", values.format) || "all";
  if (!FORMATS.has(format)) {
    throw new UsageError("--format must be docx, pdf, or all.");
  }

  const document = nonEmpty("--document", values.document) || "agreement";
  if (!DOCUMENTS.has(document)) {
    throw new UsageError("--document must be agreement, visit-sheet, or all.");
  }

  return {
    action: "generate",
    contractId,
    document,
    format,
    output: nonEmpty("--output", values.output),
    draft: values.draft ?? false,
    overwrite: values.overwrite ?? false,
  };
}

export function getHelpText() {
  return `HappyHomes contract document generator

Usage:
  pnpm --filter @happy-homes/contract-gen cli -- [options]

Required:
  --contract <id>           Contract identifier, for example HH-TEST-001

Options:
  --document <value>        agreement, visit-sheet, or all (default: agreement)
  --format <value>          docx, pdf, or all (default: all)
  --output <directory>      Output directory; defaults to the contract folder
  --draft                   Allow a visibly marked draft while legal review is
                            pending
  --overwrite               Replace existing unsigned generated artifacts
  --help, -h                Show this help

Safety:
  A signable document is refused while the canonical template, legal identity,
  or contract remains pending legal approval. --draft never removes the visible
  draft warning.

Examples:
  pnpm --filter @happy-homes/contract-gen cli -- --contract HH-TEST-001 --document all --format all --draft --overwrite`;
}
