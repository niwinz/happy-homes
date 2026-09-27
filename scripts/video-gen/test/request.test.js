import assert from "node:assert/strict";
import test from "node:test";

import { buildRequest, redactRequest } from "../src/request.js";

test("builds and redacts a first-frame request", () => {
  const request = buildRequest({
    options: {
      model: "example/video",
      duration: 8,
      resolution: "720p",
      aspectRatio: "16:9",
      generateAudio: false,
      seed: undefined,
    },
    prompt: "A calm house",
    referenceInputs: {
      firstFrame: { url: "data:image/jpeg;base64,c2VjcmV0" },
      lastFrame: undefined,
      references: [],
    },
  });
  assert.equal(request.frame_images[0].frame_type, "first_frame");
  assert.equal(redactRequest(request).frame_images[0].image_url.url, "<inline image/jpeg>");
  assert.match(request.frame_images[0].image_url.url, /c2VjcmV0/);
});

test("removes query strings from remote references in previews", () => {
  const request = {
    input_references: [{
      type: "image_url",
      image_url: { url: "https://example.com/image.jpg?token=secret" },
    }],
  };
  assert.equal(
    redactRequest(request).input_references[0].image_url.url,
    "https://example.com/image.jpg",
  );
});
