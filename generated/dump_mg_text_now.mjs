import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
const p='e:/Tool/public/templates/mien_giam.docx';
const d=new Docxtemplater(new PizZip(fs.readFileSync(p)),{paragraphLoop:true,linebreaks:true});
console.log(d.getFullText());
