import fs from "fs";
const xml=fs.readFileSync('e:/Tool/generated/_inspect_layout/mien_giam/word/document.xml','utf8');
const probes=['HOÀNG VĂN C','036068011111','X, ngày','xã X, tỉnh Ninh Bình','Phường/xã: X.','Tỉnh/thành phố: Ninh Bình','Hoàng Văn C'];
for (const p of probes){
  console.log(p, xml.includes(p));
}
