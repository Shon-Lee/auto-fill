import fs from "fs";
import PizZip from "pizzip";
const xml=new PizZip(fs.readFileSync('e:/Tool/public/templates/mien_giam.docx')).file('word/document.xml').asText();
for(const marker of ['ngày','UBND xã']){
  const i=xml.indexOf(marker);
  console.log('\nMARKER',marker,'idx',i);
  if(i>=0){
    const s=Math.max(0,i-260), e=Math.min(xml.length,i+420);
    console.log(xml.slice(s,e));
  }
}
