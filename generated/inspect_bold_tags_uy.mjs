import fs from "fs";
import PizZip from "pizzip";

const xml = new PizZip(fs.readFileSync("public/templates/uy_quyen.docx", "binary")).files["word/document.xml"].asText();

const keys = [
  "{ben_a_ho_ten}",
  "{ben_a2_ho_ten}",
  "{ben_b_ho_ten}",
  "{ben_a_bo_sung}",
  "{ben_b_bo_sung}",
  "{ben_a_cccd}",
  "{ben_b_cccd}"
];

for (const key of keys) {
  const idx = xml.indexOf(key);
  console.log("\n===", key, "idx", idx);
  if (idx < 0) continue;
  const start = Math.max(0, idx - 220);
  const end = Math.min(xml.length, idx + 220);
  const chunk = xml.slice(start, end);
  console.log(chunk);
  console.log("contains <w:b/>:", chunk.includes("<w:b/>"));
}
