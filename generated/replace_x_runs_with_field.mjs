import fs from "fs";
import PizZip from "pizzip";

const file='e:/Tool/public/templates/mien_giam.docx';
const zip=new PizZip(fs.readFileSync(file));
let xml=zip.file('word/document.xml').asText();

let count=0;
xml = xml.replace(/<w:t>X<\/w:t>/g, (m) => {
  count += 1;
  if (count <= 2) return '<w:t>{xa_xu_ly}</w:t>';
  return m;
});

console.log('replaced', count >= 2 ? 2 : count);
zip.file('word/document.xml', xml);
fs.writeFileSync(file, zip.generate({ type: 'nodebuffer' }));
console.log('Injected xa_xu_ly for two X markers.');
