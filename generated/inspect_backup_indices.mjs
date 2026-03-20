import fs from "fs";
import PizZip from "pizzip";

const xml = new PizZip(fs.readFileSync("public/templates/uy_quyen.docx.bak", "binary")).files["word/document.xml"].asText();
const texts = (xml.match(/<w:t[^>]*>[^<]*<\/w:t>/g) || []).map((t) => t.replace(/<[^>]+>/g, ""));
for (let i = 0; i < texts.length; i++) {
  const t = texts[i];
  if (!t.trim()) continue;
  if (i <= 245) {
    console.log(`${i}: ${t}`);
  }
}
