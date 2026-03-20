import fs from "fs";
import PizZip from "pizzip";

const xml = new PizZip(fs.readFileSync("e:/Tool/public/templates/uy_quyen.docx"))
  .file("word/document.xml")
  .asText();

const keys = [
  "01/01/1968",
  "26/11/2025",
  "VŨ THỊ L",
  "11/3/1973",
  "036173002988",
  "02/07/2021",
  "12/11/1996",
  "20/6/2023",
  "Hoàng Văn C",
  "Bùi Thu Q",
  "O 413742",
  "QSDĐ/932/QĐUB",
  "huyện X, tỉnh Nam Định",
  "20/11/1998",
  "thửa đất số 37",
  "tờ bản đồ số 63",
  "Phạm Ngọc Vinh",
  "Đỗ Hùng Hoài",
  "UBND xã X",
  "UBND Xã Xuân Trường"
];

for (const key of keys) {
  const i = xml.indexOf(key);
  if (i === -1) {
    console.log(`MISS: ${key}`);
    continue;
  }
  const s = Math.max(0, i - 90);
  const e = Math.min(xml.length, i + key.length + 90);
  console.log(`\n=== ${key} ===`);
  console.log(xml.slice(s, e));
}
