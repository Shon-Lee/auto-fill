import fs from "fs";
import PizZip from "pizzip";

const path = process.argv[2] || "public/templates/uy_quyen.docx";
const zip = new PizZip(fs.readFileSync(path, "binary"));
const xml = zip.files["word/document.xml"].asText();

const regex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
let m;
let idx = 0;
while ((m = regex.exec(xml)) !== null) {
  const t = m[1];
  console.log(`${idx}: ${JSON.stringify(t)}`);
  idx += 1;
}
console.log("TOTAL", idx);
