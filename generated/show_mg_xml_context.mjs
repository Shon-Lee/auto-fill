import fs from "fs";
import PizZip from "pizzip";
const p='e:/Tool/public/templates/mien_giam.docx';
const xml=new PizZip(fs.readFileSync(p)).file('word/document.xml').asText();
const keys=['ten_nguoi_nop_thue','ma_so_thue','phuong_xa','quan_huyen','tinh_thanh','dien_thoai'];
for(const k of keys){
  let idx=0; let n=0;
  while((idx=xml.indexOf('{'+k+'}',idx))!==-1){
    n++;
    const s=Math.max(0,idx-180), e=Math.min(xml.length,idx+220);
    console.log(`\n=== ${k} #${n} ===`);
    console.log(xml.slice(s,e));
    idx+=k.length+2;
  }
}
