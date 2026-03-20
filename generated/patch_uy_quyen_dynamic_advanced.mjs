import fs from "fs";
import PizZip from "pizzip";

const file = "e:/Tool/public/templates/uy_quyen.docx";
const zip = new PizZip(fs.readFileSync(file));
let xml = zip.file("word/document.xml").asText();

function replaceAllLiteral(name, from, to) {
  const before = xml;
  xml = xml.split(from).join(to);
  console.log(`${name}: ${before === xml ? "MISS" : "OK"}`);
}

function replaceAllRegex(name, regex, to) {
  const before = xml;
  xml = xml.replace(regex, to);
  console.log(`${name}: ${before === xml ? "MISS" : "OK"}`);
}

function replaceNthRegex(name, regex, to, nth) {
  let n = 0;
  const before = xml;
  xml = xml.replace(regex, (m) => {
    n += 1;
    if (n === nth) {
      return to;
    }
    return m;
  });
  console.log(`${name}: ${before === xml ? "MISS" : "OK"}`);
}

replaceAllLiteral("dia_diem_lap_hop_dong", "Xuân Trường", "{dia_diem_lap_hop_dong}");
replaceAllLiteral("ben_a2_cccd", "036173002988", "{ben_a2_cccd}");
replaceAllLiteral("ubnd_xa_chung_thuc", "UBND xã X", "{ubnd_xa_chung_thuc}");
replaceAllLiteral("nguoi_tiep_nhan_ho_so", "Đỗ Hùng Hoài", "{nguoi_tiep_nhan_ho_so}");
replaceAllLiteral("so_quyen_chung_thuc", "01/2026", "{so_quyen_chung_thuc}");

replaceAllRegex(
  "ben_a_cccd_split",
  /<w:t>03606801<\/w:t><\/w:r><w:r[^>]*>[\s\S]*?<w:t>1111<\/w:t>/g,
  "<w:t>{ben_a_cccd}</w:t>"
);

replaceAllRegex(
  "so_giay_chung_nhan_split",
  /<w:t>O 413<\/w:t><\/w:r><w:r[^>]*>[\s\S]*?<w:t>742<\/w:t>/g,
  "<w:t>{so_giay_chung_nhan}</w:t>"
);

replaceAllRegex(
  "thua_dat_so_split",
  /; tại thửa đất số <\/w:t><\/w:r><w:r[^>]*>[\s\S]*?<w:t>3<\/w:t><\/w:r><w:r[^>]*>[\s\S]*?<w:t>7<\/w:t>/g,
  "; tại thửa đất số {thua_dat_so}</w:t>"
);

replaceAllRegex(
  "to_ban_do_so_split",
  /; tờ bản đồ số tờ bản đồ số <\/w:t><\/w:r><w:r[^>]*>[\s\S]*?<w:t>6<\/w:t><\/w:r><w:r[^>]*>[\s\S]*?<w:t>3<\/w:t>/g,
  "; tờ bản đồ số tờ bản đồ số {to_ban_do_so}</w:t>"
);

const addressPattern = /Nơi thường trú: xã <\/w:t><\/w:r><w:r[^>]*>[\s\S]*?<w:t>X<\/w:t><\/w:r><w:r[^>]*>[\s\S]*?<w:t>, tỉnh Ninh Bình\./g;
replaceNthRegex("ben_a_dia_chi_split", addressPattern, "Nơi thường trú: {ben_a_dia_chi}.", 1);
replaceNthRegex("ben_a2_dia_chi_split", addressPattern, "Nơi thường trú: {ben_a2_dia_chi}.", 1);
replaceNthRegex("ben_b_dia_chi_split", addressPattern, "Nơi thường trú: {ben_b_dia_chi}.", 1);

replaceAllRegex(
  "dia_diem_chung_thuc_split",
  /Tại: UBND xã <\/w:t><\/w:r><w:r[^>]*>[\s\S]*?<w:t>X<\/w:t><\/w:r><w:r[^>]*>[\s\S]*?<w:t>, tỉnh Ninh Bình\./g,
  "Tại: {dia_diem_chung_thuc}."
);

replaceAllRegex(
  "nguoi_thuc_hien_chung_thuc_split",
  /Tôi: \{nguoi_thuc_hien_chung_thuc\} - PCT UBND xã <\/w:t><\/w:r><w:r[^>]*>[\s\S]*?<w:t>X<\/w:t><\/w:r><w:r[^>]*>[\s\S]*?<w:t>, tỉnh Ninh Bình\./g,
  "Tôi: {nguoi_thuc_hien_chung_thuc}."
);

replaceAllRegex(
  "nguoi_thuc_hien_chung_thuc_name_only",
  /Phạm Ngọc Vinh/g,
  "{nguoi_thuc_hien_chung_thuc}"
);

zip.file("word/document.xml", xml);
fs.writeFileSync(file, zip.generate({ type: "nodebuffer" }));
console.log("UY_QUYEN_DYNAMIC_ADVANCED_PATCH_DONE");
