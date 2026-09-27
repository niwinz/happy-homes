import assert from "node:assert/strict";
import test from "node:test";

import { getOutputPaths } from "../src/convert.js";

test("marks only draft artifact names as drafts", () => {
  const draft = getOutputPaths("/output", true);
  const final = getOutputPaths("/output", false);
  assert.equal(draft.pdf, "/output/agreement-draft.pdf");
  assert.equal(final.pdf, "/output/agreement.pdf");
});

test("uses independent visit sheet artifact names", () => {
  const draft = getOutputPaths("/output", true, "visit-sheet");
  const final = getOutputPaths("/output", false, "visit-sheet");
  assert.equal(draft.docx, "/output/visit-sheet-draft.docx");
  assert.equal(final.pdf, "/output/visit-sheet.pdf");
});
