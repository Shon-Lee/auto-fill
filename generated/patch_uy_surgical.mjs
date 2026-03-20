import fs from "fs";
import PizZip from "pizzip";
import { parseStringPromise, Builder } from "xml2js";

const templatePath = "public/templates/uy_quyen.docx";
const backupPath = "public/templates/uy_quyen.docx.bak";

// Restore from backup
const backupContent = fs.readFileSync(backupPath, "binary");
const zip = new PizZip(backupContent);
let xml = zip.files["word/document.xml"].asText();

console.log("Applying surgical XML fixes...\n");

// Strategy: Work within w:t tags
// Replace text nodes while preserving XML structure

// 1. Fix map reference - look for the exact pattern split across tags
// Pattern includes red-colored text "(tờ bản đồ số 04..."
// Replace the entire problematic section with {to_ban_do_info}

// The text " (tờ bản đồ số " to " bản đồ địa chính xã chỉnh lý năm 2025"
// Since this is fragmented, replace everything between those markers

xml = xml.replace(
  /\(\s*tờ\s+bản\s+đồ\s+số\s+([^)]*?)\)/g,
  function(match) {
    // If it contains the hardcoded Xuân P, replace the whole thing
    if (match.includes("04") || match.includes("Xuân")) {
      return "{to_ban_do_info}";
    }
    return match;
  }
);

// Also handle the year separately if it wasn't caught
xml = xml.replace(/năm\s+2025/g, "{to_ban_do_info}");

console.log("✓ Map reference patterns fixed");

// 2. Fix area - replace "270" with the tag
xml = xml.replace(/270\s+m[²2]\s+loại\s+đất\s+\(\s*ONT\s*\)/gi, "{dien_tich_loai_dat}");
xml = xml.replace(/270\s+m2/g, "{dien_tich_loai_dat}");

console.log("✓ Area fixed");

// 3. Add ben_b_dia_chi after ben_b_ngay_cap
// Look for end of Ben B section before next major section
const benBPattern = /{ben_b_ngay_cap}\./;
const benBMatch = xml.match(benBPattern);
if (benBMatch) {
  xml = xml.replace(
    benBPattern,
    "{ben_b_ngay_cap}. Nơi thường trú: {ben_b_dia_chi}."
  );
  console.log("✓ Ben B address added");
}

// Write back
zip.files["word/document.xml"].binary = true;
zip.file("word/document.xml", xml, { binary:true });

const newContent = zip.generate({ type: "nodebuffer" });
fs.writeFileSync(templatePath, newContent);

console.log("\n✅ All fixes applied!");

// Verify
const checkZip = new PizZip(newContent);
const checkXml = checkZip.files["word/document.xml"].asText();
const tags = [...new Set(checkXml.match(/{[\w_]+}/g) || [])];
console.log("\nTags now in template:");
tags.sort().forEach(t => console.log("  " + t));
