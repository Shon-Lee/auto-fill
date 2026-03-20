import fs from "fs";
import PizZip from "pizzip";

const xml = new PizZip(fs.readFileSync("public/templates/uy_quyen.docx", "binary")).files["word/document.xml"].asText();

function list(tag) {
  const re = new RegExp(`<w:r[^>]*><w:rPr>([\\s\\S]*?)<\\/w:rPr><w:t>${tag.replace(/[{}]/g, "\\$&")}<\\/w:t><\\/w:r>`, "g");
  let m;
  let i = 0;
  while ((m = re.exec(xml)) !== null) {
    i += 1;
    const rpr = m[1];
    console.log(`${tag} #${i}:`, rpr.includes("<w:b/>") ? "BOLD" : "NORMAL");
  }
}

list("{ben_a_ho_ten}");
list("{ben_a2_ho_ten}");
list("{ben_b_ho_ten}");
