import fs from "fs";
import PizZip from "pizzip";

const p='e:/Tool/public/templates/bien_dong.docx';
const xml=new PizZip(fs.readFileSync(p)).file('word/document.xml').asText();
for (const marker of ['a) Tên(2):','2. Nội dung biến động (3):','- Thửa đất số']) {
  const i=xml.indexOf(marker);
  console.log('\n===',marker,'idx',i,'===');
  if(i>=0){
    const s=Math.max(0,i-260), e=Math.min(xml.length,i+700);
    console.log(xml.slice(s,e));
  }
}
