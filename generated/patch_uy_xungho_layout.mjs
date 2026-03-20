import fs from "fs";
import PizZip from "pizzip";

const filePath = "public/templates/uy_quyen.docx";
const zip = new PizZip(fs.readFileSync(filePath, "binary"));
let xml = zip.files["word/document.xml"].asText();

const regex = /<w:t([^>]*)>([^<]*)<\/w:t>/g;
const replacements = new Map([
  // Main party labels
  [21, "{ben_a_xung_ho}"],
  [45, "{ben_a2_xung_ho}: "],
  [61, "{ben_b_xung_ho}"],

  // Residence layout: move to next line and keep supplemental list tidy
  [58, "Nơi thường trú: {ben_a2_dia_chi}.\n{ben_a_bo_sung}"],
  [79, "\nNơi thường trú: {ben_b_dia_chi}.\n{ben_b_bo_sung}"],

  // Certification section labels
  [212, "            {ben_a2_xung_ho}: "],
  [216, "Bên B: {ben_b_xung_ho}: "],

  // Signature section labels
  [229, "{ben_a_xung_ho} "],
  [236, "{ben_b_xung_ho} "]
]);

let idx = 0;
xml = xml.replace(regex, (_all, attrs, text) => {
  const out = replacements.has(idx) ? replacements.get(idx) : text;
  idx += 1;
  return `<w:t${attrs}>${out}</w:t>`;
});

zip.file("word/document.xml", xml);
fs.writeFileSync(filePath, zip.generate({ type: "nodebuffer" }));

console.log("Patched nodes:", [...replacements.keys()].join(", "));
