import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import mienGiam from "../src/schemas/mien_giam.js";
import thuaKe from "../src/schemas/thua_ke.js";
import uyQuyen from "../src/schemas/uy_quyen.js";
import bienDong from "../src/schemas/bien_dong.js";

const templatesDir = "e:/Tool/public/templates";

const config = {
  mien_giam: { file: "mien_giam.docx", schema: mienGiam },
  thua_ke: { file: "thua_ke.docx", schema: thuaKe },
  uy_quyen: { file: "uy_quyen.docx", schema: uyQuyen },
  bien_dong: { file: "bien_dong.docx", schema: bienDong }
};

function collectKeys(schema) {
  const primitiveKeys = [];
  const arrayGroups = [];
  for (const [key, value] of Object.entries(schema)) {
    if (Array.isArray(value)) {
      const sample = value[0] || {};
      arrayGroups.push({ group: key, keys: Object.keys(sample) });
    } else {
      primitiveKeys.push(key);
    }
  }
  return { primitiveKeys, arrayGroups };
}

function getTemplateText(filePath) {
  const content = fs.readFileSync(filePath);
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
  return doc.getFullText() || "";
}

function hasTag(text, key) {
  return text.includes(`{${key}}`) || text.includes(`{{${key}}}`);
}

const lines = [];
lines.push("# Template Inspection Report");
lines.push("");
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push("");

let allPass = true;
for (const [id, item] of Object.entries(config)) {
  const filePath = path.join(templatesDir, item.file);
  lines.push(`## ${id}`);
  lines.push(`- Expected file: ${item.file}`);

  if (!fs.existsSync(filePath)) {
    allPass = false;
    lines.push("- Status: FAIL (missing file)");
    lines.push("");
    continue;
  }

  let text = "";
  try {
    text = getTemplateText(filePath);
  } catch (error) {
    allPass = false;
    lines.push(`- Status: FAIL (cannot parse docx: ${error.message})`);
    lines.push("");
    continue;
  }

  const { primitiveKeys, arrayGroups } = collectKeys(item.schema);
  const missingPrimitive = primitiveKeys.filter((key) => !hasTag(text, key));
  const arrayIssues = [];

  for (const group of arrayGroups) {
    const hasOpen = text.includes(`{#${group.group}}`) || text.includes(`{% for`);
    const hasClose = text.includes(`{/${group.group}}`) || text.includes(`{% endfor %}`);
    const missingChildren = group.keys.filter((key) => !hasTag(text, key) && !text.includes(`.${key}`));
    if (!hasOpen || !hasClose || missingChildren.length) {
      arrayIssues.push({ group: group.group, hasOpen, hasClose, missingChildren });
    }
  }

  const pass = missingPrimitive.length === 0 && arrayIssues.length === 0;
  if (!pass) {
    allPass = false;
  }

  lines.push(`- Status: ${pass ? "PASS" : "FAIL"}`);
  lines.push(`- Primitive tags missing: ${missingPrimitive.length ? missingPrimitive.join(", ") : "none"}`);
  if (arrayGroups.length) {
    if (!arrayIssues.length) {
      lines.push("- Array/loop tags: pass");
    } else {
      for (const issue of arrayIssues) {
        lines.push(`- Array issue ${issue.group}: open=${issue.hasOpen}, close=${issue.hasClose}, missing=${issue.missingChildren.length ? issue.missingChildren.join(", ") : "none"}`);
      }
    }
  }

  const sampleMatches = (text.match(/\{[^\}]+\}/g) || []).slice(0, 12);
  lines.push(`- Found tag-like snippets: ${sampleMatches.length ? sampleMatches.join(" | ") : "none"}`);
  lines.push("");
}

const legacyUyQuyenDoc = path.join("e:/Tool/thừa kế", "Hợp đồng uỷ quyền.doc");
if (fs.existsSync(legacyUyQuyenDoc)) {
  lines.push("## Legacy note");
  lines.push("- Found source file Hợp đồng uỷ quyền.doc in thừa kế/ (DOC format).");
  lines.push("- Action required: open in Word and Save As uy_quyen.docx, then place into public/templates/.");
  lines.push("");
}

lines.push(`Overall: ${allPass ? "PASS" : "FAIL"}`);

const out = path.join(templatesDir, "INSPECT_REPORT.md");
fs.writeFileSync(out, lines.join("\n"), "utf8");
console.log(`Wrote report: ${out}`);
