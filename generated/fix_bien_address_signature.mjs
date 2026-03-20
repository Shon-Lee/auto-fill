import fs from "fs";
import PizZip from "pizzip";

const file='e:/Tool/public/templates/bien_dong.docx';
const zip=new PizZip(fs.readFileSync(file));
let xml=zip.file('word/document.xml').asText();

const addressPattern=/(<w:t xml:space="preserve">\s*- Địa chỉ thửa đất: <\/w:t><\/w:r>)[\s\S]*?(<\/w:p>)/;
const addressReplacement='$1<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr><w:t>{dia_chi}.</w:t></w:r>$2';

const beforeAddr = xml;
xml = xml.replace(addressPattern, addressReplacement);
console.log('addressPatched', beforeAddr === xml ? 'MISS' : 'OK');

const redBefore = (xml.match(/<w:color w:val="FF0000"\/>/g) || []).length;
xml = xml.replace(/<w:color w:val="FF0000"\/>/g, '');
const redAfter = (xml.match(/<w:color w:val="FF0000"\/>/g) || []).length;
console.log('redCount', redBefore, '->', redAfter);

zip.file('word/document.xml', xml);
fs.writeFileSync(file, zip.generate({ type: 'nodebuffer' }));
console.log('Patched address info and removed red text style in bien_dong');
