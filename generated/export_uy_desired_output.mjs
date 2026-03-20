import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { buildUyQuyenPayload } from "../src/utils/buildTemplatePayload.js";

const templatePath = "e:/Tool/public/templates/uy_quyen.docx";
const outputPath = "e:/Tool/generated/uy_quyen_desired_output.docx";

const inputData = {
  dia_diem_lap_hop_dong: "AAAAAAa",
  ds_ben_a: [
    { xung_ho: "Ông", ho_ten: "èw", ngay_sinh: "è", cccd: "èw", ngay_cap: "è", dia_chi: "re" },
    { xung_ho: "Ông", ho_ten: "uerwer", ngay_sinh: "üre", cccd: "rưre", ngay_cap: "rewrư", dia_chi: "rừ" },
    { xung_ho: "Bà", ho_ten: "rewrwe", ngay_sinh: "rewre", cccd: "rewr", ngay_cap: "èwerw", dia_chi: "èwrewr" }
  ],
  ds_ben_b: [
    { xung_ho: "Ông", ho_ten: "èw", ngay_sinh: "rew", cccd: "èwr", ngay_cap: "rew", dia_chi: "ewr" },
    { xung_ho: "Bà", ho_ten: "üerwe", ngay_sinh: "rewrwe", cccd: "rewrew", ngay_cap: "rew", dia_chi: "ewrewr" }
  ],
  so_giay_chung_nhan: "AAAAAA",
  so_vao_so: "AAAAAAA",
  co_quan_cap_gcn: "AAAAAA",
  ngay_cap_gcn: "AAAAA",
  thua_dat_so: "AAAAA",
  to_ban_do_info: "tọ ban đồ số AAAAA",
  dien_tich_loai_dat: "diện tích AAAAA m2, loại đất AAAAA",
  noi_dung_uy_quyen: "",
  ubnd_xa_chung_thuc: "UBND xã AAAAA",
  nguoi_thuc_hien_chung_thuc: "AAAAA",
  nguoi_tiep_nhan_ho_so: "AAAAA"
};

const payload = buildUyQuyenPayload(inputData);
const doc = new Docxtemplater(new PizZip(fs.readFileSync(templatePath)), {
  paragraphLoop: true,
  linebreaks: true
});

doc.render(payload);
fs.writeFileSync(outputPath, doc.getZip().generate({ type: "nodebuffer" }));

console.log("WROTE", outputPath);
