import fs from "fs";
import PizZip from "pizzip";
const xml=new PizZip(fs.readFileSync('e:/Tool/public/templates/bien_dong.docx')).file('word/document.xml').asText();
const i=xml.indexOf('Xuân');
const s=Math.max(0,i-200), e=Math.min(xml.length,i+450);
console.log(xml.slice(s,e));
const j=xml.indexOf('Không có');
console.log('\n---k---');
console.log(xml.slice(j-180,j+220));
