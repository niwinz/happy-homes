import assert from "node:assert/strict";
import test from "node:test";

import { renderVisitSheet, VISIT_SHEET_PENDING } from "../src/visit-sheet.js";

function contract() {
  return {
    contractId: "HH-A-001",
    variables: {
      customerFullName: "Marta Exemple Serra",
      customerIdentityDocument: "DOC-PRIVATE",
      customerNoticeAddress: "Private notice address",
      customerEmail: "marta@example.invalid",
      customerPhone: "+34 600 000 000",
      serviceAddress: "Private service address",
      finalPriceAndVat: "119 € al mes",
      homeManagerNameAndContact: "Marta Manager · manager@example.invalid",
      homeTypeAndSize: "Casa de 95 m²",
      visitsPerCalendarMonth: "2",
      visitWindowAndServiceHours: "Lunes a viernes, 09:00–18:00",
      includedAreas: "Interior accesible y terraza",
      excludedAreas: "Cubierta y piscina",
      explicitlyUnauthorizedActions: "Manipular el cuadro eléctrico",
      authorizedEquipment: "Luces del recibidor",
      authorizedShutters: "Persianas del salón",
      exitProfile: "Luces apagadas y puerta asegurada",
      otherAuthorizedSimpleAction: "No aplicable",
      accessMethodCategory: "Llave física, sin secretos",
      failedAccessRule: "Avisar a coordinación y detener la visita",
      evidenceModeVideoOrPhotos: "Solo fotografías fechadas",
      recordingFailureContingency: "No aplicable",
    },
    choices: {
      evidenceMode: "photos",
      emergencySpend: "zero",
      protocol: {
        water: true,
        equipment: true,
        ventilation: true,
        shutters: true,
        climateReading: true,
        exitProfile: true,
        other: false,
      },
    },
  };
}

test("renders a printable operational sheet without personal or commercial data", () => {
  const output = renderVisitSheet({ contract: contract(), isDraft: false });
  assert.match(output, /^# Ficha operativa de visita$/m);
  assert.match(output, /HH-A-001/);
  assert.match(output, /Casa de 95 m²/);
  assert.match(output, /☒ Abrir grifos/);
  assert.match(output, /0 € — cualquier gasto requiere autorización previa/);
  for (const excluded of [
    "Marta Exemple Serra",
    "DOC-PRIVATE",
    "Private notice address",
    "marta@example.invalid",
    "+34 600 000 000",
    "Private service address",
    "119 € al mes",
    "Marta Manager",
  ]) {
    assert.doesNotMatch(output, new RegExp(excluded.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("marks drafts and unresolved operational values visibly", () => {
  const input = contract();
  input.variables.homeTypeAndSize = "";
  input.choices.protocol.water = null;
  const output = renderVisitSheet({ contract: input, isDraft: true });
  assert.match(output, /BORRADOR OPERATIVO — NO UTILIZAR EN UNA VISITA/);
  assert.match(output, new RegExp(VISIT_SHEET_PENDING));
  assert.match(output, /PENDIENTE —.*Abrir grifos/);
});

test("rejects personal data copied into an operational field", () => {
  const input = contract();
  input.variables.includedAreas = input.variables.customerFullName;
  assert.throws(
    () => renderVisitSheet({ contract: input, isDraft: false }),
    /contains personal contract data: customerFullName/,
  );
});

test("refuses an incomplete final operational sheet", () => {
  const input = contract();
  input.variables.exitProfile = "";
  assert.throws(
    () => renderVisitSheet({ contract: input, isDraft: false }),
    /not operationally complete: exitProfile/,
  );
});
