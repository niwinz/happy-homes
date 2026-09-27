import assert from "node:assert/strict";
import test from "node:test";

import { BLANK_LINE, renderAgreement } from "../src/render.js";

const templateSource = `---
legal_review_required: true
---

# HappyHomes — plantilla de acuerdo de prestación de servicios y acceso a la vivienda

Nombre: \`{{customerFullName}}\`

- {{evidenceVideoCheckbox}} Vídeo
- {{evidencePhotosCheckbox}} Fotos
- {{earlyStartCheckbox}} Inicio anticipado
- {{emergencyZeroCheckbox}} Cero euros
- {{protocolWaterCheckbox}} Agua

---

# Notas internas de preparación — excluir del documento firmable

Internal only.
`;

function input() {
  return {
    templateSource,
    legalIdentity: { variables: {} },
    contract: {
      contractId: "HH-A-001",
      templateVersion: "0.1",
      variables: { customerFullName: "Marta | Exemple" },
      choices: {
        evidenceMode: "photos",
        earlyStart: false,
        emergencySpend: "zero",
        protocol: { water: true },
      },
    },
    isDraft: true,
  };
}

test("renders filled values and deterministic checkboxes", () => {
  const output = renderAgreement(input());
  assert.match(output, /Marta \\| Exemple/);
  assert.match(output, /☐ Vídeo/);
  assert.match(output, /☒ Fotos/);
  assert.match(output, /☒ Cero euros/);
  assert.match(output, /☒ Agua/);
  assert.doesNotMatch(output, /Notas internas/);
  assert.doesNotMatch(output, /\{\{/);
  assert.doesNotMatch(output, /^---$/m);
});

test("missing values and choices remain blank for manual completion", () => {
  const data = input();
  data.contract.variables = {};
  data.contract.choices = {};
  const output = renderAgreement(data);
  assert.match(output, new RegExp(BLANK_LINE));
  assert.match(output, /☐ Vídeo/);
  assert.match(output, /☐ Fotos/);
  assert.match(output, /☐ Cero euros/);
  assert.match(output, /☐ Agua/);
});
