import fs from "fs";
import PizZip from "pizzip";

const xml = new PizZip(fs.readFileSync("e:/Tool/public/templates/uy_quyen.docx"))
  .file("word/document.xml")
  .asText();

const keys = [
  "VŨ THỊ L",
  "11/3/1973",
  "036173002988",
  "02/07/2021",
  "12/11/1996",
  "036196019000",
  "20/6/2023",
  "Xuân Trường",
  "Phạm Ngọc Vinh",
  "Đỗ Hùng Hoài",
  "Hoàng Văn C",
  "Bùi Thu Q",
  "O 413742",
  "QSDĐ/932/QĐUB",
  "huyện X",
  "Nam Định",
  "20/11/1998",
  "thửa đất số 37",
  "tờ bản đồ số 63"
];

for (const k of keys) {
  const esc = k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const c = (xml.match(new RegExp(esc, "g")) || []).length;
  if (c) {
    console.log(`${k}: ${c}`);
  }
}

const tags = xml.match(/\{[^}]+\}/g) || [];
console.log(`tags: ${tags.length}`);
console.log(`unique tags: ${[...new Set(tags)].join(" | ")}`);
