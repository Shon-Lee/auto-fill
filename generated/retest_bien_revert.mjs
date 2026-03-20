import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

const template='e:/Tool/public/templates/bien_dong.docx';
const out='e:/Tool/generated/bien_dong_render_test.docx';
const data={
  ho_ten:'aaaaaaaa',
  giay_to_nhan_than:'aaaaaaaa',
  dia_chi:'aaaaaaa',
  thua_dat_so:'aaaa',
  to_ban_do_so:'aaaa',
  dien_tich:'aaaa',
  noi_dung_bien_dong:'aaa'
};
const doc=new Docxtemplater(new PizZip(fs.readFileSync(template)),{paragraphLoop:true,linebreaks:true});
doc.render(data);
fs.writeFileSync(out,doc.getZip().generate({type:'nodebuffer'}));
const text=new Docxtemplater(new PizZip(fs.readFileSync(out)),{paragraphLoop:true,linebreaks:true}).getFullText();
console.log('hasOriginalLine', text.includes('2. Nội dung biến động (3):'));
console.log('hasAddedLine', text.includes('Số giấy chứng nhận'));
console.log('hasAddressData', text.includes('- Địa chỉ thửa đất: aaaaaaa.'));
