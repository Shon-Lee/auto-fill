import fs from "fs";
import PizZip from "pizzip";

const filePath = "e:/Tool/public/templates/mien_giam.docx";
const content = fs.readFileSync(filePath);
const zip = new PizZip(content);
let xml = zip.file("word/document.xml").asText();

function replaceOnce(from, to) {
  const idx = xml.indexOf(from);
  if (idx === -1) {
    console.log(`MISS: ${from}`);
    return;
  }
  xml = xml.replace(from, to);
  console.log(`OK: ${from}`);
}

replaceOnce("[01] Tên người nộp thuế:", "[01] Tên người nộp thuế: {ten_nguoi_nop_thue}");
replaceOnce("[02] Mã số thuế:", "[02] Mã số thuế: {ma_so_thue}");
replaceOnce("[03a] Phường/xã:", "[03a] Phường/xã: {phuong_xa}");
replaceOnce("[03b] Quận/huyện:", "[03b] Quận/huyện: {quan_huyen}");
replaceOnce("[03c] Tỉnh/thành phố:", "[03c] Tỉnh/thành phố: {tinh_thanh}");
replaceOnce("[04] Điện thoại:", "[04] Điện thoại: {dien_thoai}");

replaceOnce("HOÀNG VĂN C", "{ten_nguoi_nop_thue}");
replaceOnce("Hoàng Văn C", "{ten_nguoi_nop_thue}");

zip.file("word/document.xml", xml);
fs.writeFileSync(filePath, zip.generate({ type: "nodebuffer" }));
console.log("Updated mien_giam template with inline placeholders.");
