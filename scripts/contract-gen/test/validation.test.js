import assert from "node:assert/strict";
import test from "node:test";

import {
  requiresDraft,
  validateRecords,
  validateTemplateVersion,
  ValidationError,
} from "../src/validation.js";

function records() {
  return {
    legalIdentity: {
      status: "draft",
      legalReviewApproved: false,
      variables: {},
    },
    contract: {
      status: "draft",
      contractId: "HH-001",
      templateVersion: "0.1-draft",
      variables: {},
      choices: {},
    },
  };
}

test("accepts a minimal draft and allows omitted optional values", () => {
  assert.doesNotThrow(() => validateRecords({
    ...records(),
    expectedContractId: "HH-001",
  }));
});

test("requires the contract identifier to match its directory", () => {
  assert.throws(
    () => validateRecords({ ...records(), expectedContractId: "HH-002" }),
    (error) => error instanceof ValidationError && /must match/.test(error.message),
  );
});

test("rejects access secrets even in nested fields", () => {
  const input = records();
  input.contract.operations = { alarmCode: "1234" };
  assert.throws(
    () => validateRecords({ ...input, expectedContractId: "HH-001" }),
    /must not be stored/,
  );
});

test("rejects misspelled or unsupported variables", () => {
  const input = records();
  input.contract.variables.customerEmali = "typo@example.invalid";
  assert.throws(
    () => validateRecords({ ...input, expectedContractId: "HH-001" }),
    /customerEmali is not allowed/,
  );
});

test("requires draft while any approval gate remains open", () => {
  const input = records();
  assert.equal(requiresDraft({
    templateSource: "legal_review_required: false",
    ...input,
  }), true);
  input.legalIdentity.legalReviewApproved = true;
  input.legalIdentity.status = "approved";
  input.contract.status = "approved";
  assert.equal(requiresDraft({
    templateSource: "legal_review_required: false",
    ...input,
  }), false);
});

test("requires the contract to reference the canonical template version", () => {
  const input = records();
  assert.doesNotThrow(() => validateTemplateVersion(
    "---\nversion: 0.1-draft\n---\n",
    input.contract,
  ));
  assert.throws(
    () => validateTemplateVersion("---\nversion: 0.2\n---\n", input.contract),
    /must match the canonical template/,
  );
});
