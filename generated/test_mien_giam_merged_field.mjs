import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

const template='e:/Tool/public/templates/mien_giam.docx';
const out='e:/Tool/generated/mien_giam_render_test_merged.docx';
const data={
  ten_nguoi_nop_thue:'a',
  ma_so_thue:'a',
  phuong_xa:'Y',
  quan_huyen:'Q',
  tinh_thanh:'T',
  dien_thoai:'D'
};
const doc=new Docxtemplater(new PizZip(fs.readFileSync(template)),{paragraphLoop:true,linebreaks:true});
doc.render(data);
fs.writeFileSync(out,doc.getZip().generate({type:'nodebuffer'}));
const txt=new Docxtemplater(new PizZip(fs.readFileSync(out)),{paragraphLoop:true,linebreaks:true}).getFullText();
console.log('dateLine', txt.includes('Y, ngày'));
console.log('kinhGui', txt.includes('UBND xã Y'));
console.log('diaChi03a', txt.includes('[03a] Phường/xã: Y'));
console.log('no xa_xu_ly tag', !txt.includes('{xa_xu_ly}'));
