import { readFile } from "node:fs/promises";
import path from "node:path";

export async function resolvePrompt({ prompt, promptFile }, workspaceRoot) {
  if (prompt !== undefined) return prompt;
  const filePath = path.resolve(workspaceRoot, promptFile);
  const contents = (await readFile(filePath, "utf8")).trim();
  if (!contents) throw new Error(`Prompt file is empty: ${promptFile}`);
  return contents;
}

export function buildRequest({ options, prompt, referenceInputs }) {
  const frameImages = [];
  if (referenceInputs.firstFrame) {
    frameImages.push({
      type: "image_url",
      image_url: { url: referenceInputs.firstFrame.url },
      frame_type: "first_frame",
    });
  }
  if (referenceInputs.lastFrame) {
    frameImages.push({
      type: "image_url",
      image_url: { url: referenceInputs.lastFrame.url },
      frame_type: "last_frame",
    });
  }

  return {
    model: options.model,
    prompt,
    duration: options.duration,
    resolution: options.resolution,
    aspect_ratio: options.aspectRatio,
    generate_audio: options.generateAudio,
    ...(options.seed === undefined ? {} : { seed: options.seed }),
    ...(frameImages.length === 0 ? {} : { frame_images: frameImages }),
    ...(referenceInputs.references.length === 0 ? {} : {
      input_references: referenceInputs.references.map(({ url }) => ({
        type: "image_url",
        image_url: { url },
      })),
    }),
  };
}

function redactUrl(rawUrl) {
  if (rawUrl.startsWith("data:")) {
    const mimeType = rawUrl.match(/^data:([^;]+);base64,/)?.[1] || "image";
    return `<inline ${mimeType}>`;
  }
  const url = new URL(rawUrl);
  return `${url.origin}${url.pathname}`;
}

export function redactRequest(request) {
  const safeRequest = structuredClone(request);
  const images = [...(safeRequest.frame_images || []), ...(safeRequest.input_references || [])];
  for (const image of images) {
    if (image.image_url?.url) image.image_url.url = redactUrl(image.image_url.url);
  }
  return safeRequest;
}
