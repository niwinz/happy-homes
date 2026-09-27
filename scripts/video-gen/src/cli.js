#!/usr/bin/env node

import { parseCliArguments, getHelpText, UsageError } from "./arguments.js";
import { getApiKey, loadEnvironment, WORKSPACE_ROOT } from "./config.js";
import { confirmGeneration, runGeneration } from "./generation.js";
import { filterModels, findAndValidateModel, toModelTable } from "./models.js";
import { listVideoModels } from "./openrouter.js";
import { buildResultMetadata, prepareOutputDirectory, writeJson } from "./output.js";
import { loadReferenceInputs } from "./references.js";
import { buildRequest, redactRequest, resolvePrompt } from "./request.js";

function printRequestSummary({ options, model, sources, warnings, safeRequest }) {
  console.log(`Mode: ${options.mode}`);
  console.log(`Model: ${model.id}`);
  console.log(`Duration: ${options.duration}s`);
  console.log(`Resolution: ${options.resolution}`);
  console.log(`Aspect ratio: ${options.aspectRatio}`);
  console.log(`Generated audio: ${options.generateAudio ? "yes" : "no"}`);
  console.log(`References: ${sources.length ? sources.map(({ kind, label }) => `${kind}:${label}`).join(", ") : "none"}`);
  console.log(`Advertised pricing SKUs: ${JSON.stringify(model.pricing_skus || {})}`);
  for (const warning of warnings) console.warn(`Warning: ${warning}`);
  console.log("Request:");
  console.log(JSON.stringify(safeRequest, null, 2));
}

async function run() {
  const options = parseCliArguments(process.argv.slice(2));
  if (options.mode === "help") {
    console.log(getHelpText());
    return;
  }

  const models = await listVideoModels();

  if (options.mode === "list") {
    const filtered = filterModels(models, options);
    if (options.json) console.log(JSON.stringify(filtered, null, 2));
    else {
      console.table(toModelTable(filtered));
      console.log(`${filtered.length} compatible model${filtered.length === 1 ? "" : "s"}.`);
      if (["text", "reference"].includes(options.input)) {
        console.warn(`${options.input} support is inferred from descriptions because the catalog has no normalized capability field.`);
      }
    }
    return;
  }

  const [prompt, referenceInputs] = await Promise.all([
    resolvePrompt(options, WORKSPACE_ROOT),
    loadReferenceInputs(options, WORKSPACE_ROOT),
  ]);
  const { model, warnings } = findAndValidateModel(models, options.model, {
    ...options,
    references: referenceInputs.references,
  });
  const request = buildRequest({ options, prompt, referenceInputs });
  const safeRequest = redactRequest(request);
  printRequestSummary({
    options,
    model,
    sources: referenceInputs.sources,
    warnings,
    safeRequest,
  });

  if (options.mode === "preview") {
    if (options.output) {
      const paths = await prepareOutputDirectory(options.output, WORKSPACE_ROOT, { generation: false });
      await writeJson(paths.request, safeRequest);
      console.log(`Preview saved: ${paths.request}`);
    }
    return;
  }

  await loadEnvironment();
  const generationApiKey = getApiKey({ required: true });
  const confirmed = await confirmGeneration({ skipConfirmation: options.yes });
  if (!confirmed) {
    console.log("Generation cancelled.");
    return;
  }

  const paths = await prepareOutputDirectory(options.output, WORKSPACE_ROOT, { generation: true });
  await writeJson(paths.request, safeRequest);
  const result = await runGeneration({
    apiKey: generationApiKey,
    request,
    outputPath: paths.video,
    pollIntervalMs: options.pollIntervalMs,
    maxPollAttempts: options.maxPollAttempts,
    onSubmitted: (job) => console.log(`Job submitted: ${job.id} (${job.status})`),
    onPoll: ({ attempt, maxPollAttempts, status }) => console.log(`Polling ${attempt}/${maxPollAttempts}: ${status}`),
  });
  await writeJson(paths.result, buildResultMetadata(result));
  console.log(`Video saved: ${paths.video}`);
  console.log(`Metadata saved: ${paths.result}`);
  console.log(`Reported cost: ${result.job.usage?.cost ?? "not provided"}`);
}

try {
  await run();
} catch (error) {
  const prefix = error instanceof UsageError ? "Usage error" : error.name || "Error";
  console.error(`${prefix}: ${error.message}`);
  if (error instanceof UsageError) console.error("Run with --help for usage information.");
  process.exitCode = error instanceof UsageError ? 2 : 1;
}
