import assert from "node:assert/strict";
import test from "node:test";

import { filterModels, findAndValidateModel } from "../src/models.js";

const models = [{
  id: "example/video",
  description: "Image-to-video with reference images.",
  supported_durations: [4, 8],
  supported_resolutions: ["720p"],
  supported_aspect_ratios: ["16:9"],
  supported_frame_images: ["first_frame"],
  generate_audio: false,
  seed: true,
}];

test("filters models by normalized capabilities", () => {
  assert.equal(filterModels(models, {
    duration: 8,
    resolution: "720p",
    aspectRatio: "16:9",
    input: "first-frame",
  }).length, 1);
  assert.equal(filterModels(models, { duration: 10 }).length, 0);
  assert.equal(filterModels(models, { input: "text" }).length, 0);
  assert.equal(filterModels(models, { input: "reference" }).length, 1);
});

test("validates an explicit model", () => {
  const result = findAndValidateModel(models, "example/video", {
    duration: 8,
    resolution: "720p",
    aspectRatio: "16:9",
    firstFrame: true,
    references: [],
    generateAudio: false,
  });
  assert.equal(result.model.id, "example/video");
});

test("rejects unsupported audio", () => {
  assert.throws(() => findAndValidateModel(models, "example/video", {
    duration: 8,
    resolution: "720p",
    aspectRatio: "16:9",
    references: [],
    generateAudio: true,
  }), /does not advertise generated-audio support/);
});
