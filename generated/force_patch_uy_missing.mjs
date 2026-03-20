import fs from "fs";
import PizZip from "pizzip";

const file='e:/Tool/public/templates/uy_quyen.docx';
const zip=new PizZip(fs.readFileSync(file));
let xml=zip.file('word/document.xml').asText();

// ben_a_cccd: merge split sample number into one placeholder
let c1 = 0;
xml = xml.replace(/<w:t>03606801<\/w:t>/g, (m) => {
  c1 += 1;
  return c1 === 1 ? '<w:t>{ben_a_cccd}</w:t>' : m;
});
let c2 = 0;
xml = xml.replace(/<w:t>1111<\/w:t>/g, (m) => {
  c2 += 1;
  return c2 === 1 ? '<w:t></w:t>' : m;
});

// ben_a_dia_chi and ben_b_dia_chi: replace 1st and 3rd address paragraphs
const addrRe = /<w:t[^>]*>Nơi thường trú:[\s\S]*?<\/w:p>/g;
let addrIdx = 0;
xml = xml.replace(addrRe, (m) => {
  addrIdx += 1;
  if (addrIdx === 1) {
    return '<w:t xml:space="preserve">Nơi thường trú: {ben_a_dia_chi}.</w:t></w:r></w:p>';
  }
  if (addrIdx === 3) {
    return '<w:t xml:space="preserve">Nơi thường trú: {ben_b_dia_chi}.</w:t></w:r></w:p>';
  }
  return m;
});

zip.file('word/document.xml',xml);
fs.writeFileSync(file, zip.generate({type:'nodebuffer'}));
console.log('ben_a_cccd replaced first part count', c1);
console.log('ben_a_cccd tail cleared count', c2);
console.log('address paragraphs seen', addrIdx);
