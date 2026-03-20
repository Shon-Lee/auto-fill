import fs from "fs";
import PizZip from "pizzip";
const xml=new PizZip(fs.readFileSync('e:/Tool/public/templates/mien_giam.docx')).file('word/document.xml').asText();
let idx=0,c=0;
while((idx=xml.indexOf('2026',idx))!==-1){
  c++; const s=Math.max(0,idx-300), e=Math.min(xml.length,idx+260);
  console.log('\n=== 2026 #'+c+' ===');
  console.log(xml.slice(s,e));
  idx+=4;
}
console.log('count',c);
