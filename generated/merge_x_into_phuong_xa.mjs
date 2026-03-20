import fs from "fs";
import PizZip from "pizzip";

const file='e:/Tool/public/templates/mien_giam.docx';
const zip=new PizZip(fs.readFileSync(file));
let xml=zip.file('word/document.xml').asText();
const before=(xml.match(/\{xa_xu_ly\}/g)||[]).length;
xml=xml.replace(/\{xa_xu_ly\}/g,'{phuong_xa}');
const after=(xml.match(/\{xa_xu_ly\}/g)||[]).length;
const phuongCount=(xml.match(/\{phuong_xa\}/g)||[]).length;
zip.file('word/document.xml',xml);
fs.writeFileSync(file,zip.generate({type:'nodebuffer'}));
console.log('xa_xu_ly before:',before);
console.log('xa_xu_ly after:',after);
console.log('phuong_xa count:',phuongCount);
