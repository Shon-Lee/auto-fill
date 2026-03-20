import fs from "fs";
import PizZip from "pizzip";

const filePath = "public/templates/uy_quyen.docx";
const zip = new PizZip(fs.readFileSync(filePath, "binary"));
let xml = zip.files["word/document.xml"].asText();

const regex = /<w:t([^>]*)>([^<]*)<\/w:t>/g;
const nodes = [];
let m;
while ((m = regex.exec(xml)) !== null) {
  nodes.push({ attrs: m[1], text: m[2] });
}

const replacements = new Map();
// Ben B CCCD in main section was split hardcoded in nodes 69-71
replacements.set(69, "{ben_b_cccd}");
replacements.set(70, "");
replacements.set(71, "");

let idx = 0;
xml = xml.replace(regex, (_all, attrs, text) => {
  const out = replacements.has(idx) ? replacements.get(idx) : text;
  idx += 1;
  return `<w:t${attrs}>${out}</w:t>`;
});

zip.file("word/document.xml", xml);
fs.writeFileSync(filePath, zip.generate({ type: "nodebuffer" }));

console.log("Patched nodes 69-71 for ben_b_cccd");
