import fs from "fs";
import PizZip from "pizzip";

function replaceNth(text, search, replace, nth) {
  let fromIndex = 0;
  for (let i = 1; i <= nth; i += 1) {
    const idx = text.indexOf(search, fromIndex);
    if (idx === -1) return { text, ok: false };
    if (i === nth) {
      return {
        text: text.slice(0, idx) + replace + text.slice(idx + search.length),
        ok: true
      };
    }
    fromIndex = idx + search.length;
  }
  return { text, ok: false };
}

function patchUyQuyen() {
  const file = "e:/Tool/public/templates/uy_quyen.docx";
  const zip = new PizZip(fs.readFileSync(file));
  let xml = zip.file("word/document.xml").asText();

  const ops = [
    ["ben_a_ho_ten", "HOÀNG VĂN C", "{ben_a_ho_ten}", 1],
    ["ben_a_cccd", "036068011111", "{ben_a_cccd}", 1],
    ["ben_a_dia_chi", "xã X, tỉnh Ninh Bình.", "{ben_a_dia_chi}.", 1],
    ["ben_b_ho_ten", "BÙI THU Q", "{ben_b_ho_ten}", 1],
    ["ben_b_cccd", "036196019000", "{ben_b_cccd}", 1],
    ["ben_b_dia_chi", "xã X, tỉnh Ninh Bình.", "{ben_b_dia_chi}.", 3],
    ["noi_dung_uy_quyen", "ĐIỀU 2: NỘI DUNG UỶ QUYỀN", "ĐIỀU 2: NỘI DUNG UỶ QUYỀN {noi_dung_uy_quyen}", 1]
  ];

  console.log("[uy_quyen positional patch]");
  for (const [name, search, replacement, nth] of ops) {
    const result = replaceNth(xml, search, replacement, nth);
    xml = result.text;
    console.log(`${name}: ${result.ok ? "OK" : "MISS"}`);
  }

  zip.file("word/document.xml", xml);
  fs.writeFileSync(file, zip.generate({ type: "nodebuffer" }));
}

function fixBienDongDuplicate() {
  const file = "e:/Tool/public/templates/bien_dong.docx";
  const zip = new PizZip(fs.readFileSync(file));
  let xml = zip.file("word/document.xml").asText();
  const from = "2. Nội dung biến động (3): Số giấy chứng nhận: {so_giay_chung_nhan}. Số giấy chứng nhận: {so_giay_chung_nhan}.";
  const to = "2. Nội dung biến động (3): Số giấy chứng nhận: {so_giay_chung_nhan}.";
  const before = xml;
  xml = xml.replace(from, to);
  console.log("[bien_dong duplicate so_gcn]", before === xml ? "MISS" : "OK");
  zip.file("word/document.xml", xml);
  fs.writeFileSync(file, zip.generate({ type: "nodebuffer" }));
}

fixBienDongDuplicate();
patchUyQuyen();
console.log("Patch done");
