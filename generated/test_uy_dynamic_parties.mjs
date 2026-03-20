import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

const templatePath = "e:/Tool/public/templates/uy_quyen.docx";
const outputPath = "e:/Tool/generated/uy_quyen_dynamic_parties_test.docx";

const inputData = {
  dia_diem_lap_hop_dong: "Xuan Truong",
  ds_ben_a: [
    { xung_ho: "Ông", ho_ten: "Nguyen Van A", ngay_sinh: "01/01/1970", cccd: "012345678901", ngay_cap: "02/01/2020", dia_chi: "Xa Xuan Truong" },
    { xung_ho: "Bà", ho_ten: "Tran Thi B", ngay_sinh: "03/02/1975", cccd: "098765432109", ngay_cap: "04/03/2021", dia_chi: "TP Ninh Binh" },
    { xung_ho: "Ông", ho_ten: "Pham Van C", ngay_sinh: "05/06/1980", cccd: "012301230123", ngay_cap: "01/01/2022", dia_chi: "Tam Diep" }
  ],
  ds_ben_b: [
    { xung_ho: "Bà", ho_ten: "Le Thi D", ngay_sinh: "07/08/1990", cccd: "111122223333", ngay_cap: "06/05/2022", dia_chi: "Ha Noi" },
    { xung_ho: "Ông", ho_ten: "Do Van E", ngay_sinh: "09/10/1988", cccd: "444455556666", ngay_cap: "02/02/2023", dia_chi: "Nam Dinh" }
  ],
  so_giay_chung_nhan: "AB 123456",
  so_vao_so: "QSDD/001/2026",
  co_quan_cap_gcn: "UBND huyen Hoa Lu",
  ngay_cap_gcn: "07/06/2018",
  thua_dat_so: "89",
  to_ban_do_info: "tờ bản đồ số 45, bản đồ địa chính xã Xuân Trường chỉnh lý năm 2024",
  dien_tich_loai_dat: "diện tích 500 m2, loại đất ở nông thôn (ONT)",
  noi_dung_uy_quyen: "thực hiện thủ tục biến động theo quy định",
  ubnd_xa_chung_thuc: "UBND xã Xuân Trường",
  nguoi_thuc_hien_chung_thuc: "Pham Van D",
  nguoi_tiep_nhan_ho_so: "Do Thi E"
};

function buildUyPayload(data) {
  const benA = Array.isArray(data.ds_ben_a) ? data.ds_ben_a : [];
  const benB = Array.isArray(data.ds_ben_b) ? data.ds_ben_b : [];
  const a1 = benA[0] || {};
  const a2 = benA[1] || {};
  const b1 = benB[0] || {};

  const benABoSung = benA
    .slice(2)
    .map((p, i) => `\n${i + 3}. ${p.xung_ho || "Ông/Bà"}: ${p.ho_ten || ""}, ngày sinh ${p.ngay_sinh || ""}, CCCD số ${p.cccd || ""}, cấp ngày ${p.ngay_cap || ""}. Nơi thường trú: ${p.dia_chi || ""}.`)
    .join("");
  const benBBoSung = benB
    .slice(1)
    .map((p, i) => `\n${i + 2}. ${p.xung_ho || "Ông/Bà"}: ${p.ho_ten || ""}, ngày sinh ${p.ngay_sinh || ""}, CCCD số ${p.cccd || ""}, cấp ngày ${p.ngay_cap || ""}. Nơi thường trú: ${p.dia_chi || ""}.`)
    .join("");
  const benChungThucBoSung = [
    ...benA.slice(2).map((p) => `\nBên A bổ sung: ${p.xung_ho || "Ông/Bà"}: ${p.ho_ten || ""} - CCCD số: ${p.cccd || ""}`),
    ...benB.slice(1).map((p) => `\nBên B bổ sung: ${p.xung_ho || "Ông/Bà"}: ${p.ho_ten || ""} - CCCD số: ${p.cccd || ""}`)
  ].join("");

  return {
    ...data,
    ben_a_xung_ho: a1.xung_ho || "Ông",
    ben_a_ho_ten: a1.ho_ten || "",
    ben_a_ngay_sinh: a1.ngay_sinh || "",
    ben_a_cccd: a1.cccd || "",
    ben_a_ngay_cap: a1.ngay_cap || "",
    ben_a_dia_chi: a1.dia_chi || "",
    ben_a2_xung_ho: a2.xung_ho || "Bà",
    ben_a2_ho_ten: a2.ho_ten || "",
    ben_a2_ngay_sinh: a2.ngay_sinh || "",
    ben_a2_cccd: a2.cccd || "",
    ben_a2_ngay_cap: a2.ngay_cap || "",
    ben_a2_dia_chi: a2.dia_chi || "",
    ben_b_xung_ho: b1.xung_ho || "Bà",
    ben_b_ho_ten: b1.ho_ten || "",
    ben_b_ngay_sinh: b1.ngay_sinh || "",
    ben_b_cccd: b1.cccd || "",
    ben_b_ngay_cap: b1.ngay_cap || "",
    ben_b_dia_chi: b1.dia_chi || "",
    ben_a_bo_sung: benABoSung,
    ben_b_bo_sung: benBBoSung,
    ben_chung_thuc_bo_sung: benChungThucBoSung
  };
}

const payload = buildUyPayload(inputData);
const doc = new Docxtemplater(new PizZip(fs.readFileSync(templatePath)), {
  paragraphLoop: true,
  linebreaks: true
});
doc.render(payload);
fs.writeFileSync(outputPath, doc.getZip().generate({ type: "nodebuffer" }));

const outZip = new PizZip(fs.readFileSync(outputPath, "binary"));
const outXml = outZip.files["word/document.xml"].asText();
const text = (outXml.match(/<w:t[^>]*>[^<]*<\/w:t>/g) || []).map((t) => t.replace(/<[^>]+>/g, "")).join(" ");

console.log("WROTE", outputPath);
console.log("Contains extra ben_a person:", text.includes("Pham Van C"));
console.log("Contains extra ben_b person:", text.includes("Do Van E"));
console.log("Contains unresolved tag:", text.includes("{"));
console.log("Contains hardcoded placeholder aaaa:", /aaaa/i.test(text));
