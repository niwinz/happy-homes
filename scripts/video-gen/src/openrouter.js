const API_BASE_URL = "https://openrouter.ai/api/v1";
const OPENROUTER_ORIGIN = new URL(API_BASE_URL).origin;

class OpenRouterError extends Error {
  constructor(message, { status, payload } = {}) {
    super(message);
    this.name = "OpenRouterError";
    this.status = status;
    this.payload = payload;
  }
}

function getErrorMessage(payload, status) {
  return payload?.error?.message || payload?.message || `OpenRouter request failed with HTTP ${status}.`;
}

async function requestJson(url, { apiKey, method = "GET", body } = {}) {
  const headers = { Accept: "application/json" };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const response = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(120_000),
  });
  const text = await response.text();
  let payload;

  try {
    payload = text ? JSON.parse(text) : undefined;
  } catch {
    payload = { message: text || "Empty response." };
  }

  if (!response.ok) {
    throw new OpenRouterError(getErrorMessage(payload, response.status), {
      status: response.status,
      payload,
    });
  }
  return payload;
}

export async function listVideoModels({ apiKey } = {}) {
  const payload = await requestJson(`${API_BASE_URL}/videos/models`, { apiKey });
  if (!Array.isArray(payload?.data)) {
    throw new OpenRouterError("OpenRouter returned an invalid video model list.");
  }
  return payload.data;
}

export async function createVideoJob({ apiKey, requestBody }) {
  return requestJson(`${API_BASE_URL}/videos`, {
    apiKey,
    method: "POST",
    body: requestBody,
  });
}

function getPollingUrl(rawPollingUrl) {
  const pollingUrl = new URL(rawPollingUrl, `${API_BASE_URL}/`);
  if (pollingUrl.origin !== OPENROUTER_ORIGIN) {
    throw new OpenRouterError("OpenRouter returned an unexpected polling URL.");
  }
  return pollingUrl;
}

export async function getVideoJob({ apiKey, pollingUrl }) {
  if (!pollingUrl) throw new OpenRouterError("The video job did not include a polling URL.");
  return requestJson(getPollingUrl(pollingUrl), { apiKey });
}

function getVideoContentUrl(job) {
  const rawUrl = job.unsigned_urls?.[0] || `${API_BASE_URL}/videos/${job.id}/content?index=0`;
  return new URL(rawUrl, `${API_BASE_URL}/`);
}

export async function downloadVideo({ apiKey, job, destination }) {
  const url = getVideoContentUrl(job);
  if (url.protocol !== "https:") {
    throw new OpenRouterError("OpenRouter returned a non-HTTPS video URL.");
  }
  const headers = {};
  if (url.origin === OPENROUTER_ORIGIN) headers.Authorization = `Bearer ${apiKey}`;

  const response = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(300_000),
  });
  if (!response.ok || !response.body) {
    throw new OpenRouterError(`Unable to download the generated video (HTTP ${response.status}).`, {
      status: response.status,
    });
  }

  const { createWriteStream } = await import("node:fs");
  const { Readable, Transform } = await import("node:stream");
  const { pipeline } = await import("node:stream/promises");
  const partialDestination = `${destination}.part`;
  let bytes = 0;
  const maxBytes = 500 * 1024 * 1024;
  const limiter = new Transform({
    transform(chunk, encoding, callback) {
      bytes += chunk.byteLength;
      if (bytes > maxBytes) {
        callback(new Error("Generated video exceeds the 500 MB safety limit."));
        return;
      }
      callback(null, chunk);
    },
  });

  try {
    await pipeline(
      Readable.fromWeb(response.body),
      limiter,
      createWriteStream(partialDestination, { flags: "wx" }),
    );
    const { rename } = await import("node:fs/promises");
    await rename(partialDestination, destination);
  } catch (error) {
    const { rm } = await import("node:fs/promises");
    await rm(partialDestination, { force: true });
    throw error;
  }

  return { bytes, url: url.toString() };
}

export { OpenRouterError };
