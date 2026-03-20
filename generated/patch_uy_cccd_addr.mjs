import fs from "fs";
import PizZip from "pizzip";

const file='e:/Tool/public/templates/uy_quyen.docx';
const zip=new PizZip(fs.readFileSync(file));
let xml=zip.file('word/document.xml').asText();

xml = xml.replace(/Căn cước số:\s*036068011111,\s*do/g, 'Căn cước số: {ben_a_cccd}, do');
xml = xml.replace(/CCCD số:\s*036196019000,\s*do/g, 'CCCD số: {ben_b_cccd}, do');

let n=0;
xml = xml.replace(/Nơi thường trú:\s*xã X, tỉnh Ninh Bình\./g, (m) => {
  n += 1;
  if (n === 1) return 'Nơi thường trú: {ben_a_dia_chi}.';
  if (n === 3) return 'Nơi thường trú: {ben_b_dia_chi}.';
  return m;
});

zip.file('word/document.xml', xml);
fs.writeFileSync(file, zip.generate({type:'nodebuffer'}));
console.log('address occurrences seen', n);
