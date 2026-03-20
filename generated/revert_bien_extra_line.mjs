import fs from "fs";
import PizZip from "pizzip";

const file='e:/Tool/public/templates/bien_dong.docx';
const zip=new PizZip(fs.readFileSync(file));
let xml=zip.file('word/document.xml').asText();

const oldLine='2. Nội dung biến động (3): Số giấy chứng nhận: {so_giay_chung_nhan}.';
const newLine='2. Nội dung biến động (3):';
const before=xml;
xml=xml.replace(oldLine,newLine);
console.log('removedExtraLine', before===xml ? 'MISS' : 'OK');

zip.file('word/document.xml',xml);
fs.writeFileSync(file,zip.generate({type:'nodebuffer'}));
console.log('Reverted bien_dong section 2 to original structure');
