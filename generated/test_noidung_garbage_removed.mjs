import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

const templatePath = "e:/Tool/public/templates/uy_quyen.docx";
const outputPath = "e:/Tool/generated/uy_quyen_noidung_clean_test.docx";

const payload = {
  dia_diem_lap_hop_dong: "Xuan Truong",
  ben_a_ho_ten: "Nguyen Van A",
  ben_a_ngay_sinh: "01/01/1970",
  ben_a_cccd: "012345678901",
  ben_a_ngay_cap: "02/01/2020",
  ben_a_dia_chi: "Xa Xuan Truong",
  ben_a2_ho_ten: "Tran Thi B",
  ben_a2_ngay_sinh: "03/02/1975",
  ben_a2_cccd: "098765432109",
  ben_a2_ngay_cap: "04/03/2021",
  ben_a2_dia_chi: "TP Ninh Binh",
  ben_b_ho_ten: "Le Thi D",
  ben_b_ngay_sinh: "07/08/1990",
  ben_b_cccd: "111122223333",
  ben_b_ngay_cap: "06/05/2022",
  ben_b_dia_chi: "Ha Noi",
  ben_a_bo_sung: "",
  ben_b_bo_sung: "",
  ben_chung_thuc_bo_sung: "",
  so_giay_chung_nhan: "AB 123456",
  so_vao_so: "QSDD/001/2026",
  co_quan_cap_gcn: "UBND huyen Hoa Lu",
  ngay_cap_gcn: "07/06/2018",
  thua_dat_so: "89",
  to_ban_do_info: "to ban do so 45",
  dien_tich_loai_dat: "dien tich 500m2 ONT",
  noi_dung_uy_quyen: "aaaaaaaaaa",
  ubnd_xa_chung_thuc: "UBND xa Xuan Truong",
  nguoi_thuc_hien_chung_thuc: "Pham Van D",
  nguoi_tiep_nhan_ho_so: "Do Thi E"
};

const doc = new Docxtemplater(new PizZip(fs.readFileSync(templatePath)), {
  paragraphLoop: true,
  linebreaks: true
});
doc.render(payload);
fs.writeFileSync(outputPath, doc.getZip().generate({ type: "nodebuffer" }));

const outXml = new PizZip(fs.readFileSync(outputPath, "binary")).files["word/document.xml"].asText();
const text = (outXml.match(/<w:t[^>]*>[^<]*<\/w:t>/g) || []).map((t) => t.replace(/<[^>]+>/g, "")).join(" ");

console.log("WROTE", outputPath);
console.log("Has 'NỘI DUNG UỶ QUYỀN aaaaaaaaaa':", text.includes("NỘI DUNG UỶ QUYỀN aaaaaaaaaa"));
console.log("Has 'aaaaaaaaaa' anywhere:", text.includes("aaaaaaaaaa"));
