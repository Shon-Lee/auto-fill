import fs from "fs";
import PizZip from "pizzip";
const xml=new PizZip(fs.readFileSync('e:/Tool/generated/thua_ke_render_test.docx')).file('word/document.xml').asText();
const i=xml.indexOf('Chúng tôi gồm có:');
const j=xml.indexOf('Chúng tôi là những người thừa kế theo pháp luật', i);
const s=i>0?i:0; const e=j>0?j+120:j+500;
console.log(xml.slice(s,e));
