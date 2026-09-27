import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { parseJsonRecord } from "../src/records.js";
import { renderAgreement } from "../src/render.js";
import { validateRecords, validateTemplateVersion } from "../src/validation.js";

const rootUrl = new URL("../../../", import.meta.url);
const legalUrl = new URL("knowledge/business/legal-identity.json", rootUrl);
const contractUrl = new URL("knowledge/business/clients/HH-TEST-001/contract.json", rootUrl);
const templateUrl = new URL("knowledge/product/service-agreement-template.md", rootUrl);

test("the canonical fictitious contract resolves completely", async () => {
  const [legalSource, contractSource, templateSource] = await Promise.all([
    readFile(legalUrl, "utf8"),
    readFile(contractUrl, "utf8"),
    readFile(templateUrl, "utf8"),
  ]);
  const legalIdentity = parseJsonRecord(legalSource, legalUrl.pathname);
  const contract = parseJsonRecord(contractSource, contractUrl.pathname);

  validateTemplateVersion(templateSource, contract);
  validateRecords({ legalIdentity, contract, expectedContractId: "HH-TEST-001" });
  const output = renderAgreement({ templateSource, legalIdentity, contract, isDraft: true });
  assert.doesNotMatch(output, /\{\{/);
  assert.doesNotMatch(output, /Notas internas de preparación/);
  assert.match(output, /BORRADOR DE VALIDACIÓN/);
  assert.match(output, /Marta Exemple Puig · legal@happyhomes\.cam/);
});
