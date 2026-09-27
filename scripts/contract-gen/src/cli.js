#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";

import { getHelpText, parseCliArguments, UsageError } from "./arguments.js";
import { convertDocument, ConversionError } from "./convert.js";
import {
  findRepositoryRoot,
  getContractPaths,
  readRecord,
  RecordError,
} from "./records.js";
import { renderAgreement } from "./render.js";
import { renderVisitSheet, VisitSheetError } from "./visit-sheet.js";
import {
  requiresDraft,
  validateRecords,
  validateTemplateVersion,
  ValidationError,
} from "./validation.js";

async function main() {
  const options = parseCliArguments(process.argv.slice(2));
  if (options.action === "help") {
    console.log(getHelpText());
    return;
  }

  const rootDirectory = await findRepositoryRoot(process.cwd());
  const paths = getContractPaths(rootDirectory, options.contractId);
  const [legalIdentity, contract, templateSource] = await Promise.all([
    readRecord(paths.legalIdentityPath),
    readRecord(paths.contractPath),
    readFile(paths.templatePath, "utf8"),
  ]);
  validateRecords({ legalIdentity, contract, expectedContractId: options.contractId });
  validateTemplateVersion(templateSource, contract);

  const draftRequired = requiresDraft({ templateSource, legalIdentity, contract });
  if (draftRequired && !options.draft) {
    throw new ValidationError([
      "Legal review is still pending. Generate only a marked draft with --draft.",
    ]);
  }

  const isDraft = draftRequired || options.draft;
  const outputDirectory = options.output
    ? path.resolve(rootDirectory, options.output)
    : paths.contractDirectory;
  const documentTypes = options.document === "all"
    ? ["agreement", "visit-sheet"]
    : [options.document];
  const generated = {};

  for (const documentType of documentTypes) {
    const markdown = documentType === "agreement"
      ? renderAgreement({ templateSource, legalIdentity, contract, isDraft })
      : renderVisitSheet({ contract, isDraft });
    generated[documentType] = await convertDocument({
      rootDirectory,
      markdown,
      contractId: contract.contractId,
      documentType,
      format: options.format,
      outputDirectory,
      overwrite: options.overwrite,
      isDraft,
    });
  }

  console.log(`Generated ${contract.contractId} (${isDraft ? "draft" : "final"}):`);
  for (const [documentType, outputs] of Object.entries(generated)) {
    for (const [format, filePath] of Object.entries(outputs)) {
      console.log(`  ${documentType}.${format}: ${path.relative(rootDirectory, filePath)}`);
    }
  }
}

main().catch((error) => {
  if (
    error instanceof UsageError
    || error instanceof RecordError
    || error instanceof ValidationError
    || error instanceof ConversionError
    || error instanceof VisitSheetError
  ) {
    console.error(error.message);
    process.exitCode = 2;
    return;
  }
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
