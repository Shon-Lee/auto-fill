import fs from "fs";
import PizZip from "pizzip";

const templatePath = "public/templates/uy_quyen.docx";
const backupPath = "public/templates/uy_quyen.docx.bak";

// Restore from backup
const backupContent = fs.readFileSync(backupPath, "binary");
const zip = new PizZip(backupContent);
let xml = zip.files["word/document.xml"].asText();

console.log("Starting fresh - simplified field approach...\n");

// Fix 1: Replace entire map reference with single field
// Original: "(tờ bản đồ số 04 bản đồ địa chính xã Xuân P cũ) bản đồ địa chính xã chỉnh lý năm 2025"
// New: "{to_ban_do_info}"
xml = xml.replace(
  /\(\s*tờ\s+bản\s+đồ\s+số\s+04\s+bản\s+đồ\s+địa\s+chính\s+xã\s+Xuân P\s+cũ\s*\)\s+bản\s+đồ\s+địa\s+chính\s+xã\s+chỉnh\s+lý\s+năm\s+2025/gi,
  "{to_ban_do_info}"
);
console.log("✓ Map reference: (tờ bản đồ số ...) -> {to_ban_do_info}");

// Fix 2: Replace entire area/land type with single field  
// Original: "diện tích 270 m2 loại đất (ONT)"
// New: "{dien_tich_loai_dat}"
xml = xml.replace(
  /diện\s+tích\s+270\s+m2\s+loại\s+đất\s+\(\s*ONT\s*\)/gi,
  "{dien_tich_loai_dat}"
);
console.log("✓ Area/land type: diện tích 270 m2 loại đất (ONT) -> {dien_tich_loai_dat}");

// Fix 3: Add Ben B's address field
// Look for pattern after ben_b_ngay_cap
xml = xml.replace(
  /({ben_b_ngay_cap}\s*)\.\s*(?=Bên|BÊN|ĐIỀU)/g,
  '$1. Nơi thường trú: {ben_b_dia_chi}. '
);
console.log("✓ Ben B address: {ben_b_dia_chi}");

// Write back
zip.files["word/document.xml"].binary = true;
zip.file("word/document.xml", xml, { binary: true });

const newContent = zip.generate({ type: "nodebuffer" });
fs.writeFileSync(templatePath, newContent);

console.log("\n✅ Template simplified!");
console.log("\nNew single-field approach:");
console.log("  {to_ban_do_info} - tờ bản đồ số / năm / xã");
console.log("  {dien_tich_loai_dat} - diện tích + loại đất");
console.log("  {ben_b_dia_chi} - Bên B's address");
