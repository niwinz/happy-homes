import { CONTRACT_VARIABLES, LEGAL_VARIABLES, selectVariables } from "./schema.js";

const BLANK_LINE = "________________________________";

function checkbox(selected) {
  return selected ? "☒" : "☐";
}

function escapeMarkdown(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\|/g, "\\|")
    .replace(/\r?\n/g, "<br>");
}

function extractSignableTemplate(templateSource) {
  const withoutFrontmatter = templateSource.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
  const internalHeading = "# Notas internas de preparación — excluir del documento firmable";
  const internalIndex = withoutFrontmatter.indexOf(internalHeading);
  if (internalIndex === -1) {
    throw new Error("The agreement template is missing the internal-notes boundary.");
  }
  return withoutFrontmatter.slice(0, internalIndex).trim();
}

function replaceTaskCheckboxes(markdown, choices) {
  const protocol = choices.protocol || {};
  const selections = {
    evidenceVideoCheckbox: checkbox(choices.evidenceMode === "video"),
    evidencePhotosCheckbox: checkbox(choices.evidenceMode === "photos"),
    earlyStartCheckbox: checkbox(choices.earlyStart === true),
    protocolWaterCheckbox: checkbox(protocol.water === true),
    protocolEquipmentCheckbox: checkbox(protocol.equipment === true),
    protocolVentilationCheckbox: checkbox(protocol.ventilation === true),
    protocolShuttersCheckbox: checkbox(protocol.shutters === true),
    protocolClimateReadingCheckbox: checkbox(protocol.climateReading === true),
    protocolExitProfileCheckbox: checkbox(protocol.exitProfile === true),
    protocolOtherCheckbox: checkbox(protocol.other === true),
    emergencyZeroCheckbox: checkbox(choices.emergencySpend === "zero"),
    emergencyHundredCheckbox: checkbox(choices.emergencySpend === "hundred"),
    emergencyCustomCheckbox: checkbox(choices.emergencySpend === "custom"),
  };

  let result = markdown;
  for (const [name, value] of Object.entries(selections)) {
    result = result.replaceAll(`{{${name}}}`, value);
  }
  return result;
}

function replaceDraftNotice(markdown, isDraft) {
  const noticePattern = /^> \*\*BORRADOR INTERNO[\s\S]*?protección de datos y consumo\.\r?\n/m;
  if (isDraft) {
    return markdown.replace(
      noticePattern,
      "> **BORRADOR DE VALIDACIÓN — NO FIRMAR NI UTILIZAR PARA CONTRATAR.** "
      + "La identidad jurídica y las condiciones legales continúan pendientes de aprobación.\n",
    );
  }
  return markdown.replace(noticePattern, "");
}

export function collectVariables({ legalIdentity, contract }) {
  return {
    ...selectVariables(legalIdentity.variables, LEGAL_VARIABLES),
    ...selectVariables(contract.variables, CONTRACT_VARIABLES),
    contractId: contract.contractId,
    templateVersion: contract.templateVersion,
  };
}

export function renderAgreement({ templateSource, legalIdentity, contract, isDraft }) {
  let rendered = extractSignableTemplate(templateSource);
  rendered = rendered.replace(
    "# HappyHomes — plantilla de acuerdo de prestación de servicios y acceso a la vivienda",
    "# HappyHomes — acuerdo de prestación de servicios y acceso a la vivienda",
  );
  rendered = rendered.replace(/^---\r?\n?/gm, "");
  rendered = replaceDraftNotice(rendered, isDraft);
  rendered = replaceTaskCheckboxes(rendered, contract.choices || {});
  rendered = rendered.replace(/`(\{\{[a-zA-Z][a-zA-Z0-9]*\}\})`/g, "$1");

  const variables = collectVariables({ legalIdentity, contract });
  rendered = rendered.replace(/\{\{([a-zA-Z][a-zA-Z0-9]*)\}\}/g, (placeholder, name) => {
    if (!(name in variables)) return placeholder;
    const value = variables[name];
    if (value === null || value === undefined || value === "") return BLANK_LINE;
    return escapeMarkdown(value);
  });

  const unresolved = [...rendered.matchAll(/\{\{([a-zA-Z][a-zA-Z0-9]*)\}\}/g)].map((match) => match[1]);
  if (unresolved.length > 0) {
    throw new Error(`Unresolved template variables: ${[...new Set(unresolved)].sort().join(", ")}`);
  }

  return `${rendered.trim()}\n`;
}

export { BLANK_LINE };
