import { access } from "node:fs/promises";
import { loadEnvFile } from "node:process";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const PACKAGE_ROOT = fileURLToPath(new URL("../", import.meta.url));
export const WORKSPACE_ROOT = fileURLToPath(new URL("../../../", import.meta.url));

async function loadOptionalEnvFile(filePath) {
  try {
    await access(filePath);
    loadEnvFile(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

export async function loadEnvironment() {
  // Values already exported by the shell retain precedence. The package-local
  // file takes precedence over the workspace file when both define a value.
  await loadOptionalEnvFile(path.join(PACKAGE_ROOT, ".env"));
  await loadOptionalEnvFile(path.join(WORKSPACE_ROOT, ".env"));
}

export function resolveWorkspacePath(value) {
  return path.resolve(WORKSPACE_ROOT, value);
}

export function getApiKey({ required = false } = {}) {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (required && !apiKey) {
    throw new Error("OPENROUTER_API_KEY is required for generation.");
  }
  return apiKey;
}
