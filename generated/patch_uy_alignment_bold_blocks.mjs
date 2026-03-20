import fs from "fs";
import PizZip from "pizzip";

const filePath = "public/templates/uy_quyen.docx";
const zip = new PizZip(fs.readFileSync(filePath, "binary"));
let xml = zip.files["word/document.xml"].asText();

const aOld = "Nơi thường trú: {ben_a2_dia_chi}.{ben_a_bo_sung}</w:t></w:r></w:p>";
const aNew = "Nơi thường trú: {ben_a2_dia_chi}.</w:t></w:r></w:p>"
  + "<w:p><w:pPr><w:spacing w:after=\"120\" w:line=\"240\" w:lineRule=\"auto\"/><w:jc w:val=\"left\"/></w:pPr>"
  + "<w:r><w:rPr><w:b/><w:rFonts w:ascii=\"Times New Roman\" w:hAnsi=\"Times New Roman\"/><w:color w:val=\"000000\"/><w:sz w:val=\"25\"/><w:szCs w:val=\"25\"/></w:rPr><w:t>{ben_a_bo_sung}</w:t></w:r></w:p>";

const bOld = " Nơi thường trú: {ben_b_dia_chi}.{ben_b_bo_sung}</w:t></w:r></w:p>";
const bNew = " Nơi thường trú: {ben_b_dia_chi}.</w:t></w:r></w:p>"
  + "<w:p><w:pPr><w:spacing w:after=\"120\" w:line=\"240\" w:lineRule=\"auto\"/><w:jc w:val=\"left\"/></w:pPr>"
  + "<w:r><w:rPr><w:b/><w:rFonts w:ascii=\"Times New Roman\" w:hAnsi=\"Times New Roman\"/><w:color w:val=\"000000\"/><w:sz w:val=\"25\"/><w:szCs w:val=\"25\"/></w:rPr><w:t>{ben_b_bo_sung}</w:t></w:r></w:p>";

const before = xml;
xml = xml.replace(aOld, aNew);
xml = xml.replace(bOld, bNew);

if (xml === before) {
  console.log("No replacement applied (pattern mismatch)");
} else {
  zip.file("word/document.xml", xml);
  fs.writeFileSync(filePath, zip.generate({ type: "nodebuffer" }));
  console.log("Patched supplemental blocks to standalone left-aligned bold paragraphs");
}
