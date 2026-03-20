import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

const template='e:/Tool/public/templates/thua_ke.docx';
const out='e:/Tool/generated/thua_ke_render_test.docx';
const data={
  gio_lap:'08',
  phut_lap:'30',
  ngay_lap:'20',
  thang_lap:'03',
  dia_diem_ubnd_xa:'X',
  ds_nguoi_thua_ke:[
    {stt:1,xung_ho:'a',ho_ten:'a',ngay_sinh:'a',so_cccd:'a',ngay_cap:'a',quan_he:'a',dia_chi_thuong_tru:'a'},
    {stt:2,xung_ho:'q',ho_ten:'q',ngay_sinh:'q',so_cccd:'q',ngay_cap:'q',quan_he:'q',dia_chi_thuong_tru:'q'}
  ],
  ten_cha_da_mat:'a',
  ten_me_da_mat:'a',
  noi_dung_thua_ke:'noi dung',
  xa_chung_thuc:'X',
  ngay_chung_thuc:'20',
  thang_chung_thuc:'03',
  nam_chung_thuc_bang_chu:'hai nghin khong tram hai muoi sau',
  nguoi_thuc_hien_chung_thuc:'A',
  nguoi_tiep_nhan_ho_so:'B',
  nguoi_duoc_cap_ban:'C',
  so_quyen_chung_thuc:'01/2026'
};
const doc=new Docxtemplater(new PizZip(fs.readFileSync(template)),{paragraphLoop:true,linebreaks:true});
doc.render(data);
fs.writeFileSync(out, doc.getZip().generate({type:'nodebuffer'}));
const txt=new Docxtemplater(new PizZip(fs.readFileSync(out)),{paragraphLoop:true,linebreaks:true}).getFullText();
const idx=txt.indexOf('Chúng tôi gồm có:');
console.log(txt.slice(idx, idx+450));
console.log('out',out);
