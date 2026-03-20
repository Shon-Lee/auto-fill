import fs from "fs";
import PizZip from "pizzip";
const xml=new PizZip(fs.readFileSync('e:/Tool/public/templates/bien_dong.docx')).file('word/document.xml').asText();
const i=xml.indexOf('- Địa chỉ thửa đất:');
const s=Math.max(0,i-60), e=Math.min(xml.length,i+900);
console.log(xml.slice(s,e));
