import fs from "fs";
import PizZip from "pizzip";
const file='e:/Tool/public/templates/thua_ke.docx';
const xml=new PizZip(fs.readFileSync(file)).file('word/document.xml').asText();
const probes=[
  'Hôm nay, vào hồi',
  'Chúng tôi gồm có:',
  'Chúng tôi là những người thừa kế theo pháp luật',
  'Chúng tôi xin cam đoan:',
  'Lời chứng chứng thực văn bản phân chia di sản',
  'Ngày ........... tháng … năm 2026',
  'Tại: UBND xã X.',
  'Ông/Bà',
  'quyển số'
];
for(const p of probes){
  console.log(p, xml.includes(p));
}
