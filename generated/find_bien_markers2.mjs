import fs from "fs";
import PizZip from "pizzip";
const xml=new PizZip(fs.readFileSync('e:/Tool/public/templates/bien_dong.docx')).file('word/document.xml').asText();
const start=xml.indexOf('2. Nội dung biến động (3):');
const markers=['3. Giấy tờ','Giấy tờ liên quan','Cam đoan nội dung'];
for(const m of markers){
  console.log(m, xml.indexOf(m,start));
}
let end=xml.indexOf('3. Giấy tờ',start);
if(end<0) end=xml.indexOf('Giấy tờ liên quan',start);
if(end<0) end=xml.indexOf('Cam đoan nội dung',start);
console.log('start',start,'end',end);
if(start>-1 && end>-1){
  console.log(xml.slice(start-250,end+250));
}
