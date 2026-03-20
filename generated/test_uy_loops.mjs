import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

const templatePath = "e:/Tool/public/templates/uy_quyen.docx";
const outputPath = "e:/Tool/generated/uy_quyen_loops_test.docx";

const data = {
  dia_diem_lap_hop_dong: "Xuan Truong",
  ds_ben_a: [
    {
      xung_ho: "Ông",
      ho_ten: "Nguyen Van A",
      ngay_sinh: "01/01/1970",
      cccd: "012345678901",
      ngay_cap: "02/01/2020",
      dia_chi: "Xa Xuan Truong, Ninh Binh"
    },
    {
      xung_ho: "Bà",
      ho_ten: "Tran Thi B",
      ngay_sinh: "03/02/1975",
      cccd: "098765432109",
      ngay_cap: "04/03/2021",
      dia_chi: "Phuong Nam Tu Liem, Ha Noi"
    }
  ],
  ds_ben_b: [
    {
      xung_ho: "Bà",
      ho_ten: "Le Van C",
      ngay_sinh: "05/04/1990",
      cccd: "111122223333",
      ngay_cap: "06/05/2022",
      dia_chi: "Ho Chi Minh City"
    }
  ],
  so_giay_chung_nhan: "AB 123456",
  so_vao_so: "QSDD/001/2026",
  co_quan_cap_gcn: "UBND huyen Hoa Lu",
  ngay_cap_gcn: "07/06/2018",
  thua_dat_so: "89",
  to_ban_do_info: "Tờ bản đồ số 45, bản đồ địa chính xã Xuan Truong chỉnh lý năm 2024",
  dien_tich_loai_dat: "diện tích 500 m2, loại đất nông nghiệp (NN)",
  noi_dung_uy_quyen: "thực hiện thủ tục biến động theo quy định",
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

try {
  doc.render(data);
  const buf = doc.getZip().generate({ type: "nodebuffer" });
  fs.writeFileSync(outputPath, buf);
  console.log(`✅ WROTE ${outputPath}`);
  console.log("\nTest data:");
  console.log("  ds_ben_a: 2 people");
  console.log("    1. Ông Nguyen Van A");
  console.log("    2. Bà Tran Thi B");
  console.log("  ds_ben_b: 1 person");
  console.log("    1. Bà Le Van C");
} catch (error) {
  console.error("❌ Render failed:", error.message);
  if (error.properties && error.properties.errors) {
    error.properties.errors.forEach(err => {
      console.error("  -", err.message);
    });
  }
}
