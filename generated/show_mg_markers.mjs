import fs from "fs";
import PizZip from "pizzip";
const xml=new PizZip(fs.readFileSync('e:/Tool/public/templates/mien_giam.docx')).file('word/document.xml').asText();
for (const marker of ['[01] Tên người nộp thuế:','[02] Mã số thuế:','[03a] Phường/xã:']){
  const idx=xml.indexOf(marker);
  console.log('\n---',marker,'---');
  if(idx<0){console.log('not found'); continue;}
  const s=Math.max(0,idx-80),e=Math.min(xml.length,idx+700);
  console.log(xml.slice(s,e));
}
