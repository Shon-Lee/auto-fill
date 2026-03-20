import fs from "fs";
import PizZip from "pizzip";
const xml=new PizZip(fs.readFileSync('e:/Tool/public/templates/thua_ke.docx')).file('word/document.xml').asText();
for(const token of ['Địa điểm:','UBND xã','Tại:','quyển số','Số chứng thực','Ông: Hoàng Văn Chính','Phạm Ngọc Vinh']){
  const i=xml.indexOf(token);
  console.log('\n',token,'idx',i);
  if(i>=0){console.log(xml.slice(Math.max(0,i-180),Math.min(xml.length,i+260)));}
}
