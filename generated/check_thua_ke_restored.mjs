import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
const p='e:/Tool/public/templates/thua_ke.docx';
const d=new Docxtemplater(new PizZip(fs.readFileSync(p)),{paragraphLoop:true,linebreaks:true});
const t=d.getFullText()||'';
console.log(t.slice(0,1800));
console.log('hasLoopTags', /\{#danh_sach\}|\{\/danh_sach\}/.test(t));
