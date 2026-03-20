import fs from "fs";
import PizZip from "pizzip";

const file='e:/Tool/public/templates/bien_dong.docx';
const zip=new PizZip(fs.readFileSync(file));
let xml=zip.file('word/document.xml').asText();

const before=xml;
xml=xml.replace('- {noi_dung_bien_dong}','- Nhận thừa kế QSDĐ');
console.log('replaced', before===xml ? 'MISS' : 'OK');

zip.file('word/document.xml', xml);
fs.writeFileSync(file, zip.generate({type:'nodebuffer'}));
console.log('Updated bien_dong fixed text line.');
