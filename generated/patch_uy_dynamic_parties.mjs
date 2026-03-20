import fs from "fs";
import PizZip from "pizzip";

const filePath = "public/templates/uy_quyen.docx";
const zip = new PizZip(fs.readFileSync(filePath, "binary"));
let xml = zip.files["word/document.xml"].asText();

const textRegex = /<w:t([^>]*)>([^<]*)<\/w:t>/g;
const nodes = [];
let m;
while ((m = textRegex.exec(xml)) !== null) {
  nodes.push({ attrs: m[1], text: m[2] });
}

const replacements = new Map();

// ben_a2 address should not reuse ben_a address
replacements.set(58, "Nơi thường trú: {ben_a2_dia_chi}.{ben_a_bo_sung}");

// remove duplicated old ben_b residence hardcode line
for (let i = 80; i <= 86; i++) replacements.set(i, "");

// keep ben_b_dia_chi and append supplemental parties
replacements.set(79, " Nơi thường trú: {ben_b_dia_chi}.{ben_b_bo_sung}");

// keep single-field map/area mode clean
replacements.set(101, "; {to_ban_do_info}");
replacements.set(106, " {dien_tich_loai_dat}");

// chứng thực section: dynamic location and supplemental parties
replacements.set(196, "xã {dia_diem_lap_hop_dong}");
replacements.set(200, "{dia_diem_lap_hop_dong}");
replacements.set(220, " {ben_b_cccd}{ben_chung_thuc_bo_sung}");

let idx = 0;
xml = xml.replace(textRegex, (_full, attrs, text) => {
  const out = replacements.has(idx) ? replacements.get(idx) : text;
  idx += 1;
  return `<w:t${attrs}>${out}</w:t>`;
});

zip.file("word/document.xml", xml);
fs.writeFileSync(filePath, zip.generate({ type: "nodebuffer" }));

console.log("Patched text nodes:", [...replacements.keys()].join(", "));
