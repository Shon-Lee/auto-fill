import fs from "fs";
import PizZip from "pizzip";

const xml = new PizZip(fs.readFileSync("e:/Tool/public/templates/uy_quyen.docx"))
  .file("word/document.xml")
  .asText();

const keys = [
  "036196019000",
  "Nơi thường trú: {ben_a_dia_chi}.Bà:",
  "Nơi thường trú: xã X, tỉnh Ninh Bình.",
  "Tại: UBND xã X, tỉnh Ninh Bình.",
  "Tôi: {nguoi_thuc_hien_chung_thuc} - PCT UBND xã X"
];

for (const key of keys) {
  const idx = xml.indexOf(key);
  console.log(`\n==== ${key} ====`);
  console.log(`idx: ${idx}`);
  if (idx !== -1) {
    const s = Math.max(0, idx - 150);
    const e = Math.min(xml.length, idx + key.length + 150);
    console.log(xml.slice(s, e));
  }
}
