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

function replaceNth(name, from, to, nth) {
  let fromIndex = 0;
  let found = -1;
  for (let i = 1; i <= nth; i += 1) {
    found = xml.indexOf(from, fromIndex);
    if (found === -1) {
      console.log(`${name}: MISS`);
      return;
    }
    fromIndex = found + from.length;
  }
  xml = xml.slice(0, found) + to + xml.slice(found + from.length);
  console.log(`${name}: OK`);
}

replaceAll("ben_a_ngay_sinh", "01/01/1968", "{ben_a_ngay_sinh}");
replaceAll("ben_a_cccd", "036068011111", "{ben_a_cccd}");
replaceAll("ben_a_ngay_cap", "26/11/2025", "{ben_a_ngay_cap}");
replaceAll("ben_a2_ho_ten", "VŨ THỊ L", "{ben_a2_ho_ten}");
replaceAll("ben_a2_ngay_sinh", "11/3/1973", "{ben_a2_ngay_sinh}");
replaceAll("ben_a2_ngay_cap", "02/07/2021", "{ben_a2_ngay_cap}");
replaceAll("ben_b_ngay_sinh", "12/11/1996", "{ben_b_ngay_sinh}");
replaceAll("ben_b_ngay_cap", "20/6/2023", "{ben_b_ngay_cap}");

replaceNth("ben_a_dia_chi", "xã X, tỉnh Ninh Bình.", "{ben_a_dia_chi}.", 1);
replaceNth("ben_a2_dia_chi", "xã X, tỉnh Ninh Bình.", "{ben_a2_dia_chi}.", 1);
replaceNth("ben_b_dia_chi", "xã X, tỉnh Ninh Bình.", "{ben_b_dia_chi}.", 1);

replaceAll("so_giay_chung_nhan", "O 413742", "{so_giay_chung_nhan}");
replaceAll("so_vao_so", "QSDĐ/932/QĐUB", "{so_vao_so}");
replaceAll("co_quan_cap_gcn", "Uỷ ban nhân dân huyện X, tỉnh Nam Định", "{co_quan_cap_gcn}");
replaceAll("ngay_cap_gcn", "20/11/1998", "{ngay_cap_gcn}");
replaceAll("thua_dat_so", "thửa đất số 37", "thửa đất số {thua_dat_so}");
replaceAll("dia_diem_chung_thuc", "Tại: UBND xã X, tỉnh Ninh Bình.", "Tại: {dia_diem_chung_thuc}.");
replaceAll("so_quyen_chung_thuc", "01/2026 -SCT/GD/.", "{so_quyen_chung_thuc}");

zip.file("word/document.xml", xml);
fs.writeFileSync(file, zip.generate({ type: "nodebuffer" }));
console.log("UY_QUYEN_DYNAMIC_SAFE_PATCH_DONE");
