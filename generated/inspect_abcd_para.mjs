import fs from "fs";
import PizZip from "pizzip";

const file='e:/Tool/public/templates/bien_dong.docx';
const xml=new PizZip(fs.readFileSync(file)).file('word/document.xml').asText();
const i=xml.indexOf('a) Tên(2):');
console.log('idx', i);
if(i>=0){
  const pStart=xml.lastIndexOf('<w:p ', i);
  const pEnd=xml.indexOf('</w:p>', i)+6;
  const para=xml.slice(pStart,pEnd);
  console.log(para);
}
