import fs from "fs";
import PizZip from "pizzip";

const backupPath = 'public/templates/uy_quyen.docx.bak';
const outputPath = 'public/templates/uy_quyen.docx';
const xmlPath = 'word/document.xml';

function getParagraphs(xml) {
  return [...xml.matchAll(/<w:p\b[\s\S]*?<\/w:p>/g)].map((m) => m[0]);
}

function extractParts(paragraphXml) {
  const open = paragraphXml.match(/^<w:p\b[^>]*>/)?.[0];
  const pPr = paragraphXml.match(/<w:pPr>[\s\S]*?<\/w:pPr>/)?.[0];
  const runPr = paragraphXml.match(/<w:rPr>[\s\S]*?<\/w:rPr>/)?.[0] || '';
  if (!open || !pPr) throw new Error('Could not parse paragraph');
  return { open, pPr, runPr };
}

function escapeXml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function setJc(pPr, value) {
  if (/<w:jc\b[^>]*\/>/.test(pPr)) return pPr.replace(/<w:jc\b[^>]*\/>/g, `<w:jc w:val="${value}"/>`);
  return pPr.replace('</w:pPr>', `<w:jc w:val="${value}"/></w:pPr>`);
}

function setInd(pPr, attrs) {
  if (/<w:ind\b[^>]*\/>/.test(pPr)) return pPr.replace(/<w:ind\b[^>]*\/>/g, `<w:ind ${attrs}/>`);
  return pPr.replace('</w:pPr>', `<w:ind ${attrs}/></w:pPr>`);
}

function buildParagraph(templateParagraph, text, opts = {}) {
  const { open, runPr } = extractParts(templateParagraph);
  let { pPr } = extractParts(templateParagraph);
  if (opts.jc) pPr = setJc(pPr, opts.jc);
  if (opts.ind) pPr = setInd(pPr, opts.ind);
  const safeText = escapeXml(text);
  const preserve = /^\s|\s$/.test(text) ? ' xml:space="preserve"' : '';
  return `${open}${pPr}<w:r>${runPr}<w:t${preserve}>${safeText}</w:t></w:r></w:p>`;
}

const zip = new PizZip(fs.readFileSync(backupPath));
let xml = zip.file(xmlPath).asText();
const paragraphs = getParagraphs(xml);

const replacements = new Map([
  [7, buildParagraph(paragraphs[7], '{ben_a_block}', { jc: 'left', ind: 'w:left="540"' })],
  [8, ''],
  [9, ''],
  [10, ''],
  [11, ''],
  [12, ''],
  [14, buildParagraph(paragraphs[14], '{ben_b_block}', { jc: 'left', ind: 'w:left="540"' })],
  [15, ''],
  [16, ''],
  [19, buildParagraph(paragraphs[19], '1. Giấy chứng nhận quyền sử dụng đất, quyền sở hữu nhà ở và tải sản khác gắn liền với đất số {so_giay_chung_nhan}, số vào sổ …{so_vao_so}, do {co_quan_cap_gcn} cấp ngày {ngay_cap_gcn}; tại thửa đất số {thua_dat_so}; {to_ban_do_info} {dien_tich_loai_dat}.')],
  [69, buildParagraph(paragraphs[69], 'Lời chứng chứng thực giao dịch tại {ubnd_xa_chung_thuc}', { jc: 'center' })],
  [72, buildParagraph(paragraphs[72], 'Tại: UBND xã {dia_diem_lap_hop_dong}, tỉnh Ninh Bình.')],
  [73, buildParagraph(paragraphs[73], 'Tôi: {nguoi_thuc_hien_chung_thuc} - PCT UBND xã {dia_diem_lap_hop_dong}, tỉnh Ninh Bình.')],
  [76, buildParagraph(paragraphs[76], '{chung_thuc_giao_ket_block}', { jc: 'left', ind: 'w:left="567"' })],
  [77, ''],
  [78, ''],
  [82, buildParagraph(paragraphs[82], '{chung_thuc_cap_ban_block}', { jc: 'left', ind: 'w:left="567"' })],
  [83, ''],
]);

for (const [index, next] of replacements.entries()) {
  xml = xml.replace(paragraphs[index], next);
}

zip.file(xmlPath, xml);
fs.writeFileSync(outputPath, zip.generate({ type: 'nodebuffer' }));
console.log('Rebuilt uy_quyen.docx from backup');
