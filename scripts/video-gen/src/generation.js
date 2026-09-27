import { createInterface } from "node:readline/promises";

import { createVideoJob, downloadVideo, getVideoJob } from "./openrouter.js";

export async function confirmGeneration({ skipConfirmation, input = process.stdin, output = process.stdout }) {
  if (skipConfirmation) return true;
  if (!input.isTTY || !output.isTTY) {
    throw new Error("Generation requires an interactive terminal or the explicit --yes flag.");
  }

  const readline = createInterface({ input, output });
  try {
    const answer = await readline.question("Submit this paid video generation request? [y/N] ");
    return /^(y|yes)$/i.test(answer.trim());
  } finally {
    readline.close();
  }
}

export async function waitForVideo({ apiKey, initialJob, pollIntervalMs, maxPollAttempts, onPoll }) {
  let job = initialJob;
  const pollingUrl = initialJob.polling_url;
  for (let attempt = 0; attempt <= maxPollAttempts; attempt += 1) {
    if (job.status === "completed") return job;
    if (["failed", "cancelled", "expired"].includes(job.status)) {
      const message = typeof job.error === "string" ? job.error : job.error?.message;
      throw new Error(message || `Video generation ended with status: ${job.status}.`);
    }
    if (attempt === maxPollAttempts) break;

    onPoll?.({ attempt: attempt + 1, maxPollAttempts, status: job.status });
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    job = await getVideoJob({ apiKey, pollingUrl: job.polling_url || pollingUrl });
  }
  throw new Error("Video generation did not complete within the polling limit.");
}

export async function runGeneration({ apiKey, request, outputPath, pollIntervalMs, maxPollAttempts, onSubmitted, onPoll }) {
  const initialJob = await createVideoJob({ apiKey, requestBody: request });
  onSubmitted?.(initialJob);
  const job = await waitForVideo({
    apiKey,
    initialJob,
    pollIntervalMs,
    maxPollAttempts,
    onPoll,
  });
  const download = await downloadVideo({ apiKey, job, destination: outputPath });
  return { job, download };
}
