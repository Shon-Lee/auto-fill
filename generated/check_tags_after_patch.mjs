import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
for (const f of ['thua_ke.docx','bien_dong.docx','uy_quyen.docx']) {
  const p=`e:/Tool/public/templates/${f}`;
  const d=new Docxtemplater(new PizZip(fs.readFileSync(p)),{paragraphLoop:true,linebreaks:true});
  const t=d.getFullText()||'';
  console.log(`\n===== ${f} =====`);
  console.log((t.match(/\{[^\}]+\}/g)||[]).join(' | ') || 'no-tags');
  console.log(t.slice(0,1300));
}
