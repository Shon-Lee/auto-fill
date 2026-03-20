import fs from "fs";
import PizZip from "pizzip";

const file='e:/Tool/public/templates/thua_ke.docx';
const zip=new PizZip(fs.readFileSync(file));
let xml=zip.file('word/document.xml').asText();

function rep(name, from, to){
  const before=xml;
  if (from instanceof RegExp) {
    xml = xml.replace(from, to);
  } else {
    xml = xml.replace(from, to);
  }
  console.log(name, before===xml ? 'MISS' : 'OK');
}

rep(
  'header_time_place',
  'Hôm nay, vào hồi  ….giờ  ..... phút, ngày ….. tháng … năm 2026 Địa điểm: Ủy ban nhân dân xã X',
  'Hôm nay, vào hồi {gio_lap} giờ {phut_lap} phút, ngày {ngay_lap} tháng {thang_lap} năm 2026 Địa điểm: Ủy ban nhân dân xã {dia_diem_ubnd_xa}'
);

rep(
  'heirs_block',
  /Chúng tôi gồm có:[\s\S]*?Chúng tôi là những người thừa kế theo pháp luật/,
  'Chúng tôi gồm có:{#ds_nguoi_thua_ke}{stt}. {xung_ho}: {ho_ten}, ngày sinh {ngay_sinh}, CCCD số {so_cccd}, cấp ngày {ngay_cap}, là {quan_he}. - Thường trú tại: {dia_chi_thuong_tru}. {/ds_nguoi_thua_ke}Chúng tôi là những người thừa kế theo pháp luật'
);

rep(
  'main_body_block',
  /Chúng tôi là những người thừa kế theo pháp luật[\s\S]*?Chúng tôi xin cam đoan:/,
  'Chúng tôi là những người thừa kế theo pháp luật của ông {ten_cha_da_mat} và bà {ten_me_da_mat}, chúng tôi thỏa thuận về việc phân chia di sản thừa kế như sau:{noi_dung_thua_ke}Chúng tôi xin cam đoan:'
);

rep(
  'parents_global_father',
  /ông Hoàng Văn Huống/g,
  'ông {ten_cha_da_mat}'
);

rep(
  'parents_global_mother',
  /bà Trần Thị Vải/g,
  'bà {ten_me_da_mat}'
);

rep(
  'cert_intro',
  'Lời chứng chứng thực văn bản phân chia di sảntại UBND xã X Ngày ........... tháng … năm 2026 (Bằng chữ: ………………………… tháng ……………………, năm hai nghìn không trăm hai mươi sáu).',
  'Lời chứng chứng thực văn bản phân chia di sản tại UBND xã {xa_chung_thuc} Ngày {ngay_chung_thuc} tháng {thang_chung_thuc} năm 2026 (Bằng chữ: ………………………… tháng ……………………, năm {nam_chung_thuc_bang_chu}).'
);

rep('cert_tai', 'Tại: UBND xã X.', 'Tại: UBND xã {xa_chung_thuc}.');

rep(
  'cert_executor',
  'Tôi: Phạm Ngọc Vinh - PCT UBND xã X. Chứng thực',
  'Tôi: {nguoi_thuc_hien_chung_thuc} - PCT UBND xã {xa_chung_thuc}. Chứng thực'
);

rep(
  'cert_receiver_sentence',
  'bà Đỗ Hùng Hoài là người tiếp nhận hồ sơ.',
  'bà {nguoi_tiep_nhan_ho_so} là người tiếp nhận hồ sơ.'
);

rep(
  'cert_cap_ban',
  '+ Ông: Hoàng Văn Chính 02 (hai) bản;',
  '+ Ông/Bà: {nguoi_duoc_cap_ban} 02 (hai) bản;'
);

rep(
  'cert_luu_xa',
  'Lưu tại: UBND xã X 01 (một) bản.',
  'Lưu tại: UBND xã {xa_chung_thuc} 01 (một) bản.'
);

rep(
  'cert_so_quyen',
  'Số chứng thực …………………quyển số 01/2026 - SCT/GD./.',
  'Số chứng thực …………………quyển số {so_quyen_chung_thuc} - SCT/GD./.'
);

rep('cert_receiver_name', 'Đỗ Hùng Hoài', '{nguoi_tiep_nhan_ho_so}');

zip.file('word/document.xml', xml);
fs.writeFileSync(file, zip.generate({ type: 'nodebuffer' }));
console.log('thua_ke patched by spec');
