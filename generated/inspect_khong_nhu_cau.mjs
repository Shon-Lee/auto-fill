import fs from "fs";
import PizZip from "pizzip";
const xml=new PizZip(fs.readFileSync('e:/Tool/public/templates/bien_dong.docx')).file('word/document.xml').asText();
const i=xml.indexOf('Không có nhu cầu cấp mới Giấy chứng nhận');
console.log('idx',i);
if(i>=0){
  const s=Math.max(0,i-260), e=Math.min(xml.length,i+320);
  console.log(xml.slice(s,e));
}
