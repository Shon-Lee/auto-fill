import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

const template='e:/Tool/public/templates/bien_dong.docx';
const out='e:/Tool/generated/bien_dong_render_test.docx';
const data={
  ho_ten:'aaaaaaaa',
  giay_to_nhan_than:'aaaaaaaa',
  dia_chi:'aaaaaaaa',
  so_giay_chung_nhan:'aaaaaaaa',
  noi_dung_bien_dong:'aaa',
  thua_dat_so:'aaaa',
  to_ban_do_so:'aaaa',
  dien_tich:'aaaa'
};
const doc=new Docxtemplater(new PizZip(fs.readFileSync(template)),{paragraphLoop:true,linebreaks:true});
doc.render(data);
fs.writeFileSync(out,doc.getZip().generate({type:'nodebuffer'}));
const txt=new Docxtemplater(new PizZip(fs.readFileSync(out)),{paragraphLoop:true,linebreaks:true}).getFullText();
console.log(txt.includes('- Thửa đất số aaaa tờ bản đồ số: aaaa, diện tích: aaaa m2.'));
console.log(txt.includes('- Địa chỉ thửa đất: xã'));
console.log('rendered', out);
