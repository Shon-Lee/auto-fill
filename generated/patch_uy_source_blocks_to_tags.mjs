import fs from "fs";
import PizZip from "pizzip";

const filePath = "public/templates/uy_quyen.docx";
const zip = new PizZip(fs.readFileSync(filePath, "binary"));
let xml = zip.files["word/document.xml"].asText();

const regex = /<w:t([^>]*)>([^<]*)<\/w:t>/g;

const clear = new Set([
  // old ben_a inline fields
  22, 24, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
  // old ben_a2 inline fields
  46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58,
  // old ben_b inline fields
  63, 64, 65, 66, 67, 68, 69, 70, 73, 74, 75, 76, 78, 79, 80
]);

const replacements = new Map([
  [21, "{ben_a_block_1}"],
  [45, "{ben_a_block_2}"],
  [62, "{ben_b_block_1}"]
]);

let idx = 0;
xml = xml.replace(regex, (_all, attrs, text) => {
  let out = text;
  if (replacements.has(idx)) out = replacements.get(idx);
  if (clear.has(idx)) out = "";
  idx += 1;
  return `<w:t${attrs}>${out}</w:t>`;
});

zip.file("word/document.xml", xml);
fs.writeFileSync(filePath, zip.generate({ type: "nodebuffer" }));

console.log("Patched source blocks to tag blocks. Nodes replaced:", [...replacements.keys()].join(","));
console.log("Cleared nodes:", [...clear].length);
