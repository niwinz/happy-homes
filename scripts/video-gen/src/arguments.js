import { parseArgs } from "node:util";

const DEFAULTS = {
  duration: 8,
  resolution: "720p",
  aspectRatio: "16:9",
  pollIntervalMs: 30_000,
  maxPollAttempts: 60,
};

const options = {
  help: { type: "boolean", short: "h" },
  "list-models": { type: "boolean" },
  preview: { type: "boolean" },
  json: { type: "boolean" },
  model: { type: "string" },
  prompt: { type: "string" },
  "prompt-file": { type: "string" },
  "first-frame": { type: "string" },
  "last-frame": { type: "string" },
  reference: { type: "string", multiple: true },
  duration: { type: "string" },
  resolution: { type: "string" },
  "aspect-ratio": { type: "string" },
  input: { type: "string" },
  audio: { type: "boolean" },
  seed: { type: "string" },
  output: { type: "string" },
  yes: { type: "boolean", short: "y" },
  "poll-interval": { type: "string" },
  "max-poll-attempts": { type: "string" },
};

export class UsageError extends Error {
  constructor(message) {
    super(message);
    this.name = "UsageError";
  }
}

function parseInteger(name, rawValue, { fallback, min = 0 } = {}) {
  if (rawValue === undefined) return fallback;
  const value = Number(rawValue);
  if (!Number.isInteger(value) || value < min) {
    throw new UsageError(`${name} must be an integer greater than or equal to ${min}.`);
  }
  return value;
}

function nonEmpty(name, value) {
  if (value === undefined) return undefined;
  const normalized = value.trim();
  if (!normalized) throw new UsageError(`${name} cannot be empty.`);
  return normalized;
}

function assertListOptions(values) {
  const generationOnly = [
    "model", "prompt", "prompt-file", "first-frame", "last-frame",
    "reference", "audio", "seed", "output", "yes", "poll-interval",
    "max-poll-attempts",
  ];
  const invalid = generationOnly.filter((name) => values[name] !== undefined);
  if (invalid.length > 0) {
    throw new UsageError(`--list-models cannot be combined with --${invalid[0]}.`);
  }
}

function assertGenerationOptions(values) {
  if (!values.model?.trim()) {
    throw new UsageError("--model is required for preview and generation.");
  }
  if (values.prompt !== undefined && values["prompt-file"] !== undefined) {
    throw new UsageError("Use either --prompt or --prompt-file, not both.");
  }
  if (values.prompt === undefined && values["prompt-file"] === undefined) {
    throw new UsageError("--prompt or --prompt-file is required.");
  }
  if ((values["first-frame"] || values["last-frame"]) && values.reference?.length) {
    throw new UsageError("Frame images cannot be combined with --reference in this CLI.");
  }
  if (!values.preview && !values.output?.trim()) {
    throw new UsageError("--output is required for generation.");
  }
  if (values.preview && values.yes) {
    throw new UsageError("--yes is only valid for generation.");
  }
  if (values.input !== undefined || values.json !== undefined) {
    throw new UsageError("--input and --json are only valid with --list-models.");
  }
}

