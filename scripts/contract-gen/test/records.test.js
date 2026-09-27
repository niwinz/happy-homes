import assert from "node:assert/strict";
import test from "node:test";

import { parseJsonRecord, RecordError } from "../src/records.js";

test("reads a JSON record", () => {
  const record = parseJsonRecord('{"contractId":"HH-001"}', "fixture.json");
  assert.equal(record.contractId, "HH-001");
});

test("rejects invalid JSON or a non-object root", () => {
  assert.throws(() => parseJsonRecord("{bad}", "bad.json"), RecordError);
  assert.throws(() => parseJsonRecord("[]", "bad.json"), /root value must be an object/);
});
