import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

const templatePath = "e:/Tool/public/templates/mien_giam.docx";
const outputPath = "e:/Tool/generated/mien_giam_render_test.docx";
const data = {
  ten_nguoi_nop_thue: "a",
  ma_so_thue: "a",
  phuong_xa: "a",
  quan_huyen: "a",
  tinh_thanh: "a",
  dien_thoai: "a"
};

const content = fs.readFileSync(templatePath);
const zip = new PizZip(content);
const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
doc.render(data);
fs.writeFileSync(outputPath, doc.getZip().generate({ type: "nodebuffer" }));

const rendered = new Docxtemplater(new PizZip(fs.readFileSync(outputPath)), { paragraphLoop: true, linebreaks: true });
const text = rendered.getFullText();
console.log(text.includes("DON MIEN GIAM"));
console.log(text.includes("VĂN BẢN ĐỀ NGHỊ MIỄN"));
console.log(text.includes("[01] Tên người nộp thuế: a"));
console.log(text.includes("[02] Mã số thuế: a"));
console.log(text.includes("[03a] Phường/xã: a"));
console.log(text.includes("[03b] Quận/huyện: a"));
console.log(text.includes("[03c] Tỉnh/thành phố: a"));
console.log(text.includes("[04] Điện thoại: a"));
