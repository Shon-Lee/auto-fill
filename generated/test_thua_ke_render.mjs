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
  dia_diem_ubnd_xa:'Xuan Truong',
  ds_nguoi_thua_ke:[
    {stt:1,xung_ho:'Ông',ho_ten:'Nguyen Van A',ngay_sinh:'01/01/1970',so_cccd:'0123456789',ngay_cap:'01/01/2020',quan_he:'con de',dia_chi_thuong_tru:'Xa A'},
    {stt:2,xung_ho:'Bà',ho_ten:'Tran Thi B',ngay_sinh:'02/02/1972',so_cccd:'9876543210',ngay_cap:'02/02/2021',quan_he:'con de',dia_chi_thuong_tru:'Xa B'}
  ],
  ten_cha_da_mat:'Cha A',
  ten_me_da_mat:'Me B',
  noi_dung_thua_ke:'NOI DUNG THUA KE TEST',
  xa_chung_thuc:'Xuan Truong',
  ngay_chung_thuc:'20',
  thang_chung_thuc:'03',
  nam_chung_thuc_bang_chu:'hai nghin khong tram hai muoi sau',
  nguoi_thuc_hien_chung_thuc:'Nguoi C',
  nguoi_tiep_nhan_ho_so:'Nguoi D',
  nguoi_duoc_cap_ban:'Nguoi E',
  so_quyen_chung_thuc:'01/2026'
};

const doc=new Docxtemplater(new PizZip(fs.readFileSync(template)),{paragraphLoop:true,linebreaks:true});
doc.render(data);
fs.writeFileSync(out, doc.getZip().generate({type:'nodebuffer'}));
const text=new Docxtemplater(new PizZip(fs.readFileSync(out)),{paragraphLoop:true,linebreaks:true}).getFullText();
console.log('hasLoopRow1', text.includes('1. Ông: Nguyen Van A'));
console.log('hasLoopRow2', text.includes('2. Bà: Tran Thi B'));
console.log('hasNoiDung', text.includes('NOI DUNG THUA KE TEST'));
console.log('out', out);
