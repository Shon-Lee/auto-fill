import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { getTemplateConfig } from "./template-registry.js";

export async function renderTemplate({ rootDir, outputDir, templateId, data }) {
  const config = getTemplateConfig(templateId);
  fs.mkdirSync(outputDir, { recursive: true });

  const payloadPath = path.join(outputDir, `payload-${templateId}.json`);
  fs.writeFileSync(payloadPath, JSON.stringify({ templateId, data }, null, 2), "utf8");

  await runPowerShell(rootDir, [
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    path.join(rootDir, "render_template.ps1"),
    "-RootDir",
    rootDir,
    "-TemplateId",
    templateId,
    "-PayloadPath",
    payloadPath,
    "-OutputDir",
    outputDir
  ]);

  const metaPath = path.join(outputDir, `${templateId}.meta.json`);
  if (!fs.existsSync(metaPath)) {
    throw new Error("Khong tim thay ket qua render.");
  }

  const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
  return {
    ...meta,
    templateTitle: config.title
  };
}

function runPowerShell(cwd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn("powershell", args, { cwd, windowsHide: true });
    let stderr = "";

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(stderr.trim() || `PowerShell exited with code ${code}`));
      }
    });
  });
}
