import fs from "fs";
import PizZip from "pizzip";
const xml=new PizZip(fs.readFileSync('e:/Tool/public/templates/uy_quyen.docx')).file('word/document.xml').asText();
for (const marker of ['Căn cước số','CCCD số','Nơi thường trú','ĐIỀU 2:']) {
  let idx=0; let c=0;
  while((idx=xml.indexOf(marker,idx))!==-1){
    c++; const s=Math.max(0,idx-160),e=Math.min(xml.length,idx+460);
    console.log(`\n=== ${marker} #${c} ===`);
    console.log(xml.slice(s,e));
    idx += marker.length;
  }
}
