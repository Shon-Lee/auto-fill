import fs from "fs";
import PizZip from "pizzip";

const templatePath = "public/templates/uy_quyen.docx";
const content = fs.readFileSync(templatePath, "binary");
const zip = new PizZip(content);
const xml = zip.files["word/document.xml"].asText();

// Look for placeholder patterns (multiple a's)
const aPattern = /aaaa+a|AAAA+A/g;
const aaMatches = xml.match(aPattern) || [];
console.log("Found placeholder patterns (multiple a):", aaMatches.length);

if (aaMatches.length > 0) {
  console.log("\nPlaceholder patterns found:");
  aaMatches.slice(0, 10).forEach((m, i) => console.log(`  ${i + 1}: ${m}`));
}

// Extract context around placeholders
if (aaMatches.length > 0) {
  console.log("\n=== CONTEXT AROUND PLACEHOLDERS ===");
  let searchIdx = 0;
  for (let i = 0; i < Math.min(5, aaMatches.length); i++) {
    const pattern = aaMatches[i];
    const foundIdx = xml.indexOf(pattern, searchIdx);
    if (foundIdx >= 0) {
      const start = Math.max(0, foundIdx - 100);
      const end = Math.min(xml.length, foundIdx + pattern.length + 100);
      const context = xml.substring(start, end);
      console.log(`\nPlaceholder ${i + 1}: "${pattern}"`);
      console.log(context);
      searchIdx = foundIdx + pattern.length;
    }
  }
}

// Check for actual template tags to compare
const tagPattern = /{[\w_]+}/g;
const tags = xml.match(tagPattern) || [];
console.log(`\nTotal tags found: ${tags.length}`);
const uniqueTags = [...new Set(tags)];
console.log(`Unique tags (${uniqueTags.length}):`);
uniqueTags.forEach((tag) => console.log(`  ${tag}`));
