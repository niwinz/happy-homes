import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const MAX_REFERENCE_BYTES = 10 * 1024 * 1024;
const MAX_TOTAL_REFERENCE_BYTES = 25 * 1024 * 1024;

const MIME_TYPES = new Map([
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".webp", "image/webp"],
]);

function parseHttpsUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return undefined;
  }
  if (url.protocol !== "https:") {
    throw new Error(`Reference URLs must use HTTPS: ${value}`);
  }
  return url;
}

function safeRemoteLabel(url) {
  return `${url.origin}${url.pathname}`;
}

async function loadReference(value, workspaceRoot) {
  const remoteUrl = parseHttpsUrl(value);
  if (remoteUrl) {
    return {
      url: remoteUrl.toString(),
      bytes: 0,
      source: { kind: "https", label: safeRemoteLabel(remoteUrl) },
    };
  }

  const filePath = path.resolve(workspaceRoot, value);
  const mimeType = MIME_TYPES.get(path.extname(filePath).toLowerCase());
  if (!mimeType) throw new Error(`Reference images must be PNG, JPEG, or WEBP: ${value}`);

  const fileStat = await stat(filePath);
  if (!fileStat.isFile()) throw new Error(`Reference is not a file: ${value}`);
  if (fileStat.size > MAX_REFERENCE_BYTES) {
    throw new Error(`Reference image exceeds the 10 MB limit: ${value}`);
  }
  const buffer = await readFile(filePath);
  return {
    url: `data:${mimeType};base64,${buffer.toString("base64")}`,
    bytes: buffer.byteLength,
    source: { kind: "local", label: path.relative(workspaceRoot, filePath) },
  };
}

export async function loadReferenceInputs({ firstFrame, lastFrame, references }, workspaceRoot) {
  const [loadedFirstFrame, loadedLastFrame, loadedReferences] = await Promise.all([
    firstFrame ? loadReference(firstFrame, workspaceRoot) : undefined,
    lastFrame ? loadReference(lastFrame, workspaceRoot) : undefined,
    Promise.all(references.map((value) => loadReference(value, workspaceRoot))),
  ]);
  const all = [loadedFirstFrame, loadedLastFrame, ...loadedReferences].filter(Boolean);
  const totalBytes = all.reduce((sum, reference) => sum + reference.bytes, 0);
  if (totalBytes > MAX_TOTAL_REFERENCE_BYTES) {
    throw new Error("Local reference images exceed the combined 25 MB limit.");
  }
  return {
    firstFrame: loadedFirstFrame,
    lastFrame: loadedLastFrame,
    references: loadedReferences,
    sources: all.map(({ source }) => source),
  };
}
