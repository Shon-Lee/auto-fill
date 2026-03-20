import fs from "fs";
import PizZip from "pizzip";

const templatePath = "public/templates/uy_quyen.docx";
const backupPath = "public/templates/uy_quyen.docx.bak";

// Restore from backup
const backupContent = fs.readFileSync(backupPath, "binary");
const zip = new PizZip(backupContent);
let xml = zip.files["word/document.xml"].asText();

console.log("Manual surgical approach...\n");

// Extract all paragraphs containing our problem areas
const paraProblem = xml.match(/<w:p[\s\S]*?thua_dat_so[\s\S]*?<\/w:p>/);

if (paraProblem) {
  console.log("Found target paragraph, length:", paraProblem[0].length);
  
  // This paragraph contains the map reference issue
  // We need to replace everything from "(tờ" through "2025" with "{to_ban_do_info}"
  
  let oldPara = paraProblem[0];
  
  // Strategy: Find each problematic text run and replace it
  // Replace any <w:t> containing the hardcoded values
  
  let newPara = oldPara;
  
  // Replace runs containing "04" with tag
  newPara = newPara.replace(
    /<w:t[^>]*>\s*04\s*<\/w:t>/g,
    '<w:t>{to_ban_do_info}</w:t>'
  );
  
  // Replace runs containing "2025"
  newPara = newPara.replace(
    /<w:t[^>]*>2025<\/w:t>/g,
    '<w:t>{to_ban_do_info}</w:t>'
  );
  
  // Replace runs containing "Xuân P cũ"
  newPara = newPara.replace(
    /<w:t[^>]*>Xuân P cũ<\/w:t>/g,
    '<w:t>{to_ban_do_info}</w:t>'
  );
  
  // Replace runs containing "270"
  newPara = newPara.replace(
    /<w:t[^>]*>270<\/w:t>/g,
    '<w:t>{dien_tich_loai_dat}</w:t>'
  );
  
  // Replace runs containing "ONT"
  newPara = newPara.replace(
    /<w:t[^>]*>\s*ONT\s*<\/w:t>/g,
    '<w:t>{dien_tich_loai_dat}</w:t>'
  );
  
  xml = xml.replace(oldPara, newPara);
  console.log("✓ Map and area fields fixed in paragraph");
}

// Find and fix Ben B address paragraph
const bParaBenB = xml.match(/<w:p[\s\S]*?ben_b_ngay_cap[\s\S]*?<\/w:p>/);
if (bParaBenB) {
  let oldBenB = bParaBenB[0];
  let newBenB = oldBenB;
  
  // Add address field after ngay_cap
  newBenB = newBenB.replace(
    /{ben_b_ngay_cap}\./g,
    '{ben_b_ngay_cap}. Nơi thường trú: {ben_b_dia_chi}.'
  );
  
  xml = xml.replace(oldBenB, newBenB);
  console.log("✓ Ben B address field added");
}

// Write back
zip.files["word/document.xml"].binary = true;
zip.file("word/document.xml", xml, { binary: true });

const newContent = zip.generate({ type: "nodebuffer" });
fs.writeFileSync(templatePath, newContent);

console.log("\n✅ Template patched!");

// Verify
const checkZip = new PizZip(newContent);
const checkXml = checkZip.files["word/document.xml"].asText();
const tags = [...new Set(checkXml.match(/{[\w_]+}/g) || [])];
console.log("\nTags in template:");
tags.sort().slice(0, 10).forEach(t => console.log("  " + t));
console.log(`... (${tags.length} total)`);
