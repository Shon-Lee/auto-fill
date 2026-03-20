import fs from "fs";
import PizZip from "pizzip";

const templatePath = "public/templates/uy_quyen.docx";
const backupPath = "public/templates/uy_quyen.docx.bak";

// Backup original
if (!fs.existsSync(backupPath)) {
  fs.copyFileSync(templatePath, backupPath);
  console.log("Backup created");
}

let content = fs.readFileSync(templatePath, "binary");
const zip = new PizZip(content);
let xml = zip.files["word/document.xml"].asText();

console.log("Original template loaded");

// Fix 1: Replace hardcoded "04 bản đồ địa chính xã Xuân P cũ" with tags
// Original: "(tờ bản đồ số 04 bản đồ địa chính xã Xuân P cũ)"
// New: "(tờ bản đồ số {to_ban_do_so} bản đồ địa chính xã {xa_ban_do_txt} cũ)"
xml = xml.replace(
  /tờ bản đồ số\s+04\s+bản đồ địa chính xã\s+Xuân P\s+cũ/g,
  "tờ bản đồ số {to_ban_do_so} bản đồ địa chính xã {xa_ban_do_txt} cũ"
);
console.log("✓ Fixed map reference");

// Fix 2: Replace hardcoded "2025" with tag
// Original: "bản đồ địa chính xã chỉnh lý năm 2025"
// New: "bản đồ địa chính xã chỉnh lý năm {nam_ban_do}"
xml = xml.replace(
  /bản đồ địa chính xã\s+chỉnh lý\s+năm\s+2025/g,
  "bản đồ địa chính xã chỉnh lý năm {nam_ban_do}"
);
console.log("✓ Fixed year field");

// Fix 3: Replace hardcoded "270" with tag
// Original: "diện tích 270 m2"
// New: "diện tích {dien_tich} m2"
xml = xml.replace(
  /diện tích\s+270\s+m2/g,
  "diện tích {dien_tich} m2"
);
console.log("✓ Fixed area field");

// Fix 4: Replace hardcoded "ONT" with tag
// Original: "loại đất (ONT)"
// New: "loại đất ({loai_dat})"
xml = xml.replace(
  /loại đất\s+\(\s*ONT\s*\)/g,
  "loại đất ({loai_dat})"
);
console.log("✓ Fixed land type field");

// Fix 5: Add ben_b_dia_chi tag after ben_b_ngay_cap
// Look for pattern: ben_b_ngay_cap followed by next section
// We need to insert ben_b_dia_chi in the Ben B section
// Pattern: Bên B info ending with cấp ngày, then we add address
xml = xml.replace(
  /({ben_b_ngay_cap}[\s\S]*?)\. (Nơi thường trú:|Bên A uỷ quyền)/,
  "$1. Nơi thường trú: {ben_b_dia_chi}.\n$2"
);
console.log("✓ Added Ben B address tag");

// Write back
zip.files["word/document.xml"].binary = true;
zip.file("word/document.xml", xml, { binary: true });

const newContent = zip.generate({ type: "nodebuffer" });
fs.writeFileSync(templatePath, newContent);

console.log("\n✅ Template updated successfully!");
console.log("New tags added:");
console.log("  {ben_b_dia_chi} - Ben B's address");
console.log("  {xa_ban_do_txt} - Xã in map reference");
console.log("  {nam_ban_do} - Year in map reference");
console.log("  {dien_tich} - Land area");
console.log("  {loai_dat} - Land type");
