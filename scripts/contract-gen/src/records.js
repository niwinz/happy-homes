import { readFile } from "node:fs/promises";
import path from "node:path";

export class RecordError extends Error {
  constructor(message) {
    super(message);
    this.name = "RecordError";
  }
}

export function parseJsonRecord(source, sourceName = "record") {
  const normalized = source.replace(/^\uFEFF/, "");
  try {
    const value = JSON.parse(normalized);
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("the root value must be an object");
    }
    return value;
  } catch (error) {
    throw new RecordError(`${sourceName} has invalid JSON: ${error.message}`);
  }
}

export async function readRecord(filePath) {
  try {
    const source = await readFile(filePath, "utf8");
    return parseJsonRecord(source, filePath);
  } catch (error) {
    if (error instanceof RecordError) throw error;
    if (error.code === "ENOENT") throw new RecordError(`Missing data file: ${filePath}`);
    throw error;
  }
}

export function getContractPaths(rootDirectory, contractId) {
  const contractDirectory = path.join(
    rootDirectory,
    "contracts",
    contractId,
  );
  return {
    contractDirectory,
    contractPath: path.join(contractDirectory, "contract.json"),
    legalIdentityPath: path.join(rootDirectory, "knowledge", "business", "legal-identity.json"),
    templatePath: path.join(rootDirectory, "knowledge", "product", "service-agreement-template.md"),
  };
}

export async function findRepositoryRoot(startDirectory) {
  let current = path.resolve(startDirectory);
  while (true) {
    try {
      await readFile(path.join(current, "package.json"));
      await readFile(path.join(current, "knowledge", "critical-info.md"));
      return current;
    } catch {
      const parent = path.dirname(current);
      if (parent === current) {
        throw new RecordError("Could not find the repository root.");
      }
      current = parent;
    }
  }
}
