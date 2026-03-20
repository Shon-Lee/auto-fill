import fs from "fs";
import PizZip from "pizzip";

const templatePath = "public/templates/uy_quyen.docx";
const backupPath = "public/templates/uy_quyen.docx.bak";

// Restore from backup and do this properly
const backupContent = fs.readFileSync(backupPath, "binary");
const zip = new PizZip(backupContent);
let xml = zip.files["word/document.xml"].asText();

console.log("Careful surgical loop injection...\n");

// Strategy: Find exact location of first ben_a field and inject {#ds_ben_a} before it
// Find exact location of last ben_a field and inject {/ds_ben_a} after it

// 1. Inject {#ds_ben_a} before ben_a_ho_ten
const benAHoTenIdx = xml.indexOf("{ben_a_ho_ten}");
if (benAHoTenIdx >= 0) {
  // Find the <w:t> tag that contains this
  const textTagStart = xml.lastIndexOf("<w:t", benAHoTenIdx);
  const textTagEnd = xml.indexOf("</w:t>", benAHoTenIdx) + 6;
  
  // Insert loop open marker
  let newXml = xml.substring(0, textTagStart);
  newXml += '<w:t>{#ds_ben_a}</w:t><w:r><w:rPr></w:rPr>';
  newXml += xml.substring(textTagStart, textTagEnd);
  newXml += xml.substring(textTagEnd);
  xml = newXml;
  
  console.log("✓ Added {#ds_ben_a} before Ben A fields");
}

// 2. Replace ben_a_* with loopable names
xml = xml.replace(/{ben_a_ho_ten}/g, "{xung_ho}: {ho_ten}");
xml = xml.replace(/{ben_a_ngay_sinh}/g, "{ngay_sinh}");
xml = xml.replace(/{ben_a_cccd}/g, "{cccd}");
xml = xml.replace(/{ben_a_ngay_cap}/g, "{ngay_cap}");
xml = xml.replace(/{ben_a_dia_chi}/g, "{dia_chi}");

console.log("✓ Converted ben_a_* fields to loop names");

// 3. Inject {/ds_ben_a} after ben_a section (before "BÊN ĐƯỢC UỶ QUYỀN")
const benBHeaderIdx = xml.indexOf("BÊN ĐƯỢC UỶ QUYỀN");
if (benBHeaderIdx >= 0) {
  // Find </w:p> before this to close the loop properly
  const beforeHeader = xml.substring(0, benBHeaderIdx);
  const lastParaEnd = beforeHeader.lastIndexOf("</w:p>");
  
  if (lastParaEnd >= 0) {
    // Insert loop close before next para
    let newXml = xml.substring(0, lastParaEnd);
    newXml += "</w:p><w:p><w:r><w:rPr></w:rPr><w:t>{/ds_ben_a}</w:t></w:r></w:p>";
    newXml += xml.substring(lastParaEnd + 6);
    xml = newXml;
    
    console.log("✓ Added {/ds_ben_a} before Ben B section");
  }
}

// 4. Same for Ben B - inject {#ds_ben_b}
const benBHoTenIdx = xml.indexOf("{ben_b_ho_ten}");
if (benBHoTenIdx >= 0) {
  const textTagStart = xml.lastIndexOf("<w:t", benBHoTenIdx);
  let newXml = xml.substring(0, textTagStart);
  newXml += '<w:t>{#ds_ben_b}</w:t><w:r><w:rPr></w:rPr>';
  newXml += xml.substring(textTagStart);
  xml = newXml;
  
  console.log("✓ Added {#ds_ben_b} before Ben B");
}

// 5. Replace ben_b_* with loopable names
xml = xml.replace(/{ben_b_ho_ten}/g, "{xung_ho}: {ho_ten}");
xml = xml.replace(/{ben_b_ngay_sinh}/g, "{ngay_sinh}");
xml = xml.replace(/{ben_b_cccd}/g, "{cccd}");
xml = xml.replace(/{ben_b_ngay_cap}/g, "{ngay_cap}");
xml = xml.replace(/{ben_b_dia_chi}/g, "{dia_chi}");

console.log("✓ Converted ben_b_* fields");

// 6. Remove leftover ben_a2_* if they exist (they shouldn't be needed now)
// Keep them for backward compat but mark them
xml = xml.replace(/{ben_a2_ho_ten}/g, "{xung_ho}: {ho_ten}");
xml = xml.replace(/{ben_a2_ngay_sinh}/g, "{ngay_sinh}");
xml = xml.replace(/{ben_a2_cccd}/g, "{cccd}");
xml = xml.replace(/{ben_a2_ngay_cap}/g, "{ngay_cap}");

console.log("✓ Converted ben_a2_* fields");

// 7. Close ds_ben_b loop at end
const docEndIdx = xml.lastIndexOf("</w:body>");
if (docEndIdx >= 0) {
  let newXml = xml.substring(0, docEndIdx);
  newXml += "<w:p><w:r><w:rPr></w:rPr><w:t>{/ds_ben_b}</w:t></w:r></w:p>";
  newXml += xml.substring(docEndIdx);
  xml = newXml;
  
  console.log("✓ Added {/ds_ben_b} at end");
}

// Write back
zip.files["word/document.xml"].binary = true;
zip.file("word/document.xml", xml, { binary: true });

const newContent = zip.generate({ type: "nodebuffer" });
fs.writeFileSync(templatePath, newContent);

console.log("\n✅ Loop structure injected!");
