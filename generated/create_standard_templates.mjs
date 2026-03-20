import fs from "fs/promises";
import path from "path";
import { Document, Packer, Paragraph } from "docx";

const outDir = "e:/Tool/public/templates";

async function writeTemplate(fileName, lines) {
  const doc = new Document({
    sections: [
      {
        children: lines.map((line) => new Paragraph(line))
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  await fs.writeFile(path.join(outDir, fileName), buffer);
}

await writeTemplate("mien_giam.docx", [
  "DON MIEN GIAM",
  "Ten nguoi nop thue: {ten_nguoi_nop_thue}",
  "Ma so thue: {ma_so_thue}",
  "Phuong xa: {phuong_xa}",
  "Quan huyen: {quan_huyen}",
  "Tinh thanh: {tinh_thanh}",
  "Dien thoai: {dien_thoai}"
]);

await writeTemplate("thua_ke.docx", [
  "VAN BAN THUA KE",
  "{#danh_sach}",
  "Ho ten: {ten}",
  "CCCD: {cccd}",
  "Dia chi: {dia_chi}",
  "{/danh_sach}"
]);

await writeTemplate("uy_quyen.docx", [
  "HOP DONG UY QUYEN",
  "Ben A ho ten: {ben_a_ho_ten}",
  "Ben A CCCD: {ben_a_cccd}",
  "Ben A dia chi: {ben_a_dia_chi}",
  "Ben B ho ten: {ben_b_ho_ten}",
  "Ben B CCCD: {ben_b_cccd}",
  "Ben B dia chi: {ben_b_dia_chi}",
  "Noi dung uy quyen: {noi_dung_uy_quyen}"
]);

await writeTemplate("bien_dong.docx", [
  "DON DANG KY BIEN DONG",
  "Ho ten: {ho_ten}",
  "Giay to nhan than: {giay_to_nhan_than}",
  "Dia chi: {dia_chi}",
  "So giay chung nhan: {so_giay_chung_nhan}",
  "Thua dat so: {thua_dat_so}",
  "To ban do so: {to_ban_do_so}",
  "Dien tich: {dien_tich}",
  "Noi dung bien dong: {noi_dung_bien_dong}"
]);

console.log("Generated standard templates in public/templates");
