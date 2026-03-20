import fs from "fs";
import PizZip from "pizzip";

const templatePath = "public/templates/uy_quyen.docx";

function escapeXml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getParagraphs(xml) {
  return [...xml.matchAll(/<w:p\b[\s\S]*?<\/w:p>/g)].map((match) => match[0]);
}

function extractParts(paragraphXml) {
  const open = paragraphXml.match(/^<w:p\b[^>]*>/)?.[0];
  const pPr = paragraphXml.match(/<w:pPr>[\s\S]*?<\/w:pPr>/)?.[0];
  const runPr = paragraphXml.match(/<w:rPr>[\s\S]*?<\/w:rPr>/)?.[0] || "";

  if (!open || !pPr) {
    throw new Error("Could not parse paragraph template");
  }

  return { open, pPr, runPr };
}

function sanitizeParagraphProps(pPr) {
  let next = pPr.replace(/<w:jc w:val="[^"]*"\/>/g, '<w:jc w:val="left"/>');

  if (/<w:ind\b[^>]*\/>/.test(next)) {
    next = next.replace(/<w:ind\b[^>]*\/>/g, '<w:ind w:left="540"/>');
  } else {
    next = next.replace("</w:pPr>", '<w:ind w:left="540"/></w:pPr>');
  }

  return next;
}

function buildCleanParagraph(templateParagraph, text) {
  const { open, pPr, runPr } = extractParts(templateParagraph);
  const safeText = escapeXml(text);
  const preserve = /^\s|\s$/.test(text) ? ' xml:space="preserve"' : "";

  return `${open}${sanitizeParagraphProps(pPr)}<w:r>${runPr}<w:t${preserve}>${safeText}</w:t></w:r></w:p>`;
}

const buffer = fs.readFileSync(templatePath);
const zip = new PizZip(buffer);
const xmlPath = "word/document.xml";
const xml = zip.file(xmlPath).asText();
const paragraphs = getParagraphs(xml);

const paragraphBenABlock = paragraphs[7];
const paragraphBenBBlock = paragraphs[9];
const paragraphChungThucA = paragraphs[68];
const paragraphChungThucA2 = paragraphs[69];
const paragraphChungThucB = paragraphs[70];
const paragraphCapBanA = paragraphs[74];
const paragraphCapBanB = paragraphs[75];

if (!paragraphBenABlock?.includes("{ben_a_block}")) {
  throw new Error("Unexpected template state for ben_a_block paragraph");
}

if (!paragraphChungThucA?.includes("{ben_a_ho_ten}")) {
  throw new Error("Unexpected template state for chung thuc ben A paragraph");
}

let nextXml = xml;
nextXml = nextXml.replace(paragraphBenABlock, buildCleanParagraph(paragraphBenABlock, "{ben_a_block}"));
nextXml = nextXml.replace(paragraphBenBBlock, buildCleanParagraph(paragraphBenBBlock, "{ben_b_block}"));
nextXml = nextXml.replace(paragraphChungThucA, buildCleanParagraph(paragraphChungThucA, "{chung_thuc_giao_ket_block}"));
nextXml = nextXml.replace(paragraphChungThucA2, "");
nextXml = nextXml.replace(paragraphChungThucB, "");
nextXml = nextXml.replace(paragraphCapBanA, buildCleanParagraph(paragraphCapBanA, "{chung_thuc_cap_ban_block}"));
nextXml = nextXml.replace(paragraphCapBanB, "");

zip.file(xmlPath, nextXml);
fs.writeFileSync(templatePath, zip.generate({ type: "nodebuffer" }));

console.log("Patched uy_quyen.docx with clean dynamic block paragraphs.");
