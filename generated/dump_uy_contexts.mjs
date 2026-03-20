import fs from "fs";
import PizZip from "pizzip";

const xml = new PizZip(fs.readFileSync("public/templates/uy_quyen.docx", "binary")).files["word/document.xml"].asText();

function show(label, needle, span = 700) {
  const idx = xml.indexOf(needle);
  console.log(`\n=== ${label} ===`);
  console.log("index:", idx);
  if (idx < 0) return;
  const start = Math.max(0, idx - span);
  const end = Math.min(xml.length, idx + span);
  console.log(xml.slice(start, end));
}

show("MAP", "{to_ban_do_so}");
show("BEN B CAP", "{ben_b_ngay_cap}");
show("HOANG", "Hoàng Văn C");
