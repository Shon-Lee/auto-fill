import fs from "fs";
import PizZip from "pizzip";

const filePath = "public/templates/uy_quyen.docx";
const zip = new PizZip(fs.readFileSync(filePath, "binary"));
let xml = zip.files["word/document.xml"].asText();

const regex = /<w:t([^>]*)>([^<]*)<\/w:t>/g;
const replacements = new Map([
  // Remove forced line breaks that cause justified-word stretching
  [58, "Nơi thường trú: {ben_a2_dia_chi}. {ben_a_bo_sung}"],
  [79, " Nơi thường trú: {ben_b_dia_chi}. {ben_b_bo_sung}"]
]);

let idx = 0;
xml = xml.replace(regex, (_all, attrs, text) => {
  const out = replacements.has(idx) ? replacements.get(idx) : text;
  idx += 1;
  return `<w:t${attrs}>${out}</w:t>`;
});

zip.file("word/document.xml", xml);
fs.writeFileSync(filePath, zip.generate({ type: "nodebuffer" }));

console.log("Patched compact layout nodes:", [...replacements.keys()].join(", "));
