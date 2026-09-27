import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

async function assertMissing(filePath) {
  try {
    await access(filePath);
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }
  throw new Error(`Refusing to overwrite existing output: ${filePath}`);
}

export async function prepareOutputDirectory(outputValue, workspaceRoot, { generation }) {
  const directory = path.resolve(workspaceRoot, outputValue);
  const paths = {
    directory,
    request: path.join(directory, "request.json"),
    video: path.join(directory, "video.mp4"),
    result: path.join(directory, "result.json"),
  };
  await mkdir(directory, { recursive: true });
  await assertMissing(paths.request);
  if (generation) {
    await Promise.all([assertMissing(paths.video), assertMissing(paths.result)]);
  }
  return paths;
}

export function writeJson(filePath, value) {
  return writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
}

export function buildResultMetadata({ job, download }) {
  return {
    job: {
      id: job.id,
      generation_id: job.generation_id,
      status: job.status,
      model: job.model,
      usage: job.usage,
    },
    download: { bytes: download.bytes },
  };
}
