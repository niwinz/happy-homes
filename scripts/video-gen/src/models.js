function supportsValue(values, requested) {
  return requested === undefined || (Array.isArray(values) && values.includes(requested));
}

function supportsInput(model, input) {
  if (!input) return true;
  if (input === "first-frame") return model.supported_frame_images?.includes("first_frame") ?? false;
  if (input === "last-frame") return model.supported_frame_images?.includes("last_frame") ?? false;

  // OpenRouter currently exposes no normalized text/reference capability.
  // Descriptions are therefore only a discovery aid, never final validation.
  const description = model.description || "";
  if (input === "text") {
    return /text[- ]to[- ]video|from text(?: or image)? prompts?|text prompts? as input/i.test(description);
  }
  return /reference[- ](?:to[- ]video|image|guided|conditioned)|reference images?/i.test(description);
}

export function filterModels(models, filters) {
  return models.filter((model) =>
    supportsValue(model.supported_durations, filters.duration) &&
    supportsValue(model.supported_resolutions, filters.resolution) &&
    supportsValue(model.supported_aspect_ratios, filters.aspectRatio) &&
    supportsInput(model, filters.input));
}

export function findAndValidateModel(models, modelId, requirements) {
  const model = models.find(({ id }) => id === modelId);
  if (!model) throw new Error(`OpenRouter video model not found: ${modelId}`);

  const checks = [
    ["duration", model.supported_durations, requirements.duration],
    ["resolution", model.supported_resolutions, requirements.resolution],
    ["aspect ratio", model.supported_aspect_ratios, requirements.aspectRatio],
  ];
  for (const [label, supported, requested] of checks) {
    if (Array.isArray(supported) && !supported.includes(requested)) {
      throw new Error(`${modelId} does not support ${label} ${requested}. Supported values: ${supported.join(", ")}.`);
    }
  }

  if (requirements.firstFrame && !model.supported_frame_images?.includes("first_frame")) {
    throw new Error(`${modelId} does not advertise first-frame support.`);
  }
  if (requirements.lastFrame && !model.supported_frame_images?.includes("last_frame")) {
    throw new Error(`${modelId} does not advertise last-frame support.`);
  }
  if (requirements.generateAudio && model.generate_audio === false) {
    throw new Error(`${modelId} does not advertise generated-audio support.`);
  }
  if (requirements.seed !== undefined && model.seed === false) {
    throw new Error(`${modelId} does not advertise seed support.`);
  }

  const warnings = [];
  if (requirements.references?.length) {
    warnings.push("OpenRouter does not expose normalized reference-image support; confirm this model's documentation before generation.");
  }
  if (requirements.generateAudio && model.generate_audio == null) {
    warnings.push("The model catalog does not confirm generated-audio support.");
  }
  if (requirements.seed !== undefined && model.seed == null) {
    warnings.push("The model catalog does not confirm seed support.");
  }
  return { model, warnings };
}

function formatList(values) {
  return Array.isArray(values) && values.length > 0 ? values.join(", ") : "n/a";
}

export function toModelTable(models) {
  return models.map((model) => ({
    id: model.id,
    durations: formatList(model.supported_durations),
    resolutions: formatList(model.supported_resolutions),
    aspectRatios: formatList(model.supported_aspect_ratios),
    frameImages: formatList(model.supported_frame_images),
    audio: model.generate_audio == null ? "unknown" : model.generate_audio ? "yes" : "no",
    pricing: JSON.stringify(model.pricing_skus || {}),
  }));
}
