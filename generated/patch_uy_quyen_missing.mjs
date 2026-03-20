import fs from "fs";
import PizZip from "pizzip";

const file = "e:/Tool/public/templates/uy_quyen.docx";
const zip = new PizZip(fs.readFileSync(file));
let xml = zip.file("word/document.xml").asText();

function replaceAll(name, from, to) {
  const before = xml;
  xml = xml.split(from).join(to);
  console.log(`${name}: ${before === xml ? "MISS" : "OK"}`);
}

replaceAll("ben_b_cccd_hardcode", "036196019000", "{ben_b_cccd}");
replaceAll("ben_a2_dia_chi_ref_fix", "Nơi thường trú: {ben_a_dia_chi}.Bà:", "Nơi thường trú: {ben_a2_dia_chi}.Bà:");

replaceAll("ubnd_xa_chung_thuc_para2", "Tại: UBND xã X, tỉnh Ninh Bình.", "Tại: {ubnd_xa_chung_thuc}.");
replaceAll("ubnd_xa_chung_thuc_para3", "Tôi: {nguoi_thuc_hien_chung_thuc} - PCT UBND xã X, tỉnh Ninh Bình.", "Tôi: {nguoi_thuc_hien_chung_thuc}.");

zip.file("word/document.xml", xml);
fs.writeFileSync(file, zip.generate({ type: "nodebuffer" }));
console.log("UY_QUYEN_MISSING_PATCH_DONE");
