import fs from "fs";
import PizZip from "pizzip";

const file='e:/Tool/public/templates/bien_dong.docx';
const xml=new PizZip(fs.readFileSync(file)).file('word/document.xml').asText();
const start=xml.indexOf('2. Nội dung biến động (3):');
const end=xml.indexOf('3. Giấy tờ liên quan đến nội dung biến động', start);
console.log('start',start,'end',end);
if(start>-1 && end>-1){
  const s=Math.max(0,start-400);
  const e=Math.min(xml.length,end+350);
  console.log(xml.slice(s,e));
}
