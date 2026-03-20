import fs from "fs";
import PizZip from "pizzip";

const filePath = "public/templates/uy_quyen.docx";
const zip = new PizZip(fs.readFileSync(filePath, "binary"));
let xml = zip.files["word/document.xml"].asText();

let changed = 0;

function unboldTagRun(tag) {
  const re = new RegExp(
    `<w:rPr>([\\s\\S]*?)<\\/w:rPr><w:t>${tag.replace(/[{}]/g, "\\$&")}<\\/w:t>`,
    "g"
  );

  xml = xml.replace(re, (_m, rpr) => {
    const cleaned = rpr
      .replace(/<w:b\/>/g, "")
      .replace(/<w:bCs\/>/g, "");
    changed += 1;
    return `<w:rPr>${cleaned}</w:rPr><w:t>${tag}</w:t>`;
  });
}

unboldTagRun("{ben_a_bo_sung}");
unboldTagRun("{ben_b_bo_sung}");

zip.file("word/document.xml", xml);
fs.writeFileSync(filePath, zip.generate({ type: "nodebuffer" }));

console.log("Updated run count:", changed);
