import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
const p='e:/Tool/public/templates/thua_ke.docx';
const d=new Docxtemplater(new PizZip(fs.readFileSync(p)),{paragraphLoop:true,linebreaks:true});
const t=d.getFullText()||'';
console.log((t.match(/\{[^\}]+\}/g)||[]).join(' | '));
console.log('\nTAIL:\n'+t.slice(-2200));
