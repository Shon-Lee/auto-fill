import fs from "fs";
import PizZip from "pizzip";

const file='e:/Tool/public/templates/thua_ke.docx';
const zip=new PizZip(fs.readFileSync(file));
let xml=zip.file('word/document.xml').asText();

function patch(name, re, replacement) {
  const before = xml;
  xml = xml.replace(re, replacement);
  console.log(name, before === xml ? 'MISS' : 'OK');
}

patch(
  'header_time',
  /<w:t xml:space="preserve">Hôm nay, vào hồi[\s\S]*?<w:t>6<\/w:t>/,
  '<w:t xml:space="preserve">Hôm nay, vào hồi {gio_lap} giờ {phut_lap} phút, ngày {ngay_lap} tháng {thang_lap} năm 2026</w:t>'
);

patch(
  'header_place',
  /<w:t xml:space="preserve">Địa điểm: Ủy ban nhân dân xã <\/w:t><\/w:r><w:r[^>]*><w:rPr>[\s\S]*?<w:t>X<\/w:t><\/w:r>/,
  '<w:t xml:space="preserve">Địa điểm: Ủy ban nhân dân xã {dia_diem_ubnd_xa}</w:t>'
);

patch('father_name', /Hoàng Văn Huống/g, '{ten_cha_da_mat}');
patch('mother_name', /Trần Thị Vải/g, '{ten_me_da_mat}');

patch(
  'cert_xa_1',
  /tại UBND xã <\/w:t><\/w:r><w:r[^>]*><w:rPr>[\s\S]*?<w:t>X<\/w:t>/g,
  'tại UBND xã {xa_chung_thuc}'
);

patch(
  'cert_xa_2',
  /Tại: UBND xã <\/w:t><\/w:r><w:r[^>]*><w:rPr>[\s\S]*?<w:t>X<\/w:t>/g,
  'Tại: UBND xã {xa_chung_thuc}'
);

patch(
  'cert_executor',
  /Tôi<\/w:t><\/w:r><w:r><w:t xml:space="preserve">: Phạm Ngọc Vinh - PCT UBND xã <\/w:t><\/w:r><w:r[^>]*><w:rPr>[\s\S]*?<w:t>X<\/w:t>/,
  'Tôi: {nguoi_thuc_hien_chung_thuc} - PCT UBND xã {xa_chung_thuc}'
);

patch('cert_receiver', /Đỗ Hùng Hoài/g, '{nguoi_tiep_nhan_ho_so}');
patch('cert_cap', /\+ Ông: Hoàng Văn Chính/g, '+ Ông/Bà: {nguoi_duoc_cap_ban}');
patch('cert_so_quyen', /quyển số 01\/2026/g, 'quyển số {so_quyen_chung_thuc}');

patch(
  'cert_date',
  /Ngày\s*\.{5,}\s*tháng\s*…\s*năm\s*2026/g,
  'Ngày {ngay_chung_thuc} tháng {thang_chung_thuc} năm 2026'
);

patch(
  'cert_year_words',
  /năm hai nghìn không trăm hai mươi sáu/g,
  'năm {nam_chung_thuc_bang_chu}'
);

zip.file('word/document.xml', xml);
fs.writeFileSync(file, zip.generate({ type: 'nodebuffer' }));
console.log('thua_ke local patch complete');
