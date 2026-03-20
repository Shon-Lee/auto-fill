import fs from "fs";
import PizZip from "pizzip";

const filePath = "public/templates/uy_quyen.docx";
const zip = new PizZip(fs.readFileSync(filePath, "binary"));
let xml = zip.files["word/document.xml"].asText();

const textRegex = /<w:t([^>]*)>([^<]*)<\/w:t>/g;
let idx = 0;
let changed = false;
xml = xml.replace(textRegex, (_all, attrs, text) => {
  let out = text;
  if (idx === 115 || text.includes("{noi_dung_uy_quyen}")) {
    out = "NỘI DUNG UỶ QUYỀN";
    changed = true;
  }
  idx += 1;
  return `<w:t${attrs}>${out}</w:t>`;
});

zip.file("word/document.xml", xml);
fs.writeFileSync(filePath, zip.generate({ type: "nodebuffer" }));
console.log("changed", changed);
