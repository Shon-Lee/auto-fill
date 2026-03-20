import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
const p='e:/Tool/public/templates/uy_quyen.docx';
const d=new Docxtemplater(new PizZip(fs.readFileSync(p)),{paragraphLoop:true,linebreaks:true});
const t=d.getFullText()||'';
console.log('tags:',(t.match(/\{[^\}]+\}/g)||[]).join(' | ')||'none');
console.log(t.slice(0,2600));
