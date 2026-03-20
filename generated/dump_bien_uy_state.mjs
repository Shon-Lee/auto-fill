import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
for (const f of ['bien_dong.docx','uy_quyen.docx']) {
  const p=`e:/Tool/public/templates/${f}`;
  const d=new Docxtemplater(new PizZip(fs.readFileSync(p)),{paragraphLoop:true,linebreaks:true});
  const t=d.getFullText()||'';
  const tags=(t.match(/\{[^\}]+\}/g)||[]);
  console.log(`\n${f} tags:`, tags.join(' | ') || 'none');
  console.log(t.slice(0,2200));
}
