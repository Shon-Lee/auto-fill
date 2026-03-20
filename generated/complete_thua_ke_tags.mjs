import fs from "fs";
import PizZip from "pizzip";

const file='e:/Tool/public/templates/thua_ke.docx';
const zip=new PizZip(fs.readFileSync(file));
let xml=zip.file('word/document.xml').asText();

function rep(name, pattern, replacement, flags='g') {
  const re = pattern instanceof RegExp ? pattern : new RegExp(pattern, flags);
  const before = xml;
  xml = xml.replace(re, replacement);
  console.log(name, before===xml ? 'MISS' : 'OK');
}

rep('header_line', /Hôm nay,[\s\S]*?Địa điểm:\s*Ủy ban nhân dân xã\s*X/, 'Hôm nay, vào hồi {gio_lap} giờ {phut_lap} phút, ngày {ngay_lap} tháng {thang_lap} năm 2026 Địa điểm: Ủy ban nhân dân xã {dia_diem_ubnd_xa}', '');
rep('ten_me_global', /bà Trần Thị Vải/g, 'bà {ten_me_da_mat}', '');

rep('cert_tai_xa', /tại UBND xã\s*X/g, 'tại UBND xã {xa_chung_thuc}', '');
rep('cert_tai_label', /Tại:\s*UBND xã\s*X\./g, 'Tại: UBND xã {xa_chung_thuc}.', '');
rep('cert_ngay_thang', /Ngày\s*\.{5,}\s*tháng\s*…\s*năm\s*2026/g, 'Ngày {ngay_chung_thuc} tháng {thang_chung_thuc} năm 2026', '');
rep('cert_nam_bang_chu', /năm hai nghìn không trăm hai mươi sáu/g, 'năm {nam_chung_thuc_bang_chu}', '');
rep('cert_executor_line', /Tôi:\s*Phạm Ngọc Vinh\s*-\s*PCT UBND xã\s*X\.\s*Chứng thực/g, 'Tôi: {nguoi_thuc_hien_chung_thuc} - PCT UBND xã {xa_chung_thuc}. Chứng thực', '');
rep('cert_receiver_sentence', /bà\s*\{nguoi_tiep_nhan_ho_so\}\s*là người tiếp nhận hồ sơ\./g, 'bà {nguoi_tiep_nhan_ho_so} là người tiếp nhận hồ sơ.', '');
rep('cert_cap_ban', /\+\s*Ông:\s*Hoàng Văn Chính\s*02\s*\(hai\)\s*bản;/g, '+ Ông/Bà: {nguoi_duoc_cap_ban} 02 (hai) bản;', '');
rep('cert_luu_tai', /Lưu tại:\s*UBND xã\s*X\s*01\s*\(một\)\s*bản\./g, 'Lưu tại: UBND xã {xa_chung_thuc} 01 (một) bản.', '');
rep('cert_so_quyen', /quyển số\s*01\/2026\s*-\s*SCT\/GD\/.\//g, 'quyển số {so_quyen_chung_thuc} - SCT/GD./', '');
rep('cert_receiver_name', /Đỗ Hùng Hoài/g, '{nguoi_tiep_nhan_ho_so}', '');
rep('cert_executor_sign', /Người thực hiện chứng thực\(ký, ghi rõ họ, tên và đóng dấu\)/g, 'Người thực hiện chứng thực(ký, ghi rõ họ, tên và đóng dấu) {nguoi_thuc_hien_chung_thuc}', '');

zip.file('word/document.xml', xml);
fs.writeFileSync(file, zip.generate({type:'nodebuffer'}));
console.log('thua_ke placeholder completion patch done');
