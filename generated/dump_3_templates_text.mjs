import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

const files=['thua_ke.docx','bien_dong.docx','uy_quyen.docx'];
for(const f of files){
  const p=`e:/Tool/public/templates/${f}`;
  if(!fs.existsSync(p)){ console.log(`FILE ${f}: missing`); continue; }
  const doc=new Docxtemplater(new PizZip(fs.readFileSync(p)),{paragraphLoop:true,linebreaks:true});
  const text=doc.getFullText()||'';
  console.log(`\n===== ${f} =====`);
  console.log(text.slice(0,5000));
}
