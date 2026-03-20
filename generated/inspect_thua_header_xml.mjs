import fs from "fs";
import PizZip from "pizzip";
const xml=new PizZip(fs.readFileSync('e:/Tool/public/templates/thua_ke.docx')).file('word/document.xml').asText();
for(const token of ['Hôm nay, vào hồi','giờ','phút, ngày','tháng','năm 2026']){
 const i=xml.indexOf(token);
 console.log('\n',token,'idx',i);
 if(i>=0) console.log(xml.slice(Math.max(0,i-180),Math.min(xml.length,i+360)));
}
