import fs from "fs";
import PizZip from "pizzip";

const path = "public/templates/uy_quyen.docx";
const zip = new PizZip(fs.readFileSync(path, "binary"));
let xml = zip.files["word/document.xml"].asText();

const ops = [];
function rep(from, to, label) {
  const before = xml;
  xml = xml.replace(from, to);
  if (xml !== before) ops.push(label);
}

// 1) Restore simplified land fields requested by user
rep(/;\s*tờ bản đồ số tờ bản đồ số\s*\{to_ban_do_so\}/g, "; {to_ban_do_info}", "to_ban_do_info");
rep(/\(tờ bản đồ số\s*/g, "", "remove map-note prefix");
rep(/\)\s*bản đồ địa chính xã chỉnh lý năm\s*2025;\s*diện tích\s*/g, "; {dien_tich_loai_dat}", "dien_tich_loai_dat");
rep(/\b04\b/g, "", "remove hardcoded 04");
rep(/\s*bản đồ địa chính xã Xuân P cũ\s*/g, "", "remove hardcoded xa note");
rep(/\b270\b/g, "", "remove hardcoded 270");
rep(/\s*loại đất \(ONT\s*/g, "", "remove hardcoded ONT part");
rep(/\{to_ban_do_so\}/g, "{to_ban_do_info}", "rename leftover to_ban_do_so");

// 2) Add ben_b_dia_chi right after ben_b_ngay_cap sentence
rep(/\{ben_b_ngay_cap\}<\/w:t><\/w:r><w:r[^>]*><w:rPr>[\s\S]*?<w:t>\.\s*[^<]*<\/w:t><\/w:r><\/w:p>/,
  (m) => m.replace(/<\/w:p>$/, '<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="25"/><w:szCs w:val="25"/></w:rPr><w:t xml:space="preserve"> Nơi thường trú: {ben_b_dia_chi}.</w:t></w:r></w:p>'),
  "add ben_b_dia_chi");

// 3) Remove hardcoded names in certification section
rep(/Hoàng Văn C/g, "{ben_a_ho_ten}", "cert ben_a name");
rep(/Vũ Thị L/g, "{ben_a2_ho_ten}", "cert ben_a2 name");
rep(/Bùi Thu Q/g, "{ben_b_ho_ten}", "cert ben_b name");

zip.file("word/document.xml", xml);
fs.writeFileSync(path, zip.generate({ type: "nodebuffer" }));

console.log("Applied ops:", ops.length ? ops.join(", ") : "none");
