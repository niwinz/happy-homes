import { execFile } from "node:child_process";
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import os from "node:os";
import path from "node:path";

const execFileAsync = promisify(execFile);

export class ConversionError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConversionError";
  }
}

async function commandExists(command, args = ["--version"]) {
  try {
    await execFileAsync(command, args);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    return true;
  }
}

async function assertOutputAvailable(filePath, overwrite) {
  try {
    await access(filePath);
    if (!overwrite) {
      throw new ConversionError(`Refusing to overwrite ${filePath}. Use --overwrite for generated drafts.`);
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

function latexSafeIdentifier(value) {
  return value.replace(/[^A-Z0-9-]/g, "");
}

export function getOutputPaths(outputDirectory, isDraft, documentType = "agreement") {
  const names = {
    agreement: "agreement",
    "visit-sheet": "visit-sheet",
  };
  const name = names[documentType];
  if (!name) throw new ConversionError(`Unsupported document type: ${documentType}`);
  const suffix = `${name}${isDraft ? "-draft" : ""}`;
  return {
    docx: path.join(outputDirectory, `${suffix}.docx`),
    pdf: path.join(outputDirectory, `${suffix}.pdf`),
  };
}

export async function ensureReferenceDocx(rootDirectory) {
  const packageDirectory = path.join(rootDirectory, "scripts", "contract-gen");
  const referencePath = path.join(packageDirectory, "assets", "reference.docx");
  const builderPath = path.join(packageDirectory, "src", "build-reference-docx.py");
  try {
    await access(referencePath);
    return referencePath;
  } catch {}

  if (!(await commandExists("python3"))) {
    throw new ConversionError("python3 is required to build the DOCX reference file.");
  }
  await mkdir(path.dirname(referencePath), { recursive: true });
  try {
    await execFileAsync("python3", [builderPath, referencePath], { cwd: rootDirectory });
  } catch (error) {
    throw new ConversionError(`Could not build the DOCX reference file: ${error.stderr || error.message}`);
  }
  return referencePath;
}

export async function convertDocument({
  rootDirectory,
  markdown,
  contractId,
  documentType,
  format,
  outputDirectory,
  overwrite,
  isDraft,
}) {
  if (!(await commandExists("pandoc"))) {
    throw new ConversionError("pandoc is required to generate contract documents.");
  }
  if ((format === "pdf" || format === "all") && !(await commandExists("xelatex"))) {
    throw new ConversionError("xelatex is required to generate PDF documents.");
  }

  await mkdir(outputDirectory, { recursive: true });
  const { docx: docxPath, pdf: pdfPath } = getOutputPaths(
    outputDirectory,
    isDraft,
    documentType,
  );
  const requested = [];
  if (format === "docx" || format === "all") requested.push(docxPath);
  if (format === "pdf" || format === "all") requested.push(pdfPath);
  for (const filePath of requested) await assertOutputAvailable(filePath, overwrite);

  const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "happy-homes-contract-gen-"));
  const markdownPath = path.join(temporaryDirectory, "agreement.md");
  const outputs = {};
  await writeFile(markdownPath, markdown, "utf8");

  try {
    const packageDirectory = path.join(rootDirectory, "scripts", "contract-gen");
    const tableFilterPath = path.join(packageDirectory, "assets", "table-widths.lua");
    if (format === "docx" || format === "all") {
      const referencePath = await ensureReferenceDocx(rootDirectory);
      await execFileAsync("pandoc", [
        markdownPath,
        "--from=gfm+smart",
        "--to=docx",
        `--lua-filter=${tableFilterPath}`,
        `--reference-doc=${referencePath}`,
        "--metadata=lang:es-ES",
        `--output=${docxPath}`,
      ], { cwd: rootDirectory });
      outputs.docx = docxPath;
    }

    if (format === "pdf" || format === "all") {
      const headerTemplate = await readFile(path.join(packageDirectory, "assets", "pdf-header.tex"), "utf8");
      const headerPath = path.join(temporaryDirectory, "header.tex");
      const header = headerTemplate
        .replaceAll("__AGREEMENT_ID__", latexSafeIdentifier(contractId))
        .replaceAll("__DOCUMENT_STATUS__", isDraft ? "Borrador · " : "")
        .replaceAll(
          "__DOCUMENT_LABEL__",
          documentType === "visit-sheet" ? "Ficha operativa de visita" : "Acuerdo de servicio",
        )
        .replaceAll(
          "__PDF_TITLE__",
          documentType === "visit-sheet" ? "Ficha operativa" : "Acuerdo",
        );
      await writeFile(headerPath, header, "utf8");
      await execFileAsync("pandoc", [
        markdownPath,
        "--from=gfm+smart",
        "--pdf-engine=xelatex",
        `--lua-filter=${tableFilterPath}`,
        "--variable=papersize:a4",
        "--variable=fontsize:10pt",
        "--variable=fontfamily:fontspec",
        "--variable=mainfont:Inter",
        "--variable=sansfont:Inter",
        "--variable=geometry:top=22mm",
        "--variable=geometry:bottom=20mm",
        "--variable=geometry:left=19mm",
        "--variable=geometry:right=19mm",
        "--variable=colorlinks:true",
        "--variable=linkcolor:HappyPetrol",
        "--variable=urlcolor:HappyAccentText",
        `--include-in-header=${headerPath}`,
        `--output=${pdfPath}`,
      ], { cwd: rootDirectory, maxBuffer: 10 * 1024 * 1024 });
      outputs.pdf = pdfPath;
    }
  } catch (error) {
    if (error instanceof ConversionError) throw error;
    throw new ConversionError(`Document generation failed: ${error.stderr || error.message}`);
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }

  return outputs;
}
