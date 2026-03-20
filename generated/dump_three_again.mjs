import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
for (const f of ['uy_quyen.docx','thua_ke.docx','bien_dong.docx']) {
  const p=`e:/Tool/public/templates/${f}`;
  const d=new Docxtemplater(new PizZip(fs.readFileSync(p)),{paragraphLoop:true,linebreaks:true});
  const t=d.getFullText()||'';
  console.log(`\n==== ${f} len=${t.length} ====`);
  console.log(t.slice(0,3500));
}
