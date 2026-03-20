import fs from "fs";
import PizZip from "pizzip";

const filePath = "public/templates/uy_quyen.docx";
const zip = new PizZip(fs.readFileSync(filePath, "binary"));
let xml = zip.files["word/document.xml"].asText();

let total = 0;

function forceBoldRun(tag) {
  const safe = tag.replace(/[{}]/g, "\\$&");
  const re = new RegExp(`(<w:r[^>]*><w:rPr>)([\\s\\S]*?)(<\\/w:rPr><w:t>${safe}<\\/w:t><\\/w:r>)`, "g");
  xml = xml.replace(re, (_m, p1, p2, p3) => {
    let rpr = p2;
    if (!rpr.includes("<w:b/>")) rpr += "<w:b/>";
    if (!rpr.includes("<w:bCs/>")) rpr += "<w:bCs/>";
    total += 1;
    return `${p1}${rpr}${p3}`;
  });
}

forceBoldRun("{ben_a_ho_ten}");
forceBoldRun("{ben_a2_ho_ten}");
forceBoldRun("{ben_b_ho_ten}");

zip.file("word/document.xml", xml);
fs.writeFileSync(filePath, zip.generate({ type: "nodebuffer" }));
console.log("strict bold-updated runs:", total);
