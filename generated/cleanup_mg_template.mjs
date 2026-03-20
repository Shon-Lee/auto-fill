import fs from "fs";
import PizZip from "pizzip";

const p='e:/Tool/public/templates/mien_giam.docx';
const zip=new PizZip(fs.readFileSync(p));
let xml=zip.file('word/document.xml').asText();

const replacements=[
  ['{ten_nguoi_nop_thue} {ten_nguoi_nop_thue}','{ten_nguoi_nop_thue}'],
  ['{ma_so_thue} 036068011111','{ma_so_thue}'],
  ['{phuong_xa} X.','{phuong_xa}'],
  ['{quan_huyen} .........','{quan_huyen}'],
  ['{tinh_thanh} Ninh Bình','{tinh_thanh}'],
  ['{dien_thoai} .............................','{dien_thoai}']
];

for (const [from,to] of replacements){
  if (xml.includes(from)) {
    xml=xml.replace(from,to);
    console.log('OK',from);
  } else {
    console.log('MISS',from);
  }
}

zip.file('word/document.xml',xml);
fs.writeFileSync(p, zip.generate({type:'nodebuffer'}));
console.log('Cleaned duplicated/static values in mien_giam template.');
