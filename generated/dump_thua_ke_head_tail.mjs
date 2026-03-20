import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
const p='e:/Tool/public/templates/thua_ke.docx';
const d=new Docxtemplater(new PizZip(fs.readFileSync(p)),{paragraphLoop:true,linebreaks:true});
const t=d.getFullText()||'';
console.log(t.slice(0,2600));
console.log('\n---TAIL---\n');
console.log(t.slice(-2600));
