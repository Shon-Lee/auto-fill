import fs from "fs";
import PizZip from "pizzip";

const filePath = "public/templates/uy_quyen.docx";
const zip = new PizZip(fs.readFileSync(filePath, "binary"));
let xml = zip.files["word/document.xml"].asText();

function cleanParagraph(tag) {
  return `<w:p><w:pPr><w:spacing w:after="120" w:line="240" w:lineRule="auto"/><w:ind w:left="720"/><w:jc w:val="left"/><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:color w:val="000000"/><w:sz w:val="25"/><w:szCs w:val="25"/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:color w:val="000000"/><w:sz w:val="25"/><w:szCs w:val="25"/></w:rPr><w:t>${tag}</w:t></w:r></w:p>`;
}

const targets = ["{ben_a_block_1}", "{ben_a_block_2}", "{ben_b_block_1}"];
let replaced = 0;

for (const tag of targets) {
  const re = new RegExp(`<w:p[\\s\\S]*?${tag.replace(/[{}]/g, "\\$&")}([\\s\\S]*?)<\\/w:p>`, "g");
  xml = xml.replace(re, () => {
    replaced += 1;
    return cleanParagraph(tag);
  });
}

zip.file("word/document.xml", xml);
fs.writeFileSync(filePath, zip.generate({ type: "nodebuffer" }));

console.log("Replaced block paragraphs:", replaced);
