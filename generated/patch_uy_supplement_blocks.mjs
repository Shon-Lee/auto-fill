import fs from "fs";
import PizZip from "pizzip";

const filePath = "public/templates/uy_quyen.docx";
const zip = new PizZip(fs.readFileSync(filePath, "binary"));
let xml = zip.files["word/document.xml"].asText();

const regex = /<w:t([^>]*)>([^<]*)<\/w:t>/g;

// Put supplemental blocks on dedicated new lines, not inline after fixed text.
const replacements = new Map([
  [58, "Nơi thường trú: {ben_a2_dia_chi}.{ben_a_bo_sung}"],
  [79, " Nơi thường trú: {ben_b_dia_chi}.{ben_b_bo_sung}"]
]);

let idx = 0;
xml = xml.replace(regex, (_all, attrs, text) => {
  const out = replacements.has(idx) ? replacements.get(idx) : text;
  idx += 1;
  return `<w:t${attrs}>${out}</w:t>`;
});

zip.file("word/document.xml", xml);
fs.writeFileSync(filePath, zip.generate({ type: "nodebuffer" }));
console.log("patched nodes", [...replacements.keys()].join(","));
