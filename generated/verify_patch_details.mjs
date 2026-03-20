import fs from "fs";
import PizZip from "pizzip";

const templatePath = "public/templates/uy_quyen.docx";
const content = fs.readFileSync(templatePath, "binary");
const zip = new PizZip(content);
const xml = zip.files["word/document.xml"].asText();

// Look for specific text patterns we tried to replace
console.log("=== CHECKING FOR REPLACED TEXT ===\n");

const checks = [
  { pattern: "ben_b_dia_chi", description: "Ben B address tag" },
  { pattern: "xa_ban_do_txt", description: "Xã in map field" },
  { pattern: "dien_tich", description: "Area field" },
  { pattern: "loai_dat", description: "Land type field" },
  { pattern: "nam_ban_do", description: "Year in map field" },
  { pattern: "2025", description: "Hardcoded year (should be gone)" },
  { pattern: "270", description: "Hardcoded area (should be gone)" },
  { pattern: "ONT", description: "Hardcoded land type (should be gone)" }
];

checks.forEach(check => {
  const found = xml.includes(check.pattern);
  const count = (xml.match(new RegExp(check.pattern, 'g')) || []).length;
  const status = found ? `✓ Found (${count}x)` : `✗ NOT FOUND`;
  console.log(`${status.padEnd(20)} ${check.description}: ${check.pattern}`);
});

// Look for the actual text around these areas in the template
console.log("\n=== CONTEXT AROUND MAP REFERENCE ===");
const mapIdx = xml.indexOf("thua_dat_so");
if (mapIdx >= 0) {
  const start = Math.max(0, mapIdx - 300);
  const end = Math.min(xml.length, mapIdx + 500);
  const context = xml.substring(start, end);
  console.log(context);
}
