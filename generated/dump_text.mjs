import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
const p='e:/Tool/public/templates/mien_giam.docx';
const content=fs.readFileSync(p);
const zip=new PizZip(content);
const doc=new Docxtemplater(zip,{paragraphLoop:true,linebreaks:true});
const text=doc.getFullText()||'';
console.log(text.slice(0,2500));
