import fs from "fs";
import PizZip from "pizzip";

const templatePath = "public/templates/uy_quyen.docx";
const content = fs.readFileSync(templatePath, "binary");
const zip = new PizZip(content);
const xml = zip.files["word/document.xml"].asText();

// Extract all text and look for context
const textMatches = xml.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
console.log("=== TEXT EXTRACTION ===");

// Look for specific problem areas mentioned by user
const problematicTerms = [
  "nơi thường trú",
  "CCCD số",
  "Cân cước",
  "tờ bản đồ",
  "thửa đất",
  "diện tích",
  "loại đất",
  "ONT",
  "Bên B"
];

const textOnly = textMatches.map(t => t.replace(/<w:t[^>]*>|<\/w:t>/g, ""));

textOnly.forEach((text, idx) => {
  if (problematicTerms.some(term => text.includes(term))) {
    console.log(`\nContext around: "${text}"`);
    // Show surrounding text
    const start = Math.max(0, idx - 3);
    const end = Math.min(textOnly.length, idx + 4);
    for (let i = start; i < end; i++) {
      const marker = i === idx ? ">>> " : "    ";
      if (textOnly[i].trim()) {
        console.log(`${marker}[${i}]: ${textOnly[i].substring(0, 80)}`);
      }
    }
  }
});

// Extract all tags
const tagPattern = /{[\w_]+}/g;
const tags = xml.match(tagPattern) || [];
const uniqueTags = [...new Set(tags)];
console.log("\n=== ALL TAGS IN TEMPLATE ===");
uniqueTags.sort().forEach(tag => console.log(`  ${tag}`));
