# Video generation CLI guide

This directory is the `@happy-homes/video-gen` workspace package. It provides a
single CLI entrypoint at `src/cli.js`; do not add standalone executable scripts
outside `src/` or additional package scripts.

## Commands

Run every command from the repository root:

```sh
pnpm --filter @happy-homes/video-gen cli -- --help
pnpm --filter @happy-homes/video-gen cli -- --list-models
pnpm --filter @happy-homes/video-gen cli -- --preview [options]
pnpm --filter @happy-homes/video-gen cli -- [generation options]
```

`--preview` may fetch the model catalog but must never submit a video job. Only
the default generation mode may send `POST /videos`, and it must require an
explicit model plus interactive confirmation or `--yes`.

## Invariants

- Use Node 24 built-ins; keep this package dependency-free unless a dependency
  has a clear benefit that cannot reasonably be implemented with the standard
  library.
- Read `OPENROUTER_API_KEY` only from the process environment or an ignored
  `.env`; never accept it as a command-line argument.
- Treat the current OpenRouter video API documentation and
  `GET /api/v1/videos/models` as the capability sources of truth.
- Never infer that pricing values with different SKU names use the same unit.
- Never persist API keys, inline base64 image data, query strings from reference
  URLs, polling URLs, or temporary download URLs.
- Keep local input paths and output paths relative to the repository root unless
  the user supplies an absolute path.
- Validate inputs before any paid request. Keep downloads atomic through a
  `.part` file and do not overwrite existing output artifacts.
- Tests must mock network operations and must never consume OpenRouter credit.

## Verification

```sh
node --test scripts/video-gen/test/*.test.js
pnpm --filter @happy-homes/video-gen cli -- --help
pnpm --filter @happy-homes/video-gen cli -- --list-models --duration 8 --resolution 720p --aspect-ratio 16:9 --input first-frame
```

Do not use generation mode as a verification step.
