import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import schema from "../src/schemas/uy_quyen.js";

const p = "e:/Tool/public/templates/uy_quyen.docx";
const text = new Docxtemplater(new PizZip(fs.readFileSync(p)), {
  paragraphLoop: true,
  linebreaks: true
}).getFullText() || "";

for (const key of Object.keys(schema)) {
  const a = `{${key}}`;
  const b = `{{${key}}}`;
  const ok = text.includes(a) || text.includes(b);
  console.log(`${key}: ${ok ? "YES" : "NO"}`);
}
