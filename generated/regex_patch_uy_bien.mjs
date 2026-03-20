import fs from "fs";
import PizZip from "pizzip";

function patch(filePath, mutator) {
  const zip = new PizZip(fs.readFileSync(filePath));
  let xml = zip.file("word/document.xml").asText();
  xml = mutator(xml);
  zip.file("word/document.xml", xml);
  fs.writeFileSync(filePath, zip.generate({ type: "nodebuffer" }));
}

function applyRegex(xml, name, regex, replacement) {
  const next = xml.replace(regex, replacement);
  console.log(`${name}: ${next === xml ? "MISS" : "OK"}`);
  return next;
}

patch("e:/Tool/public/templates/bien_dong.docx", (xml) => {
  console.log("\n[bien_dong regex patch]");
  let out = xml;
  out = applyRegex(out, "ho_ten", /a\) Tên\(2\):[\s\S]*?b\) Giấy tờ nhân thân\/pháp nhân\(2\):/, "a) Tên(2): {ho_ten}b) Giấy tờ nhân thân/pháp nhân(2):");
  out = applyRegex(out, "giay_to", /b\) Giấy tờ nhân thân\/pháp nhân\(2\):[\s\S]*?c\) Địa chỉ\(2\):/, "b) Giấy tờ nhân thân/pháp nhân(2): {giay_to_nhan_than}c) Địa chỉ(2):");
  out = applyRegex(out, "dia_chi", /c\) Địa chỉ\(2\):[\s\S]*?d\) Điện thoại liên hệ \(nếu có\):/, "c) Địa chỉ(2): {dia_chi}.d) Điện thoại liên hệ (nếu có):");
  out = applyRegex(out, "insert_so_gcn", /2\. Nội dung biến động \(3\):/, "2. Nội dung biến động (3): Số giấy chứng nhận: {so_giay_chung_nhan}.");
  out = applyRegex(out, "noi_dung", /- Nhận thừa kế QSDĐ/, "- {noi_dung_bien_dong}");
  out = applyRegex(out, "thua_to_dien_tich", /- Thửa đất số[\s\S]*?- Địa chỉ thửa đất:/, "- Thửa đất số {thua_dat_so} tờ bản đồ số: {to_ban_do_so}, diện tích: {dien_tich} m2.- Địa chỉ thửa đất:");
  out = applyRegex(out, "sign_name", /\{ho_ten\}|Hoàng Văn C/g, "{ho_ten}");
  return out;
});

patch("e:/Tool/public/templates/uy_quyen.docx", (xml) => {
  console.log("\n[uy_quyen regex patch]");
  let out = xml;
  out = applyRegex(out, "ben_a_name", /BÊN UỶ QUYỀN \(Bên A\):Ông:[\s\S]*?Ngày sinh:/, "BÊN UỶ QUYỀN (Bên A):Ông: {ben_a_ho_ten}                      Ngày sinh:");
  out = applyRegex(out, "ben_a_cccd", /Căn cước số:[\s\S]*?, do/, "Căn cước số: {ben_a_cccd}, do");
  out = applyRegex(out, "ben_a_dia_chi", /Nơi thường trú:[\s\S]*?Bà:/, "Nơi thường trú: {ben_a_dia_chi}.Bà:");
  out = applyRegex(out, "ben_b_block", /BÊN ĐƯỢC UỶ QUYỀN \(Bên B\):[\s\S]*?Bằng hợp đồng này/, "BÊN ĐƯỢC UỶ QUYỀN (Bên B):Bà: {ben_b_ho_ten}                           Ngày sinh:CCCD số: {ben_b_cccd}, do Cục cảnh sát QLHC về TTXH, cấp ngày:. Nơi thường trú: {ben_b_dia_chi}.Bằng hợp đồng này");
  out = applyRegex(out, "noi_dung_uy_quyen", /ĐIỀU 2: NỘI DUNG UỶ QUYỀN/, "ĐIỀU 2: NỘI DUNG UỶ QUYỀN {noi_dung_uy_quyen}");
  return out;
});

console.log("\nRegex patch complete.");
