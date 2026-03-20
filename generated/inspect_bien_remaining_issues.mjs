import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

const p='e:/Tool/public/templates/bien_dong.docx';
const d=new Docxtemplater(new PizZip(fs.readFileSync(p)),{paragraphLoop:true,linebreaks:true});
const t=d.getFullText()||'';
console.log(t.slice(0,2600));

const xml=new PizZip(fs.readFileSync(p)).file('word/document.xml').asText();
const addrIdx=xml.indexOf('- Địa chỉ thửa đất:');
console.log('\naddrIdx',addrIdx);
if(addrIdx>=0){
  const s=Math.max(0,addrIdx-220),e=Math.min(xml.length,addrIdx+480);
  console.log(xml.slice(s,e));
}
const signIdx=xml.lastIndexOf('{ho_ten}');
console.log('\nsignIdx',signIdx);
if(signIdx>=0){
  const s=Math.max(0,signIdx-220),e=Math.min(xml.length,signIdx+300);
  console.log(xml.slice(s,e));
}
console.log('\nredCount', (xml.match(/<w:color w:val="FF0000"\/>/g)||[]).length);
