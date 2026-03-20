import fs from "fs";
import PizZip from "pizzip";

const file='e:/Tool/public/templates/uy_quyen.docx';
const zip=new PizZip(fs.readFileSync(file));
let xml=zip.file('word/document.xml').asText();

function patch(name, regex, replacer){
  const before=xml;
  xml=xml.replace(regex,replacer);
  console.log(name, before===xml ? 'MISS':'OK');
}

patch(
  'ben_a_cccd',
  /(Căn cước số:)[\s\S]*?(, do Cục cảnh sát QLHC về TTXH,)/,
  '$1 {ben_a_cccd}$2'
);

patch(
  'ben_a_dia_chi',
  /(Nơi thường trú:)[\s\S]*?(\.Bà:)/,
  '$1 {ben_a_dia_chi}$2'
);

patch(
  'ben_b_cccd',
  /(BÊN ĐƯỢC UỶ QUYỀN \(Bên B\):[\s\S]*?CCCD số:)[\s\S]*?(, do Cục cảnh sát QLHC về TTXH,)/,
  '$1 {ben_b_cccd}$2'
);

patch(
  'ben_b_dia_chi',
  /(BÊN ĐƯỢC UỶ QUYỀN \(Bên B\):[\s\S]*?Nơi thường trú:)[\s\S]*?(\.Bằng hợp đồng này)/,
  '$1 {ben_b_dia_chi}$2'
);

zip.file('word/document.xml',xml);
fs.writeFileSync(file, zip.generate({type:'nodebuffer'}));
console.log('uy_quyen segment patch complete');
