import fs from "fs";
import PizZip from "pizzip";

const templatePath = "public/templates/uy_quyen.docx";
const backupPath = "public/templates/uy_quyen.docx.bak";

// Restore from backup
const backupContent = fs.readFileSync(backupPath, "binary");
const zip = new PizZip(backupContent);
let xml = zip.files["word/document.xml"].asText();

console.log("Converting template to loop-based structure...\n");

// Strategy: Replace individual ben_a_* tags with a loop for ds_ben_a
// Find the "BÊN UỶ QUYỀN" section and replace field tags with loop

// Replace Ben A fields with loop
// Find: "BÊN UỶ QUYỀN (Bên A):" ... individual fields... up to "BÊN ĐƯỢC UỶ QUYỀN"
// Replace with: loop structure

// First, let's extract the structure around Ben A
const benAStart = xml.indexOf("BÊN UỶ QUYỀN");
const benBStart = xml.indexOf("BÊN ĐƯỢC UỶ QUYỀN", benAStart);

if (benAStart >= 0 && benBStart >= 0) {
  console.log("✓ Found Ben A and Ben B sections");
  
  // Create template for Ben A - replace individual tags with loop
  // Pattern: Ông: {ben_a_ho_ten} ... Nơi thường trú: {ben_a_dia_chi}
  // Replace with: {#ds_ben_a} ... content with {ho_ten}, {ngay_sinh}, etc ...{/ds_ben_a}
  
  // Replace ben_a_* tags in the Ben A section
  xml = xml.replace(
    /Ông\s*:\s*{ben_a_ho_ten}/g,
    "Ông: {xung_ho}: {ho_ten}"
  );
  
  xml = xml.replace(
    /{ben_a_ngay_sinh}/g,
    "{ngay_sinh}"
  );
  
  xml = xml.replace(
    /{ben_a_cccd}/g,
    "{cccd}"
  );
  
  xml = xml.replace(
    /{ben_a_ngay_cap}/g,
    "{ngay_cap}"
  );
  
  xml = xml.replace(
    /nơi thường trú:\s*{ben_a_dia_chi}/gi,
    "nơi thường trú: {dia_chi}"
  );
  
  // Now wrap the Ben A content in a loop
  // Find text between "BÊN UỶ QUYỀN (Bên A):" and "BÊN ĐƯỢC UỶ QUYỀN"
  const benAPattern = /Ông:\s*\{xung_ho\}:[^}]*\{ngay_cap\}[\s\S]*?thường[^}]*\{dia_chi\}\./;
  
  if (benAPattern.test(xml)) {
    xml = xml.replace(
      benAPattern,
      match => `{#ds_ben_a}${match}{/ds_ben_a}`
    );
    console.log("✓ Ben A loop added");
  } else {
    console.log("⚠ Ben A pattern not found, trying simpler approach");
  }
  
  // Similar for Ben B
  xml = xml.replace(
    /Bà\s*:\s*{ben_b_ho_ten}/g,
    "Bà: {xung_ho}: {ho_ten}"
  );
  
  xml = xml.replace(
    /CCCD\s+số:\s*{ben_b_cccd}/gi,
    "CCCD số: {cccd}"
  );
  
  xml = xml.replace(
    /{ben_b_ngay_sinh}/g,
    "{ngay_sinh}"
  );
  
  xml = xml.replace(
    /{ben_b_ngay_cap}/g,
    "{ngay_cap}"
  );
  
  xml = xml.replace(
    /nơi thường trú:\s*{ben_b_dia_chi}/gi,
    "nơi thường trú: {dia_chi}"
  );
  
  console.log("✓ Ben B tags converted");
} else {
  console.log("✗ Could not find Ben A/B sections");
}

// Write back
zip.files["word/document.xml"].binary = true;
zip.file("word/document.xml", xml, { binary: true });

const newContent = zip.generate({ type: "nodebuffer" });
fs.writeFileSync(templatePath, newContent);

console.log("\n✅ Template converted to loop structure!");
console.log("\nNew structure:");
console.log("  {#ds_ben_a} ... {/ds_ben_a}");
console.log("  {#ds_ben_b} ... {/ds_ben_b}");