export function parseCliArguments(argv) {
  const normalizedArgv = argv[0] === "--" ? argv.slice(1) : argv;
  let values;
  try {
    ({ values } = parseArgs({
      args: normalizedArgv,
      options,
      strict: true,
      allowPositionals: false,
      allowNegative: true,
    }));
  } catch (error) {
    throw new UsageError(error.message);
  }

  if (values.help) return { mode: "help" };
  if (values["list-models"] && values.preview) {
    throw new UsageError("--list-models and --preview are mutually exclusive.");
  }

  const mode = values["list-models"] ? "list" : values.preview ? "preview" : "generate";
  if (mode === "list") assertListOptions(values);
  else assertGenerationOptions(values);

  const listInput = nonEmpty("--input", values.input);
  if (listInput && !["text", "first-frame", "last-frame", "reference"].includes(listInput)) {
    throw new UsageError("--input must be text, first-frame, last-frame, or reference.");
  }

  const generationMode = mode !== "list";
  return {
    mode,
    json: values.json ?? false,
    model: nonEmpty("--model", values.model),
    prompt: nonEmpty("--prompt", values.prompt),
    promptFile: nonEmpty("--prompt-file", values["prompt-file"]),
    firstFrame: nonEmpty("--first-frame", values["first-frame"]),
    lastFrame: nonEmpty("--last-frame", values["last-frame"]),
    references: (values.reference || []).map((value) => nonEmpty("--reference", value)),
    duration: parseInteger("--duration", values.duration, {
      fallback: generationMode ? DEFAULTS.duration : undefined,
      min: 1,
    }),
    resolution: nonEmpty("--resolution", values.resolution) || (generationMode ? DEFAULTS.resolution : undefined),
    aspectRatio: nonEmpty("--aspect-ratio", values["aspect-ratio"]) || (generationMode ? DEFAULTS.aspectRatio : undefined),
    input: listInput,
    generateAudio: values.audio ?? false,
    seed: parseInteger("--seed", values.seed, { min: 0 }),
    output: nonEmpty("--output", values.output),
    yes: values.yes ?? false,
    pollIntervalMs: parseInteger("--poll-interval", values["poll-interval"], {
      fallback: DEFAULTS.pollIntervalMs,
      min: 1_000,
    }),
    maxPollAttempts: parseInteger("--max-poll-attempts", values["max-poll-attempts"], {
      fallback: DEFAULTS.maxPollAttempts,
      min: 1,
    }),
  };
}

export function getHelpText() {
  return `HappyHomes OpenRouter video CLI

Usage:
  pnpm --filter @happy-homes/video-gen cli -- [options]

Modes:
  --list-models              List video models and exit
  --preview                  Validate and print the request without submitting it
  (no mode flag)             Submit a generation job and download the result

Required for preview and generation:
  --model <id>               Explicit OpenRouter model ID
  --prompt <text>            Inline generation prompt
  --prompt-file <path>       Read the prompt from a UTF-8 file

Generation settings:
  --duration <seconds>       Clip duration (default: 8)
  --resolution <value>       Output resolution (default: 720p)
  --aspect-ratio <ratio>     Output aspect ratio (default: 16:9)
  --audio / --no-audio       Enable or disable generated audio (default: disabled)
  --seed <integer>           Optional deterministic seed

Image inputs (local path or HTTPS URL):
  --first-frame <value>      Exact first frame
  --last-frame <value>       Exact last frame
  --reference <value>        Style/content reference; may be repeated

  Frame images and reference images cannot be mixed in this version.

Output and execution:
  --output <directory>       Output directory; required for generation
  --yes, -y                  Skip the interactive paid-request confirmation
  --poll-interval <ms>       Poll interval (default: 30000, minimum: 1000)
  --max-poll-attempts <n>    Poll limit (default: 60)

Model listing filters:
  --duration <seconds>
  --resolution <value>
  --aspect-ratio <ratio>
  --input <type>             text, first-frame, last-frame, or reference;
                             text/reference filtering is best-effort
  --json                     Print the filtered model records as JSON

General:
  --help, -h                 Show this help

Environment:
  OPENROUTER_API_KEY         Required only for generation. The CLI loads an
                             optional .env from this package or the repository root.

Paths:
  Relative local paths are resolved from the repository root.

Examples:
  pnpm --filter @happy-homes/video-gen cli -- --list-models --duration 8 --input first-frame

  pnpm --filter @happy-homes/video-gen cli -- --preview \\
    --model google/veo-3.1-lite --prompt-file ./prompt.txt \\
    --first-frame ./reference.jpg --duration 8 --no-audio

  pnpm --filter @happy-homes/video-gen cli -- \\
    --model google/veo-3.1-lite --prompt-file ./prompt.txt \\
    --first-frame ./reference.jpg --duration 8 --no-audio \\
    --output ./scripts/video-gen/outputs/hero-v1

Preview may perform a read-only model-catalog request, but it never submits a
video job and never consumes generation credit.`;
}
