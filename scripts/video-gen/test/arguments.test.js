import assert from "node:assert/strict";
import test from "node:test";

import { parseCliArguments, UsageError } from "../src/arguments.js";

test("preview requires an explicit model", () => {
  assert.throws(
    () => parseCliArguments(["--preview", "--prompt", "test"]),
    (error) => error instanceof UsageError && /--model is required/.test(error.message),
  );
});

test("accepts pnpm's forwarded argument separator", () => {
  assert.equal(parseCliArguments(["--", "--help"]).mode, "help");
});

test("generation uses defaults and requires output", () => {
  const options = parseCliArguments([
    "--model", "example/video",
    "--prompt", "A calm house",
    "--output", "outputs/test",
  ]);
  assert.equal(options.mode, "generate");
  assert.equal(options.duration, 8);
  assert.equal(options.resolution, "720p");
  assert.equal(options.aspectRatio, "16:9");
  assert.equal(options.generateAudio, false);
});

test("frame and reference inputs cannot be mixed", () => {
  assert.throws(
    () => parseCliArguments([
      "--preview",
      "--model", "example/video",
      "--prompt", "test",
      "--first-frame", "first.jpg",
      "--reference", "style.jpg",
    ]),
    /cannot be combined/,
  );
});

test("list filters do not receive generation defaults", () => {
  const options = parseCliArguments(["--list-models", "--duration", "8", "--input", "first-frame"]);
  assert.equal(options.mode, "list");
  assert.equal(options.duration, 8);
  assert.equal(options.resolution, undefined);
  assert.equal(options.input, "first-frame");
});
