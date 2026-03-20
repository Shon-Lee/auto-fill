import fs from "fs";
import PizZip from "pizzip";

const file='e:/Tool/public/templates/mien_giam.docx';
const zip=new PizZip(fs.readFileSync(file));
let xml=zip.file('word/document.xml').asText();

console.log('hasXNgay', xml.includes('X, ngày'));
console.log('hasXaX', xml.includes('xã X, tỉnh Ninh Bình'));
console.log('redCountBefore', (xml.match(/<w:color w:val="FF0000"\/>/g) || []).length);

xml = xml.replace(/<w:color w:val="FF0000"\/>/g, '');
xml = xml.replace('X, ngày', '{phuong_xa}, ngày');
xml = xml.replace('xã X, tỉnh Ninh Bình', 'xã {phuong_xa}, tỉnh {tinh_thanh}');

console.log('redCountAfter', (xml.match(/<w:color w:val="FF0000"\/>/g) || []).length);

zip.file('word/document.xml', xml);
fs.writeFileSync(file, zip.generate({type:'nodebuffer'}));
console.log('Updated mien_giam template colors/placeholders.');
