import fs from "fs";
import PizZip from "pizzip";

const templatePath = "public/templates/uy_quyen.docx";
const backupPath = "public/templates/uy_quyen.docx.bak";

// Restore from backup to start fresh
const backupContent = fs.readFileSync(backupPath, "binary");
const zip = new PizZip(backupContent);
let xml = zip.files["word/document.xml"].asText();

console.log("Starting fresh from backup...\n");

// Strategy: Replace text within <w:t>...</w:t> tags, handling fragments
// These will be split across multiple tags, so we need regex that matches within tags

// Fix 1: In red text - "loại đất (ONT" -> "loại đất ({loai_dat}"
// Find <w:t> tag containing " loại đất (ONT" and replace
xml = xml.replace(
  /<w:t([^>]*)>\s*loại\s+đất\s+\(\s*ONT\s*<\/w:t>/gi,
  '<w:t$1> loại đất ({loai_dat}</w:t>'
);
console.log("✓ Fixed: loại đất (ONT) -> ({loai_dat})");

// Fix 2: "270" (area) inside <w:t> tags
// Original: "270 m" is split: "270" in one <w:t>, then " m" in another
// Replace the actual "270" with "{dien_tich}"
xml = xml.replace(
  /(<w:t[^>]*>)\s*270\s*(<\/w:t>)/g,
  '$1{dien_tich}$2'
);
console.log("✓ Fixed: 270 -> {dien_tich}");

// Fix 3: "2025" (year) in the map reference
// Pattern: "năm 2025" -> "năm {nam_ban_do}"
xml = xml.replace(
  /(<w:t[^>]*>)năm\s+2025\s*(<\/w:t>)/g,
  '$1năm {nam_ban_do}$2'
);
console.log("✓ Fixed: năm 2025 -> năm {nam_ban_do}");

// Fix 4: "04" (sheet number) - this is trickier as it's fragmented
// Look for: "tờ bản đồ số" followed by space/tags, then "04"
// Replace "<w:t> 04" with "<w:t> {to_ban_do_so}"
xml = xml.replace(
  /(<w:t[^>]*>)\s+04\s+(<\/w:t>)/g,
  '$1 {to_ban_do_so} $2'
).replace(
  /(<w:t[^>]*>)\s+04\s*bản đồ địa chính xã/g,
  '$1 {to_ban_do_so} bản đồ địa chính xã'
);
console.log("✓ Fixed: 04 -> {to_ban_do_so}");

// Fix 5: "Xuân P" in the xã name - replace with tag
// Pattern: "Xuân P cũ" -> "{xa_ban_do_txt} cũ"
xml = xml.replace(
  /(<w:t[^>]*>)Xuân P\s*(<\/w:t>)/g,
  '$1{xa_ban_do_txt}$2'
).replace(
  /xã\s+Xuân P\s+cũ/g,
  'xã {xa_ban_do_txt} cũ'
);
console.log("✓ Fixed: Xuân P -> {xa_ban_do_txt}");

// Fix 6: Add Ben B's address - look for ben_b_ngay_cap and add address after it
// Pattern: {ben_b_ngay_cap}. and insert address field before the period
xml = xml.replace(
  /({ben_b_ngay_cap})\.\s*(?=Bên A|BÊN A|ĐIỀU)/g,
  '$1. Nơi thường trú: {ben_b_dia_chi}.\n'
);
console.log("✓ Added: Ben B address field after {ben_b_ngay_cap}");

// Write back
zip.files["word/document.xml"].binary = true;
zip.file("word/document.xml", xml, { binary: true });

const newContent = zip.generate({ type: "nodebuffer" });
fs.writeFileSync(templatePath, newContent);

console.log("\n✅ Template patched!");
console.log("\nChanges made:");
console.log("  - Replaced hardcoded '04' with {to_ban_do_so}");
console.log("  - Replaced hardcoded '270' with {dien_tich}");
console.log("  - Replaced hardcoded '2025' with {nam_ban_do}");
console.log("  - Replaced hardcoded 'Xuân P' with {xa_ban_do_txt}");
console.log("  - Replaced hardcoded 'ONT' with {loai_dat}");
console.log("  - Added Ben B address field: {ben_b_dia_chi}");
