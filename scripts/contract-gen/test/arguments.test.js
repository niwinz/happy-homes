import assert from "node:assert/strict";
import test from "node:test";

import { parseCliArguments, UsageError } from "../src/arguments.js";

test("accepts pnpm's forwarded separator and defaults", () => {
  const options = parseCliArguments(["--", "--contract", "HH-TEST-001", "--draft"]);
  assert.equal(options.contractId, "HH-TEST-001");
  assert.equal(options.document, "agreement");
  assert.equal(options.format, "all");
  assert.equal(options.draft, true);
});

test("requires a contract identifier", () => {
  assert.throws(
    () => parseCliArguments(["--draft"]),
    (error) => error instanceof UsageError && /--contract is required/.test(error.message),
  );
});

test("rejects unsupported formats", () => {
  assert.throws(
    () => parseCliArguments(["--contract", "HH-001", "--format", "odt"]),
    /docx, pdf, or all/,
  );
});

test("accepts visit sheets and rejects unsupported documents", () => {
  const options = parseCliArguments([
    "--contract", "HH-001", "--document", "visit-sheet", "--format", "pdf",
  ]);
  assert.equal(options.document, "visit-sheet");
  assert.throws(
    () => parseCliArguments(["--contract", "HH-001", "--document", "invoice"]),
    /agreement, visit-sheet, or all/,
  );
});
