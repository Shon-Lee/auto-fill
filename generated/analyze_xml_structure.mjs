import fs from "fs";
import PizZip from "pizzip";

const templatePath = "public/templates/uy_quyen.docx";
const content = fs.readFileSync(templatePath, "binary");
const zip = new PizZip(content);
let xml = zip.files["word/document.xml"].asText();

console.log("Restoring from backup and trying better approach...");

// Restore backup
const backupPath = "public/templates/uy_quyen.docx.bak";
const backupContent = fs.readFileSync(backupPath, "binary");
const backupZip = new PizZip(backupContent);
let xmlFresh = backupZip.files["word/document.xml"].asText();

// More surgical approach - replace across <w:t> boundaries
// The hardcoded parts are split into multiple text runs, need to work with the actual structure

// First, let's examine the structure more carefully
const paragraphs = xmlFresh.match(/<w:p[\s\S]*?<\/w:p>/g) || [];
console.log(`Found ${paragraphs.length} paragraphs`);

// Find paragraphs containing our target text
let targetParaIdx = -1;
for (let i = 0; i < paragraphs.length; i++) {
  if (paragraphs[i].includes("thua_dat_so")) {
    targetParaIdx = i;
    console.log(`\nFound target paragraph at index ${i}`);
    
    // Get context
    const para = paragraphs[i];
    // Show first 500 chars
    console.log("Paragraph content (first 1000 chars):");
    console.log(para.substring(0, 1000));
    console.log("\n...");
    console.log(para.substring(para.length - 500));
    break;
  }
}

// Try a different approach - decode the special characters in the output
console.log("\n=== DECODED CONTENT AROUND MAP ===");
const mapIdx = xmlFresh.indexOf("thua_dat_so");
if (mapIdx >= 0) {
  const start = Math.max(0, mapIdx - 200);
  const end = Math.min(xmlFresh.length, mapIdx + 800);
  const chunk = xmlFresh.substring(start, end);
  
  // Extract just the text content
  const textOnly = chunk.replace(/<[^>]+>/g, "");
  console.log("Text only: " + textOnly);
}
