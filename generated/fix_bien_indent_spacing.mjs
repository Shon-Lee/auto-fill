import fs from "fs";
import PizZip from "pizzip";

const file='e:/Tool/public/templates/bien_dong.docx';
const zip=new PizZip(fs.readFileSync(file));
let xml=zip.file('word/document.xml').asText();

const from='</w:t><w:br/><w:t>- Địa chỉ thửa đất: </w:t>';
const to='</w:t><w:br/><w:t xml:space="preserve">   - Địa chỉ thửa đất: </w:t>';

const before=xml;
xml=xml.replace(from,to);
console.log('lineBreakIndentPatch', before===xml ? 'MISS' : 'OK');

zip.file('word/document.xml',xml);
fs.writeFileSync(file, zip.generate({type:'nodebuffer'}));
console.log('Applied indentation + spacing fix for dia chi line');
