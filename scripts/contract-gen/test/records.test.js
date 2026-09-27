import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { getContractPaths, parseJsonRecord, RecordError } from "../src/records.js";

test("reads a JSON record", () => {
  const record = parseJsonRecord('{"contractId":"HH-001"}', "fixture.json");
  assert.equal(record.contractId, "HH-001");
});

test("rejects invalid JSON or a non-object root", () => {
  assert.throws(() => parseJsonRecord("{bad}", "bad.json"), RecordError);
  assert.throws(() => parseJsonRecord("[]", "bad.json"), /root value must be an object/);
});

test("resolves operational records from the root contracts directory", () => {
  const paths = getContractPaths("/repo", "HH-001");
  assert.equal(paths.contractDirectory, path.join("/repo", "contracts", "HH-001"));
  assert.equal(paths.contractPath, path.join("/repo", "contracts", "HH-001", "contract.json"));
});
