import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

const template='e:/Tool/public/templates/mien_giam.docx';
const out='e:/Tool/generated/mien_giam_render_test_xa.docx';
const data={
  xa_xu_ly:'Y',
  ten_nguoi_nop_thue:'a',
  ma_so_thue:'a',
  phuong_xa:'a',
  quan_huyen:'a',
  tinh_thanh:'a',
  dien_thoai:'a'
};
const doc=new Docxtemplater(new PizZip(fs.readFileSync(template)),{paragraphLoop:true,linebreaks:true});
doc.render(data);
fs.writeFileSync(out,doc.getZip().generate({type:'nodebuffer'}));
const txt=new Docxtemplater(new PizZip(fs.readFileSync(out)),{paragraphLoop:true,linebreaks:true}).getFullText();
console.log('dateLineOK', txt.includes('Y, ngày'));
console.log('kinhGuiOK', txt.includes('UBND xã Y, tỉnh Ninh Bình'));
console.log('phuongXaStillSeparate', txt.includes('[03a] Phường/xã: a'));
console.log((txt.match(/\{xa_xu_ly\}/g)||[]).length===0 ? 'no_raw_tags' : 'has_raw_tags');
