import fs from "fs";
import PizZip from "pizzip";

const xml = new PizZip(fs.readFileSync("e:/Tool/public/templates/uy_quyen.docx"))
  .file("word/document.xml")
  .asText();

const i = xml.indexOf("QSDĐ/932/QĐUB");
console.log("idx", i);
if (i !== -1) {
  const s = Math.max(0, i - 700);
  const e = Math.min(xml.length, i + 1400);
  console.log(xml.slice(s, e));
}
