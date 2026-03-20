import fs from "fs";
import PizZip from "pizzip";

const file='e:/Tool/public/templates/bien_dong.docx';
const zip=new PizZip(fs.readFileSync(file));
let xml=zip.file('word/document.xml').asText();

const marker='a) Tên(2): {ho_ten}';
const i=xml.indexOf(marker);
if(i===-1){
  console.log('marker not found');
  process.exit(1);
}
const pStart=xml.lastIndexOf('<w:p ', i);
const pEnd=xml.indexOf('</w:p>', i)+6;
const para=xml.slice(pStart,pEnd);
const updatedPara=para.replace('<w:ind w:firstLine="567"/>','<w:ind w:left="567"/>');
if(para===updatedPara){
  console.log('indent pattern not found in target paragraph');
  process.exit(1);
}
xml=xml.slice(0,pStart)+updatedPara+xml.slice(pEnd);
zip.file('word/document.xml',xml);
fs.writeFileSync(file,zip.generate({type:'nodebuffer'}));
console.log('Updated a/b/c/d paragraph indent to left-only.');
