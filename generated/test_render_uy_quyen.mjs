import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

const templatePath = "e:/Tool/public/templates/uy_quyen.docx";
const outputPath = "e:/Tool/generated/uy_quyen_render_test.docx";

const data = {
  dia_diem_lap_hop_dong: "Xuan Truong",
  ben_a_ho_ten: "Nguyen Van A",
  ben_a_ngay_sinh: "01/01/1970",
  ben_a_cccd: "012345678901",
  ben_a_ngay_cap: "02/01/2020",
  ben_a_dia_chi: "Xa Xuan Truong, Ninh Binh",
  ben_a2_ho_ten: "Tran Thi B",
  ben_a2_ngay_sinh: "03/02/1975",
  ben_a2_cccd: "098765432109",
  ben_a2_ngay_cap: "04/03/2021",
  ben_b_ho_ten: "Le Van C",
  ben_b_ngay_sinh: "05/04/1990",
  ben_b_cccd: "111122223333",
  ben_b_ngay_cap: "06/05/2022",
  so_giay_chung_nhan: "AB 123456",
  so_vao_so: "QSDD/001/2026",
  co_quan_cap_gcn: "UBND huyen Hoa Lu, tinh Ninh Binh",
  ngay_cap_gcn: "07/06/2018",
  thua_dat_so: "89",
  to_ban_do_so: "12",
  noi_dung_uy_quyen: "thuc hien thu tuc bien dong theo quy dinh",
  ubnd_xa_chung_thuc: "UBND xa Xuan Truong",
  nguoi_thuc_hien_chung_thuc: "Pham Van D",
  nguoi_tiep_nhan_ho_so: "Do Thi E"
};

const content = fs.readFileSync(templatePath);
const zip = new PizZip(content);
const doc = new Docxtemplater(zip, {
  paragraphLoop: true,
  linebreaks: true
});

doc.render(data);

const buf = doc.getZip().generate({ type: "nodebuffer" });
fs.writeFileSync(outputPath, buf);
console.log(`WROTE ${outputPath}`);
