import fs from "fs";
import PizZip from "pizzip";

const p='e:/Tool/public/templates/bien_dong.docx';
const xml=new PizZip(fs.readFileSync(p)).file('word/document.xml').asText();
const markers=['2. Nội dung biến động (3):','- {noi_dung_bien_dong}','- Thửa đất số {thua_dat_so}','- Địa chỉ thửa đất:','- Không có nhu cầu cấp mới Giấy chứng nhận'];
for (const m of markers){
  const i=xml.indexOf(m);
  console.log('\n===',m,'idx',i,'===');
  if(i>=0){
    const s=Math.max(0,i-420), e=Math.min(xml.length,i+620);
    console.log(xml.slice(s,e));
  }
}
