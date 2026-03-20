import fs from "fs";
import PizZip from "pizzip";
const xml=new PizZip(fs.readFileSync('e:/Tool/public/templates/bien_dong.docx')).file('word/document.xml').asText();
const key='Không có';
let i=xml.indexOf(key);
console.log('idx',i);
if(i>=0){
  const s=Math.max(0,i-900), e=Math.min(xml.length,i+260);
  console.log(xml.slice(s,e));
}
