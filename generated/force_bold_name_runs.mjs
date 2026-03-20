import fs from "fs";
import PizZip from "pizzip";

const filePath = "public/templates/uy_quyen.docx";
const zip = new PizZip(fs.readFileSync(filePath, "binary"));
let xml = zip.files["word/document.xml"].asText();

let changed = 0;

function forceBold(tag) {
  const pattern = new RegExp(`(<w:rPr>[\\s\\S]*?)(<\\/w:rPr><w:t>${tag.replace(/[{}]/g, "\\$&")}<\\/w:t>)`, "g");
  xml = xml.replace(pattern, (_m, p1, p2) => {
    let rpr = p1;
    if (!rpr.includes("<w:b/>")) rpr += "<w:b/>";
    if (!rpr.includes("<w:bCs/>")) rpr += "<w:bCs/>";
    changed += 1;
    return `${rpr}${p2}`;
  });
}

forceBold("{ben_a_ho_ten}");
forceBold("{ben_a2_ho_ten}");
forceBold("{ben_b_ho_ten}");

zip.file("word/document.xml", xml);
fs.writeFileSync(filePath, zip.generate({ type: "nodebuffer" }));
console.log("force-bold replacements:", changed);
