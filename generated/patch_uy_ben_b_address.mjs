import fs from "fs";
import PizZip from "pizzip";

const file = "e:/Tool/public/templates/uy_quyen.docx";
const zip = new PizZip(fs.readFileSync(file));
let xml = zip.file("word/document.xml").asText();

const before = xml;
xml = xml.replace(
  /(BÊN ĐƯỢC UỶ QUYỀN \(Bên B\):[\s\S]*?Nơi thường trú: )xã <\/w:t><\/w:r><w:r[^>]*>[\s\S]*?<w:t>X<\/w:t><\/w:r><w:r[^>]*>[\s\S]*?<w:t>, tỉnh Ninh Bình\./,
  "$1{ben_b_dia_chi}."
);

console.log(before === xml ? "ben_b_dia_chi: MISS" : "ben_b_dia_chi: OK");
zip.file("word/document.xml", xml);
fs.writeFileSync(file, zip.generate({ type: "nodebuffer" }));
