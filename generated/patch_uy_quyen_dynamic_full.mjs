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
  let seen = 0;
  const before = xml;
  xml = xml.replace(regex, (m) => {
    seen += 1;
    if (seen === nth) {
      return to;
    }
    return m;
  });
  console.log(`${name}: ${before === xml ? "MISS" : "OK"}`);
}

replaceAllLiteral("dia_diem_lap_hop_dong", "Xuân Trường", "{dia_diem_lap_hop_dong}");
replaceAllLiteral("ben_a_ngay_sinh", "01/01/1968", "{ben_a_ngay_sinh}");
replaceAllLiteral("ben_a_ngay_cap", "26/11/2025", "{ben_a_ngay_cap}");
replaceAllLiteral("ben_a2_ho_ten", "VŨ THỊ L", "{ben_a2_ho_ten}");
replaceAllLiteral("ben_a2_ngay_sinh", "11/3/1973", "{ben_a2_ngay_sinh}");
replaceAllLiteral("ben_a2_cccd", "036173002988", "{ben_a2_cccd}");
replaceAllLiteral("ben_a2_ngay_cap", "02/07/2021", "{ben_a2_ngay_cap}");
replaceAllLiteral("ben_b_ngay_sinh", "12/11/1996", "{ben_b_ngay_sinh}");
replaceAllLiteral("ben_b_ngay_cap", "20/6/2023", "{ben_b_ngay_cap}");
replaceAllLiteral("ben_a_ho_ten_repeat", "Hoàng Văn C", "{ben_a_ho_ten}");
replaceAllLiteral("ben_b_ho_ten_repeat", "Bùi Thu Q", "{ben_b_ho_ten}");
replaceAllLiteral("ben_b_ho_ten_repeat_ascii", "Bui Thu Q", "{ben_b_ho_ten}");
replaceAllLiteral("so_vao_so", "QSDĐ/932/QĐUB", "{so_vao_so}");
replaceAllLiteral("so_quyen_chung_thuc", "01/2026 -SCT/GD/.", "{so_quyen_chung_thuc}");
replaceAllLiteral("ubnd_xa_chung_thuc", "UBND xã X", "{ubnd_xa_chung_thuc}");
replaceAllLiteral("nguoi_tiep_nhan_ho_so", "Đỗ Hùng Hoài", "{nguoi_tiep_nhan_ho_so}");
replaceAllLiteral("nguoi_thuc_hien_chung_thuc_name", "Phạm Ngọc Vinh", "{nguoi_thuc_hien_chung_thuc}");

replaceAllLiteral(
  "co_quan_cap_gcn_and_ngay",
  "Uỷ ban nhân dân huyện X, tỉnh Nam Định cấp ngày 20/11/1998",
  "{co_quan_cap_gcn} cấp ngày {ngay_cap_gcn}"
);

replaceAllRegex(
  "so_giay_chung_nhan_split",
  />O 413<\/w:t><\/w:r><w:r[^>]*>[\s\S]*?<w:t>742</g,
  ">{so_giay_chung_nhan}<"
);

replaceAllRegex(
  "thua_dat_so_split",
  />3<\/w:t><\/w:r><w:r[^>]*>[\s\S]*?<w:t>7</g,
  ">{thua_dat_so}<"
);

replaceAllRegex(
  "to_ban_do_so_split",
  />6<\/w:t><\/w:r><w:r[^>]*>[\s\S]*?<w:t>3</g,
  ">{to_ban_do_so}<"
);

replaceNthRegex(
  "ben_a2_dia_chi_split",
  /Nơi thường trú: xã <\/w:t><\/w:r><w:r[^>]*>[\s\S]*?<w:t>X<\/w:t><\/w:r><w:r[^>]*>[\s\S]*?<w:t>, tỉnh Ninh Bình\./g,
  "Nơi thường trú: {ben_a2_dia_chi}.",
  1
);

replaceAllRegex(
  "dia_diem_chung_thuc_split",
  /Tại: UBND xã <\/w:t><\/w:r><w:r[^>]*>[\s\S]*?<w:t>X<\/w:t><\/w:r><w:r[^>]*>[\s\S]*?<w:t>, tỉnh Ninh Bình\./g,
  "Tại: {dia_diem_chung_thuc}."
);

replaceAllRegex(
  "nguoi_thuc_hien_chung_thuc_full",
  /Tôi: \{nguoi_thuc_hien_chung_thuc\} - PCT UBND xã <\/w:t><\/w:r><w:r[^>]*>[\s\S]*?<w:t>X<\/w:t><\/w:r><w:r[^>]*>[\s\S]*?<w:t>, tỉnh Ninh Bình\./g,
  "Tôi: {nguoi_thuc_hien_chung_thuc}."
);

zip.file("word/document.xml", xml);
fs.writeFileSync(file, zip.generate({ type: "nodebuffer" }));
console.log("UY_QUYEN_DYNAMIC_XML_PATCH_DONE");
