import fs from "fs";
import PizZip from "pizzip";

const xml = new PizZip(fs.readFileSync("e:/Tool/public/templates/uy_quyen.docx"))
  .file("word/document.xml")
  .asText();

const patterns = [
  "036068",
  "036173",
  "xã X, tỉnh Ninh Bình",
  "O 413",
  "742",
  "thửa đất số",
  "tờ bản đồ số tờ bản đồ số",
  "UBND xã X",
  "Tại: UBND xã",
  "Phạm Ngọc Vinh",
  "Đỗ Hùng Hoài",
  "01/2026 -SCT/GD/."
];

for (const key of patterns) {
  const idx = xml.indexOf(key);
  console.log(`\n${key}: ${idx}`);
  if (idx !== -1) {
    const s = Math.max(0, idx - 120);
    const e = Math.min(xml.length, idx + key.length + 180);
    console.log(xml.slice(s, e));
  }
}
