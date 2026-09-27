const PENDING = "Pendiente de confirmar";

export class VisitSheetError extends Error {
  constructor(message) {
    super(message);
    this.name = "VisitSheetError";
  }
}

const PERSONAL_DATA_VARIABLES = [
  "customerFullName",
  "customerIdentityDocument",
  "customerNoticeAddress",
  "customerEmail",
  "customerPhone",
  "serviceAddress",
  "homeManagerNameAndContact",
  "authorizedContacts",
  "authorizedAccessRolesOrPeople",
  "reportRecipients",
  "spendAuthorizers",
  "incidentContactOrder",
];

const REQUIRED_OPERATIONAL_VARIABLES = [
  "homeTypeAndSize",
  "visitsPerCalendarMonth",
  "visitWindowAndServiceHours",
  "includedAreas",
  "excludedAreas",
  "explicitlyUnauthorizedActions",
  "accessMethodCategory",
  "failedAccessRule",
  "recordingFailureContingency",
  "exitProfile",
];

const PROTOCOL_CHOICES = [
  "water",
  "equipment",
  "ventilation",
  "shutters",
  "climateReading",
  "exitProfile",
  "other",
];

function escapeMarkdown(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\|/g, "\\|")
    .replace(/\r?\n/g, "<br>");
}

function valueOrPending(value) {
  if (value === null || value === undefined || String(value).trim() === "") return PENDING;
  return escapeMarkdown(value);
}

function protocolItem(selected, label, detail) {
  if (selected === null || selected === undefined) return `- **PENDIENTE —** ${label}`;
  const suffix = selected && detail ? `: ${valueOrPending(detail)}` : "";
  return `- ${selected ? "☒" : "☐"} ${label}${suffix}`;
}

function emergencyLimit(contract) {
  const choice = contract.choices?.emergencySpend;
  if (choice === "zero") return "0 € — cualquier gasto requiere autorización previa";
  if (choice === "hundred") return "Hasta 100 €, impuestos incluidos";
  if (choice === "custom") return valueOrPending(contract.variables?.customEmergencySpendLimit);
  return PENDING;
}

function evidenceMode(contract) {
  const choice = contract.choices?.evidenceMode;
  if (choice === "video") return "Vídeo continuo sin audio";
  if (choice === "photos") return "Solo fotografías fechadas";
  return PENDING;
}

function assertOperationallyReady(contract, isDraft) {
  if (isDraft) return;
  const variables = contract.variables || {};
  const protocol = contract.choices?.protocol || {};
  const missing = REQUIRED_OPERATIONAL_VARIABLES.filter(
    (name) => variables[name] === null
      || variables[name] === undefined
      || String(variables[name]).trim() === "",
  );
  for (const name of PROTOCOL_CHOICES) {
    if (typeof protocol[name] !== "boolean") missing.push(`choices.protocol.${name}`);
  }
  if (!["video", "photos"].includes(contract.choices?.evidenceMode)) {
    missing.push("choices.evidenceMode");
  }
  if (!["zero", "hundred", "custom"].includes(contract.choices?.emergencySpend)) {
    missing.push("choices.emergencySpend");
  }
  if (protocol.equipment === true && !String(variables.authorizedEquipment || "").trim()) {
    missing.push("authorizedEquipment");
  }
  if (protocol.shutters === true && !String(variables.authorizedShutters || "").trim()) {
    missing.push("authorizedShutters");
  }
  if (protocol.other === true && !String(variables.otherAuthorizedSimpleAction || "").trim()) {
    missing.push("otherAuthorizedSimpleAction");
  }
  if (
    contract.choices?.emergencySpend === "custom"
    && !String(variables.customEmergencySpendLimit || "").trim()
  ) {
    missing.push("customEmergencySpendLimit");
  }
  if (missing.length > 0) {
    throw new VisitSheetError(
      `Visit sheet is not operationally complete: ${[...new Set(missing)].join(", ")}`,
    );
  }
}

function assertExcludedDataAbsent(markdown, variables) {
  const leaked = [];
  for (const name of PERSONAL_DATA_VARIABLES) {
    const value = variables[name];
    if (value === null || value === undefined || String(value).trim() === "") continue;
    if (markdown.includes(escapeMarkdown(String(value).trim()))) leaked.push(name);
  }
  if (leaked.length > 0) {
    throw new VisitSheetError(
      `Visit sheet contains personal contract data: ${leaked.join(", ")}`,
    );
  }
}

export function renderVisitSheet({ contract, isDraft }) {
  assertOperationallyReady(contract, isDraft);
  const variables = contract.variables || {};
  const protocol = contract.choices?.protocol || {};
  const notice = isDraft
    ? "> **BORRADOR OPERATIVO — NO UTILIZAR EN UNA VISITA.** Faltan aprobaciones o datos por confirmar.\n>\n"
    : "";

  const markdown = `# Ficha operativa de visita

${notice}> **USO INTERNO — SIN DATOS PERSONALES.** No añadir nombres, dirección, teléfonos, códigos, credenciales ni ubicaciones de llaves. Devolver o destruir la copia al terminar la visita.

**Referencia opaca:** \`${contract.contractId}\`

## Vivienda y planificación

| Campo operativo | Condición |
|---|---|
| Tipología y superficie aproximada | ${valueOrPending(variables.homeTypeAndSize)} |
| Visitas por mes natural | ${valueOrPending(variables.visitsPerCalendarMonth)} |
| Ventana y horario | ${valueOrPending(variables.visitWindowAndServiceHours)} |

## Alcance de la visita

- **Zonas incluidas:** ${valueOrPending(variables.includedAreas)}
- **Zonas excluidas:** ${valueOrPending(variables.excludedAreas)}
- **Actuaciones no autorizadas:** ${valueOrPending(variables.explicitlyUnauthorizedActions)}

## Protocolo autorizado

☒ autorizado · ☐ no autorizado

${protocolItem(protocol.water, "Abrir grifos accesibles y descargar inodoros")}
${protocolItem(protocol.equipment, "Encender luces o equipos concretos", variables.authorizedEquipment)}
${protocolItem(protocol.ventilation, "Ventilar brevemente cuando sea seguro")}
${protocolItem(protocol.shutters, "Abrir o cerrar persianas indicadas", variables.authorizedShutters)}
${protocolItem(protocol.climateReading, "Leer temperatura o humedad disponible")}
${protocolItem(protocol.exitProfile, "Restituir el perfil de salida", variables.exitProfile)}
${protocolItem(protocol.other, "Otra actuación simple", variables.otherAuthorizedSimpleAction)}

## Acceso, evidencia y cierre

| Campo operativo | Condición |
|---|---|
| Categoría del medio de acceso, sin secretos | ${valueOrPending(variables.accessMethodCategory)} |
| Si el acceso falla | ${valueOrPending(variables.failedAccessRule)} |
| Modalidad de evidencia | ${evidenceMode(contract)} |
| Si falla la grabación | ${valueOrPending(variables.recordingFailureContingency)} |
| Perfil de salida | ${valueOrPending(variables.exitProfile)} |
| Límite de gasto urgente | ${emergencyLimit(contract)} |

## Incidencias

Prioriza la seguridad, no diagnostiques ni repares fuera del alcance autorizado y comunica la incidencia a coordinación HappyHomes mediante el canal interno.
`;

  assertExcludedDataAbsent(markdown, variables);
  return `${markdown.trim()}\n`;
}

export { PENDING as VISIT_SHEET_PENDING };
