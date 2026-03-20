import fs from "fs";
import PizZip from "pizzip";

const filePath = "public/templates/uy_quyen.docx";
const zip = new PizZip(fs.readFileSync(filePath, "binary"));
let xml = zip.files["word/document.xml"].asText();

// 1) Force all red text to black in this template
let redCount = 0;
xml = xml.replace(/w:color w:val="FF0000"/g, () => {
  redCount += 1;
  return 'w:color w:val="000000"';
});
xml = xml.replace(/w:color w:val="ff0000"/g, () => {
  redCount += 1;
  return 'w:color w:val="000000"';
});

// 2) Normalize node that contains noi_dung_uy_quyen to avoid stray literals
const textRegex = /<w:t([^>]*)>([^<]*)<\/w:t>/g;
let idx = 0;
let changedNoiDung = false;
xml = xml.replace(textRegex, (_all, attrs, text) => {
  let out = text;
  if (text.includes("{noi_dung_uy_quyen}")) {
    // keep only clean title + tag
    out = "NỘI DUNG UỶ QUYỀN {noi_dung_uy_quyen}";
    changedNoiDung = true;
  }
  idx += 1;
  return `<w:t${attrs}>${out}</w:t>`;
});

zip.file("word/document.xml", xml);
fs.writeFileSync(filePath, zip.generate({ type: "nodebuffer" }));

console.log("Replaced red->black runs:", redCount);
console.log("Normalized noi_dung node:", changedNoiDung);
