import fs from "fs";
import PizZip from "pizzip";
const xml=new PizZip(fs.readFileSync('e:/Tool/public/templates/mien_giam.docx')).file('word/document.xml').asText();
let m; const re=/<w:t>X<\/w:t>/g; let i=0;
while((m=re.exec(xml))!==null){
  i++; const idx=m.index; const s=Math.max(0,idx-220), e=Math.min(xml.length,idx+260);
  console.log('\n=== X run #'+i+' ===');
  console.log(xml.slice(s,e));
}
console.log('totalX',i);
