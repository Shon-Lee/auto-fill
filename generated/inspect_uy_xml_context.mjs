import fs from "fs";
import PizZip from "pizzip";
const xml=new PizZip(fs.readFileSync('e:/Tool/public/templates/uy_quyen.docx')).file('word/document.xml').asText();
let idx=0,c=0;
while((idx=xml.indexOf('Nơi thường trú',idx))!==-1){
  c++; const s=Math.max(0,idx-120),e=Math.min(xml.length,idx+260);
  console.log('\n=== addr #'+c+' ===');
  console.log(xml.slice(s,e));
  idx+=5;
}
console.log('count',c);
let i=xml.indexOf('036068011111'); console.log('idx a cccd',i); if(i>-1) console.log(xml.slice(i-80,i+140));
let j=xml.indexOf('036196019000'); console.log('idx b cccd',j); if(j>-1) console.log(xml.slice(j-80,j+140));
