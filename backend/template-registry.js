import fs from "fs";
import path from "path";
import { templateConfigs } from "../shared/templates.js";

export function getTemplateConfigs() {
  return templateConfigs;
}

export function getTemplateConfig(templateId) {
  const config = templateConfigs[templateId];
  if (!config) {
    throw new Error(`Template khong ton tai: ${templateId}`);
  }
  return config;
}

export function findTemplateDirectory(rootDir) {
  const dirs = fs.readdirSync(rootDir, { withFileTypes: true }).filter((entry) => entry.isDirectory());
  const match = dirs.find((entry) => {
    const full = path.join(rootDir, entry.name);
    return fs.readdirSync(full).some((name) => /\.(doc|docx|xlsx)$/i.test(name));
  });
  if (!match) {
    throw new Error("Khong tim thay thu muc template.");
  }
  return path.join(rootDir, match.name);
}
