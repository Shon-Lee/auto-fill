import fs from "fs";
import PizZip from "pizzip";

const xml = new PizZip(fs.readFileSync("e:/Tool/public/templates/uy_quyen.docx"))
  .file("word/document.xml")
  .asText();

const key = ", số vào sổ";
const i = xml.indexOf(key);
console.log("idx", i);
if (i !== -1) {
  const s = Math.max(0, i - 450);
  const e = Math.min(xml.length, i + 350);
  console.log(xml.slice(s, e));
}
