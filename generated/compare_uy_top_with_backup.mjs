import fs from "fs";
import PizZip from "pizzip";

function topTexts(path, n = 90) {
  const xml = new PizZip(fs.readFileSync(path, "binary")).files["word/document.xml"].asText();
  const texts = (xml.match(/<w:t[^>]*>[^<]*<\/w:t>/g) || [])
    .map((t) => t.replace(/<[^>]+>/g, ""))
    .filter((t) => t.trim().length > 0);
  return texts.slice(0, n);
}

const cur = topTexts("public/templates/uy_quyen.docx");
const bak = topTexts("public/templates/uy_quyen.docx.bak");

console.log("=== CURRENT TOP ===");
cur.forEach((t, i) => console.log(`${i}: ${t}`));
console.log("\n=== BACKUP TOP ===");
bak.forEach((t, i) => console.log(`${i}: ${t}`));
