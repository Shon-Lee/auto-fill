import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

const template='e:/Tool/public/templates/bien_dong.docx';
const out='e:/Tool/generated/bien_dong_render_test.docx';
const data={
  ho_ten:'aaaaaaaa',
  giay_to_nhan_than:'aaaaaaaa',
  dia_chi:'aaaaaaa',
  so_giay_chung_nhan:'aaaaaaaa',
  noi_dung_bien_dong:'aaa',
  thua_dat_so:'aaaa',
  to_ban_do_so:'aaaa',
  dien_tich:'aaaa'
};
const doc=new Docxtemplater(new PizZip(fs.readFileSync(template)),{paragraphLoop:true,linebreaks:true});
doc.render(data);
fs.writeFileSync(out, doc.getZip().generate({type:'nodebuffer'}));

const renderedZip=new PizZip(fs.readFileSync(out));
const text=new Docxtemplater(renderedZip,{paragraphLoop:true,linebreaks:true}).getFullText();
const xml=renderedZip.file('word/document.xml').asText();
console.log('addrLine', text.includes('- Địa chỉ thửa đất: aaaaaaa.'));
console.log('signText', text.includes('aaaaaaaa'));
console.log('redInRendered', (xml.match(/<w:color w:val="FF0000"\/>/g)||[]).length);
console.log('output', out);
