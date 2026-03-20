import fs from "fs";
import PizZip from "pizzip";

const file='e:/Tool/public/templates/mien_giam.docx';
const zip=new PizZip(fs.readFileSync(file));
let xml=zip.file('word/document.xml').asText();

const rules = [
  ['X, ngày','{xa_xu_ly}, ngày'],
  ['UBND xã X, tỉnh Ninh Bình','UBND xã {xa_xu_ly}, tỉnh Ninh Bình']
];

for (const [from,to] of rules){
  if (xml.includes(from)) {
    xml = xml.replace(from,to);
    console.log('OK', from);
  } else {
    console.log('MISS', from);
  }
}

zip.file('word/document.xml', xml);
fs.writeFileSync(file, zip.generate({type:'nodebuffer'}));
console.log('Updated xa_xu_ly placeholders in mien_giam.docx');
