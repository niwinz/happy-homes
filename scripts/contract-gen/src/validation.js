import { RECORD_SCHEMAS } from "./schema.js";

const FORBIDDEN_KEY_PARTS = [
  "alarmcode",
  "accesscode",
  "doorcode",
  "keylocation",
  "password",
  "credential",
  "codigoalarma",
  "codigodeacceso",
  "ubicacionllave",
  "contrasena",
];

const CHOICE_KEYS = ["evidenceMode", "earlyStart", "emergencySpend", "protocol"];
const PROTOCOL_KEYS = [
  "water",
  "equipment",
  "ventilation",
  "shutters",
  "climateReading",
  "exitProfile",
  "other",
];

export class ValidationError extends Error {
  constructor(errors) {
    super(`Contract data is invalid:\n- ${errors.join("\n- ")}`);
    this.name = "ValidationError";
    this.errors = errors;
  }
}

function normalizedKey(key) {
  return key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
}

function findForbiddenKeys(value, location = "record", results = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => findForbiddenKeys(item, `${location}[${index}]`, results));
    return results;
  }
  if (!value || typeof value !== "object") return results;

  for (const [key, child] of Object.entries(value)) {
    const keyLocation = `${location}.${key}`;
    const normalized = normalizedKey(key);
    if (FORBIDDEN_KEY_PARTS.some((part) => normalized.includes(part))) results.push(keyLocation);
    findForbiddenKeys(child, keyLocation, results);
  }
  return results;
}

function requireString(record, field, label, errors) {
  if (typeof record[field] !== "string" || !record[field].trim()) {
    errors.push(`${label}.${field} must be a non-empty string.`);
  }
}

function validateShape(record, schemaName, label, errors) {
  const schema = RECORD_SCHEMAS[schemaName];
  for (const key of schema.required) {
    if (!Object.hasOwn(record, key)) errors.push(`${label}.${key} is required.`);
  }
  for (const key of Object.keys(record)) {
    if (!schema.topLevel.includes(key)) errors.push(`${label}.${key} is not allowed.`);
  }
  if (!record.variables || typeof record.variables !== "object" || Array.isArray(record.variables)) {
    errors.push(`${label}.variables must be an object.`);
    return;
  }
  for (const name of Object.keys(record.variables)) {
    if (!schema.variables.includes(name)) errors.push(`${label}.variables.${name} is not allowed.`);
  }
}

function validateChoices(choices, errors) {
  if (!choices || typeof choices !== "object" || Array.isArray(choices)) {
    errors.push("contract.choices must be an object.");
    return;
  }
  for (const key of Object.keys(choices)) {
    if (!CHOICE_KEYS.includes(key)) errors.push(`contract.choices.${key} is not allowed.`);
  }
  if (![undefined, null, "video", "photos"].includes(choices.evidenceMode)) {
    errors.push("contract.choices.evidenceMode must be video, photos, or null.");
  }
  if (![undefined, null, "zero", "hundred", "custom"].includes(choices.emergencySpend)) {
    errors.push("contract.choices.emergencySpend must be zero, hundred, custom, or null.");
  }
  if (![undefined, null, true, false].includes(choices.earlyStart)) {
    errors.push("contract.choices.earlyStart must be a boolean or null.");
  }
  if (choices.protocol === undefined || choices.protocol === null) return;
  if (typeof choices.protocol !== "object" || Array.isArray(choices.protocol)) {
    errors.push("contract.choices.protocol must be an object or null.");
    return;
  }
  for (const [key, value] of Object.entries(choices.protocol)) {
    if (!PROTOCOL_KEYS.includes(key)) errors.push(`contract.choices.protocol.${key} is not allowed.`);
    else if (![null, true, false].includes(value)) {
      errors.push(`contract.choices.protocol.${key} must be a boolean or null.`);
    }
  }
}

export function validateRecords({ legalIdentity, contract, expectedContractId }) {
  const errors = [];
  validateShape(legalIdentity, "legalIdentity", "legal identity", errors);
  validateShape(contract, "contract", "contract", errors);
  requireString(legalIdentity, "status", "legal identity", errors);
  requireString(contract, "status", "contract", errors);
  requireString(contract, "contractId", "contract", errors);
  requireString(contract, "templateVersion", "contract", errors);
  if (typeof legalIdentity.legalReviewApproved !== "boolean") {
    errors.push("legal identity.legalReviewApproved must be a boolean.");
  }
  if (contract.contractId && contract.contractId !== expectedContractId) {
    errors.push("contract.contractId must match its client directory.");
  }
  validateChoices(contract.choices, errors);

  for (const [label, record] of [["legal identity", legalIdentity], ["contract", contract]]) {
    for (const location of findForbiddenKeys(record, label)) {
      errors.push(`${location} is forbidden; access secrets must not be stored in contract records.`);
    }
  }
  if (errors.length > 0) throw new ValidationError(errors);
}

export function requiresDraft({ templateSource, legalIdentity, contract }) {
  return (
    /legal_review_required:\s*true\b/.test(templateSource)
    || legalIdentity.status !== "approved"
    || legalIdentity.legalReviewApproved !== true
    || contract.status !== "approved"
  );
}

export function validateTemplateVersion(templateSource, contract) {
  const frontmatter = templateSource.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
  const templateVersion = frontmatter?.match(/^version:\s*(\S+)\s*$/m)?.[1];
  if (!templateVersion) {
    throw new ValidationError(["The agreement template has no frontmatter version."]);
  }
  if (contract.templateVersion !== templateVersion) {
    throw new ValidationError([
      `contract.templateVersion (${contract.templateVersion}) must match the canonical template (${templateVersion}).`,
    ]);
  }
}
