import fs from "fs";
import PizZip from "pizzip";

const file='e:/Tool/public/templates/bien_dong.docx';
const zip=new PizZip(fs.readFileSync(file));
let xml=zip.file('word/document.xml').asText();

const oldInfo='a) Tên(2): {ho_ten}b) Giấy tờ nhân thân/pháp nhân(2): {giay_to_nhan_than}c) Địa chỉ(2): {dia_chi}.d) Điện thoại liên hệ (nếu có):…………………… Hộp thư điện tử (nếu có): ';
const newInfo='a) Tên(2): {ho_ten}</w:t><w:br/><w:t>b) Giấy tờ nhân thân/pháp nhân(2): {giay_to_nhan_than}</w:t><w:br/><w:t>c) Địa chỉ(2): {dia_chi}.</w:t><w:br/><w:t>d) Điện thoại liên hệ (nếu có):…………………… Hộp thư điện tử (nếu có): ';

const oldThua='- Thửa đất số {thua_dat_so} tờ bản đồ số: {to_ban_do_so}, diện tích: {dien_tich} m2.- Địa chỉ thửa đất: ';
const newThua='- Thửa đất số {thua_dat_so} tờ bản đồ số: {to_ban_do_so}, diện tích: {dien_tich} m2.</w:t><w:br/><w:t>- Địa chỉ thửa đất: ';

const before=xml;
xml=xml.replace(oldInfo,newInfo);
xml=xml.replace(oldThua,newThua);

console.log('infoPatched', before!==xml && !before.includes(newInfo));
console.log('hasOldInfo', xml.includes(oldInfo));
console.log('hasOldThua', xml.includes(oldThua));

zip.file('word/document.xml',xml);
fs.writeFileSync(file, zip.generate({type:'nodebuffer'}));
console.log('Patched line breaks in bien_dong template');
