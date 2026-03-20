import fs from "fs";
import PizZip from "pizzip";
const xml=new PizZip(fs.readFileSync('e:/Tool/public/templates/thua_ke.docx')).file('word/document.xml').asText();
const probes=[
'Hôm nay, vào hồi',
'..... phút',
'Địa điểm: Ủy ban nhân dân xã X',
'tại UBND xã X',
'Tại: UBND xã X.',
'Tôi: Phạm Ngọc Vinh - PCT UBND xã X. Chứng thực',
'Đỗ Hùng Hoài',
'+ Ông: Hoàng Văn Chính 02 (hai) bản;',
'Lưu tại: UBND xã X 01 (một) bản.',
'quyển số 01/2026 - SCT/GD./.'
];
for(const p of probes){console.log(p, xml.includes(p));}
