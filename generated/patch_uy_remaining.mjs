import fs from "fs";
import PizZip from "pizzip";

function replaceNthRegex(text, regex, replacer, nth) {
  let count = 0;
  return text.replace(regex, (...args) => {
    count += 1;
    if (count === nth) return typeof replacer === "function" ? replacer(...args) : replacer;
    return args[0];
  });
}

const file='e:/Tool/public/templates/uy_quyen.docx';
const zip=new PizZip(fs.readFileSync(file));
let xml=zip.file('word/document.xml').asText();

const before=xml;
xml = xml.replace(/Căn cước số:\s*036068011111,/g, 'Căn cước số: {ben_a_cccd},');
xml = replaceNthRegex(xml, /Nơi thường trú:\s*xã X, tỉnh Ninh Bình\./g, 'Nơi thường trú: {ben_a_dia_chi}.', 1);
xml = replaceNthRegex(xml, /Nơi thường trú:\s*xã X, tỉnh Ninh Bình\./g, 'Nơi thường trú: {ben_b_dia_chi}.', 3);
xml = xml.replace(/ĐIỀU 2:[\s\S]*?NỘI DUNG UỶ QUYỀN/g, (m) => m.includes('{noi_dung_uy_quyen}') ? m : m + ' {noi_dung_uy_quyen}');

console.log('changed', before===xml ? 'NO':'YES');
zip.file('word/document.xml',xml);
fs.writeFileSync(file, zip.generate({type:'nodebuffer'}));
