import fs from "fs";
import PizZip from "pizzip";

const xml = new PizZip(fs.readFileSync("public/templates/uy_quyen.docx", "binary")).files["word/document.xml"].asText();
const texts = (xml.match(/<w:t[^>]*>[^<]*<\/w:t>/g) || []).map((t) => t.replace(/<[^>]+>/g, ""));
const keys = ["Lời chứng", "Hoàng", "Vũ", "Bùi", "xã X", "04", "2025", "270", "ONT", "Nơi thường trú"];
for (const key of keys) {
  const idx = texts.findIndex((t) => t.includes(key));
  console.log(key, idx >= 0 ? `FOUND@${idx}` : "not-found");
  if (idx >= 0) {
    console.log(texts.slice(Math.max(0, idx - 3), idx + 4).join(" | "));
  }
}
