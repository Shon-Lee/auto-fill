import fs from "fs";
import PizZip from "pizzip";

const file='e:/Tool/public/templates/mien_giam.docx';
const zip=new PizZip(fs.readFileSync(file));
let xml=zip.file('word/document.xml').asText();

const rules=[
  {
    name:'remove duplicated ten_nguoi_nop_thue run',
    re:/(\[01\] Tên người nộp thuế: \{ten_nguoi_nop_thue\} <\/w:t><\/w:r>)<w:r[\s\S]*?<w:t>\{ten_nguoi_nop_thue\}<\/w:t><\/w:r>/,
    to:'$1'
  },
  {
    name:'remove legacy mst runs',
    re:/(\[02\] Mã số thuế: \{ma_so_thue\} <\/w:t><\/w:r>)<w:r[\s\S]*?<w:t>03606801<\/w:t><\/w:r><w:r[\s\S]*?<w:t>1111<\/w:t><\/w:r>/,
    to:'$1'
  },
  {
    name:'remove legacy phuong_xa run',
    re:/(\[03a\] Phường\/xã: \{phuong_xa\} <\/w:t><\/w:r>)<w:r[\s\S]*?<w:t>X<\/w:t><\/w:r>/,
    to:'$1'
  }
];

for (const r of rules){
  const before=xml;
  xml=xml.replace(r.re,r.to);
  console.log(r.name, before===xml ? 'MISS':'OK');
}

zip.file('word/document.xml',xml);
fs.writeFileSync(file, zip.generate({type:'nodebuffer'}));
console.log('Applied XML cleanup rules.');
