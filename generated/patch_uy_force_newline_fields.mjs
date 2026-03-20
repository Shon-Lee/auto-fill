import fs from "fs";
import PizZip from "pizzip";

const filePath = "public/templates/uy_quyen.docx";
const zip = new PizZip(fs.readFileSync(filePath, "binary"));
let xml = zip.files["word/document.xml"].asText();

const regex = /<w:t([^>]*)>([^<]*)<\/w:t>/g;
const replacements = new Map([
  // Force birthday labels to start a new line in the main party blocks
  [26, "\nNgày sinh: "],
  [48, "\nNgày sinh: "],
  [65, "\nNgày sinh: "],

  // Keep residence on dedicated line for Ben B block
  [79, "\nNơi thường trú: {ben_b_dia_chi}.{ben_b_bo_sung}"],

  // Certification block: move birth date to new line for readability
  [214, "\nCCCD số: "],
  [218, "\nCCCD số"],
  [219, ":"]
]);

let idx = 0;
xml = xml.replace(regex, (_all, attrs, text) => {
  const out = replacements.has(idx) ? replacements.get(idx) : text;
  idx += 1;
  return `<w:t${attrs}>${out}</w:t>`;
});

zip.file("word/document.xml", xml);
fs.writeFileSync(filePath, zip.generate({ type: "nodebuffer" }));

console.log("Patched newline fields at nodes:", [...replacements.keys()].join(", "));
