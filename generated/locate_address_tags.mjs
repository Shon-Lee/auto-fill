import fs from "fs";
import PizZip from "pizzip";

const xml = new PizZip(fs.readFileSync("public/templates/uy_quyen.docx", "binary")).files["word/document.xml"].asText();

function show(tag) {
  const i = xml.indexOf(tag);
  console.log("\n===", tag, "index", i);
  if (i < 0) return;
  console.log(xml.slice(Math.max(0, i - 350), Math.min(xml.length, i + 450)));
}

show("{ben_a_dia_chi}");
show("{ben_b_dia_chi}");
show("Nơi thường trú:");
