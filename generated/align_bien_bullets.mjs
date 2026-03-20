import fs from "fs";
import PizZip from "pizzip";

const file='e:/Tool/public/templates/bien_dong.docx';
const zip=new PizZip(fs.readFileSync(file));
let xml=zip.file('word/document.xml').asText();

function normalizeBulletParagraph(marker){
  const i = xml.indexOf(marker);
  if(i===-1){
    console.log('MISS marker', marker);
    return;
  }
  const pStart = xml.lastIndexOf('<w:p ', i);
  const pEnd = xml.indexOf('</w:p>', i) + 6;
  const para = xml.slice(pStart, pEnd);
  let updated = para.replace('<w:ind w:firstLine="567"/>','<w:ind w:left="567"/>');
  updated = updated.replace('<w:t xml:space="preserve">   - Địa chỉ thửa đất: </w:t>','<w:t>- Địa chỉ thửa đất: </w:t>');
  if (para === updated) {
    console.log('NOCHANGE paragraph', marker);
    return;
  }
  xml = xml.slice(0,pStart) + updated + xml.slice(pEnd);
  console.log('OK paragraph', marker);
}

normalizeBulletParagraph('- Nhận thừa kế QSDĐ');
normalizeBulletParagraph('- Thửa đất số {thua_dat_so}');
normalizeBulletParagraph('Không có');

zip.file('word/document.xml', xml);
fs.writeFileSync(file, zip.generate({type:'nodebuffer'}));
console.log('Aligned bullet indentation in bien_dong.');
