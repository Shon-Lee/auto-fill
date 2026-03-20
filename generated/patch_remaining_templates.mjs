import fs from "fs";
import PizZip from "pizzip";

function editDocx(filePath, editFn) {
  const zip = new PizZip(fs.readFileSync(filePath));
  let xml = zip.file("word/document.xml").asText();
  xml = editFn(xml);
  zip.file("word/document.xml", xml);
  fs.writeFileSync(filePath, zip.generate({ type: "nodebuffer" }));
}

function replaceAllLogged(xml, rules, label) {
  let out = xml;
  console.log(`\n[${label}]`);
  for (const r of rules) {
    const before = out;
    out = out.replace(r.from, r.to);
    console.log(`${r.name}: ${before === out ? "MISS" : "OK"}`);
  }
  return out;
}

// bien_dong: replace key sample values with placeholders (keep layout)
editDocx("e:/Tool/public/templates/bien_dong.docx", (xml) =>
  replaceAllLogged(
    xml,
    [
      {
        name: "ho_ten",
        from: "a) Tên(2): HOÀNG VĂN C",
        to: "a) Tên(2): {ho_ten}"
      },
      {
        name: "giay_to_nhan_than",
        from: "b) Giấy tờ nhân thân/pháp nhân(2): 03606801111",
        to: "b) Giấy tờ nhân thân/pháp nhân(2): {giay_to_nhan_than}"
      },
      {
        name: "dia_chi",
        from: "c) Địa chỉ(2): Xã Xuân, tỉnh Ninh Bình.",
        to: "c) Địa chỉ(2): {dia_chi}."
      },
      {
        name: "noi_dung_bien_dong",
        from: "- Nhận thừa kế QSDĐ",
        to: "- {noi_dung_bien_dong}"
      },
      {
        name: "thua_dat_to_dien_tich",
        from: "- Thửa đất số 37 tờ bản đồ số: 63, diện tích: 270,0 m2 loại đất (ONT).",
        to: "- Thửa đất số {thua_dat_so} tờ bản đồ số: {to_ban_do_so}, diện tích: {dien_tich} m2 loại đất (ONT)."
      },
      {
        name: "so_giay_chung_nhan_insert",
        from: "2. Nội dung biến động (3):",
        to: "2. Nội dung biến động (3): Số giấy chứng nhận: {so_giay_chung_nhan}."
      },
      {
        name: "signature_name",
        from: "Hoàng Văn C",
        to: "{ho_ten}"
      }
    ],
    "bien_dong"
  )
);

// thua_ke: replace static heir list block with loop-driven block
editDocx("e:/Tool/public/templates/thua_ke.docx", (xml) => {
  const re = /Chúng tôi gồm có:[\s\S]*?Chúng tôi là những người thừa kế theo pháp luật/;
  const replacement =
    "Chúng tôi gồm có:{#danh_sach}Ông/Bà: {ten}; CCCD: {cccd}; Thường trú tại: {dia_chi}. {/danh_sach}Chúng tôi là những người thừa kế theo pháp luật";
  const before = xml;
  const out = xml.replace(re, replacement);
  console.log(`\n[thua_ke]`);
  console.log(`heir_list_block: ${before === out ? "MISS" : "OK"}`);
  return out;
});

// uy_quyen: inject fields for party info + content while keeping core layout text
editDocx("e:/Tool/public/templates/uy_quyen.docx", (xml) =>
  replaceAllLogged(
    xml,
    [
      {
        name: "ben_a_ho_ten",
        from: "Ông: HOÀNG VĂN C",
        to: "Ông: {ben_a_ho_ten}"
      },
      {
        name: "ben_a_cccd",
        from: "Căn cước số: 036068011111",
        to: "Căn cước số: {ben_a_cccd}"
      },
      {
        name: "ben_a_dia_chi",
        from: "Nơi thường trú: xã X, tỉnh Ninh Bình.",
        to: "Nơi thường trú: {ben_a_dia_chi}."
      },
      {
        name: "ben_b_ho_ten",
        from: "Bà: BÙI THU Q",
        to: "Bà: {ben_b_ho_ten}"
      },
      {
        name: "ben_b_cccd",
        from: "CCCD số: 036196019000",
        to: "CCCD số: {ben_b_cccd}"
      },
      {
        name: "ben_b_dia_chi",
        from: "Nơi thường trú: xã X, tỉnh Ninh Bình.Bằng hợp đồng này",
        to: "Nơi thường trú: {ben_b_dia_chi}.Bằng hợp đồng này"
      },
      {
        name: "noi_dung_uy_quyen_insert",
        from: "ĐIỀU 2: NỘI DUNG UỶ QUYỀN",
        to: "ĐIỀU 2: NỘI DUNG UỶ QUYỀN {noi_dung_uy_quyen}"
      }
    ],
    "uy_quyen"
  )
);

console.log("\nPatched thua_ke, bien_dong, uy_quyen templates.");
