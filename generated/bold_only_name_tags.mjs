import fs from "fs";
import PizZip from "pizzip";

const filePath = "public/templates/uy_quyen.docx";
const zip = new PizZip(fs.readFileSync(filePath, "binary"));
let xml = zip.files["word/document.xml"].asText();

const nameTags = ["{ben_a_ho_ten}", "{ben_a2_ho_ten}", "{ben_b_ho_ten}"];
let changed = 0;

for (const tag of nameTags) {
  const re = new RegExp(
    `<w:rPr>([\\s\\S]*?)<\\/w:rPr><w:t>${tag.replace(/[{}]/g, "\\$&")}<\\/w:t>`,
    "g"
  );

  xml = xml.replace(re, (_m, rpr) => {
    let next = rpr;
    if (!next.includes("<w:b/>")) {
      next += "<w:b/>";
    }
    if (!next.includes("<w:bCs/>")) {
      next += "<w:bCs/>";
    }
    changed += 1;
    return `<w:rPr>${next}</w:rPr><w:t>${tag}</w:t>`;
  });
}

zip.file("word/document.xml", xml);
fs.writeFileSync(filePath, zip.generate({ type: "nodebuffer" }));
console.log("Name-tag bold updates:", changed);
