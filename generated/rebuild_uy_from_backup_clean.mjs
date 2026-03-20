import fs from "fs";
import PizZip from "pizzip";

const backupPath = "public/templates/uy_quyen.docx.bak";
const outPath = "public/templates/uy_quyen.docx";

const zip = new PizZip(fs.readFileSync(backupPath, "binary"));
let xml = zip.files["word/document.xml"].asText();

// Normalize all red placeholder color to black.
xml = xml.replace(/w:color w:val="FF0000"/g, 'w:color w:val="000000"');

function replaceUyQuyenPartySection(sourceXml) {
  const aMarker = "<w:t>BÊN UỶ QUYỀN</w:t>";
  const bodyMarker = "<w:t>Bằng hợp đồng này";

  const aPos = sourceXml.indexOf(aMarker);
  const bodyPos = sourceXml.indexOf(bodyMarker);
  if (aPos === -1 || bodyPos === -1 || bodyPos <= aPos) {
    return sourceXml;
  }

  const startP = sourceXml.lastIndexOf("<w:p", aPos);
  const endP = sourceXml.lastIndexOf("<w:p", bodyPos);
  if (startP === -1 || endP === -1 || endP <= startP) {
    return sourceXml;
  }

  const cleanSection = [
    '<w:p w:rsidR="00684CA1" w:rsidRPr="008A2167" w:rsidRDefault="009B1949" w:rsidP="00A93C78"><w:pPr><w:spacing w:before="120" w:after="0" w:line="240" w:lineRule="auto"/><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:color w:val="000000"/><w:sz w:val="25"/><w:szCs w:val="25"/></w:rPr><w:t>BÊN UỶ QUYỀN (Bên A):</w:t></w:r></w:p>',
    '<w:p w:rsidR="0056169A" w:rsidRPr="008A2167" w:rsidRDefault="00694953" w:rsidP="00A93C78"><w:pPr><w:spacing w:after="120" w:line="240" w:lineRule="auto"/><w:ind w:firstLine="540"/><w:jc w:val="both"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:color w:val="000000"/><w:sz w:val="25"/><w:szCs w:val="25"/></w:rPr><w:t>{ben_a_block}</w:t></w:r></w:p>',
    '<w:p w:rsidR="00684CA1" w:rsidRPr="008A2167" w:rsidRDefault="009B1949" w:rsidP="00A93C78"><w:pPr><w:spacing w:before="120" w:after="0" w:line="240" w:lineRule="auto"/><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:color w:val="000000"/><w:sz w:val="25"/><w:szCs w:val="25"/></w:rPr><w:t>BÊN ĐƯỢC UỶ QUYỀN (Bên B):</w:t></w:r></w:p>',
    '<w:p w:rsidR="0056169A" w:rsidRPr="008A2167" w:rsidRDefault="00694953" w:rsidP="00A93C78"><w:pPr><w:spacing w:after="120" w:line="240" w:lineRule="auto"/><w:ind w:firstLine="540"/><w:jc w:val="both"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:color w:val="000000"/><w:sz w:val="25"/><w:szCs w:val="25"/></w:rPr><w:t>{ben_b_block}</w:t></w:r></w:p>'
  ].join("");

  return `${sourceXml.slice(0, startP)}${cleanSection}${sourceXml.slice(endP)}`;
}

const regex = /<w:t([^>]*)>([^<]*)<\/w:t>/g;
const replacements = new Map([
  // Main section A/B labels and addresses
  [21, "{ben_a_block}"],
  [22, ""],
  [23, ""],
  [24, ""],
  [25, ""],
  [26, ""],
  [27, ""],
  [28, ""],
  [29, ""],
  [30, ""],
  [31, ""],
  [32, ""],
  [33, ""],
  [34, ""],
  [35, ""],
  [36, ""],
  [37, ""],
  [38, ""],
  [39, ""],
  [40, ""],
  [41, ""],
  [42, ""],
  [43, ""],
  [44, ""],
  [45, ""],
  [46, ""],
  [47, ""],
  [48, ""],
  [49, ""],
  [50, ""],
  [51, ""],
  [52, ""],
  [53, ""],
  [54, ""],
  [55, ""],
  [56, ""],
  [57, ""],
  [58, ""],
  [61, "{ben_b_block}"],
  [62, ""],
  [63, ""],
  [64, ""],
  [65, ""],
  [66, ""],
  [67, ""],
  [68, ""],
  [69, ""],
  [70, ""],
  [71, ""],
  [72, ""],
  [73, ""],
  [74, ""],
  [75, ""],
  [76, ""],
  [77, ""],
  [78, ""],
  [79, ""],
  [80, ""],
  [81, ""],
  [82, ""],
  [83, ""],
  [84, ""],
  [85, ""],

  // Land info simplified fields
  [100, "; {to_ban_do_info}"],
  [101, ""],
  [102, ""],
  [103, ""],
  [104, ""],
  [105, " {dien_tich_loai_dat}"],
  [106, ""],
  [107, ""],
  [108, ""],
  [109, ""],
  [110, ""],

  // Remove inline noi_dung value from heading
  [114, "NỘI DUNG UỶ QUYỀN"],

  // Certification section dynamic values
  [195, "xã {dia_diem_lap_hop_dong}"],
  [199, "{dia_diem_lap_hop_dong}"],
  [207, "{ben_a_ho_ten}"],
  [212, "{ben_a2_ho_ten}"],
  [216, "{ben_b_ho_ten}"],
  [219, " {ben_b_cccd}{ben_chung_thuc_bo_sung}"],
  [229, "{ben_a_ho_ten}"],
  [236, "{ben_b_ho_ten}"]
]);

let idx = 0;
xml = xml.replace(regex, (_all, attrs, text) => {
  const out = replacements.has(idx) ? replacements.get(idx) : text;
  idx += 1;
  return `<w:t${attrs}>${out}</w:t>`;
});

xml = replaceUyQuyenPartySection(xml);

zip.file("word/document.xml", xml);
fs.writeFileSync(outPath, zip.generate({ type: "nodebuffer" }));

console.log("Rebuilt uy_quyen from backup and applied replacements:", replacements.size);
