import fs from "fs";
import PizZip from "pizzip";

const filePath = "public/templates/uy_quyen.docx";
const zip = new PizZip(fs.readFileSync(filePath, "binary"));
let xml = zip.files["word/document.xml"].asText();

const textRegex = /<w:t([^>]*)>([^<]*)<\/w:t>/g;
const matches = [];
let m;
while ((m = textRegex.exec(xml)) !== null) {
  matches.push({
    full: m[0],
    attrs: m[1],
    text: m[2],
    start: m.index,
    end: m.index + m[0].length
  });
}

const texts = matches.map((x) => x.text);
const replacements = new Map();

// A) Main section residence line: Nơi thường trú: xã X, tỉnh Ninh Bình. -> {ben_a_dia_chi}
const addrIdx = texts.findIndex((t, i) => t.includes("Nơi thường trú") && texts[i + 1] === "x");
if (addrIdx >= 0) {
  replacements.set(addrIdx + 1, "{ben_a_dia_chi}");
  replacements.set(addrIdx + 2, "");
  replacements.set(addrIdx + 3, "");
  replacements.set(addrIdx + 4, "");
  replacements.set(addrIdx + 5, "");
  replacements.set(addrIdx + 6, "");
}

// B) Land description single-field mode requested by user
const mapIdx = texts.findIndex((t) => t.includes("{to_ban_do_info}"));
if (mapIdx >= 0) {
  // Keep map info field, remove leftover hardcoded suffix, and inject single area field
  if (mapIdx + 4 < texts.length) replacements.set(mapIdx + 4, "");
  if (mapIdx + 5 < texts.length) replacements.set(mapIdx + 5, " {dien_tich_loai_dat}");
  if (mapIdx + 6 < texts.length) replacements.set(mapIdx + 6, "");
  if (mapIdx + 7 < texts.length) replacements.set(mapIdx + 7, "");
  if (mapIdx + 8 < texts.length) replacements.set(mapIdx + 8, "");
  if (mapIdx + 9 < texts.length) replacements.set(mapIdx + 9, "");
  if (mapIdx + 10 < texts.length) replacements.set(mapIdx + 10, "");
}

// Rewrite XML by applying replacements by text-node index
let idx = 0;
xml = xml.replace(textRegex, (_full, attrs, text) => {
  const out = replacements.has(idx) ? replacements.get(idx) : text;
  idx += 1;
  return `<w:t${attrs}>${out}</w:t>`;
});

zip.file("word/document.xml", xml);
fs.writeFileSync(filePath, zip.generate({ type: "nodebuffer" }));

console.log("Total text nodes:", texts.length);
console.log("Address index:", addrIdx);
console.log("Map index:", mapIdx);
console.log("Applied replacements:", replacements.size);
