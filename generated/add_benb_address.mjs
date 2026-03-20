import fs from "fs";
import PizZip from "pizzip";

const templatePath = "public/templates/uy_quyen.docx";
const content = fs.readFileSync(templatePath, "binary");
const zip = new PizZip(content);
let xml = zip.files["word/document.xml"].asText();

console.log("Inserting ben_b_dia_chi field properly...\n");

// Find the exact pattern and insert after the closing </w:p> of Ben B section
// Pattern: {ben_b_ngay_cap}</w:t></w:r><w:r...><w:t>.</w:t></w:r></w:p>
// We want to insert a new run with {ben_b_dia_chi} before the closing </w:p>

// This is the Ben B paragraph ending
const pattern = /({ben_b_ngay_cap}<\/w:t><\/w:r><w:r[^>]*><w:rPr>[^<]*<\/w:rPr><w:t>\.[^<]*<\/w:t><\/w:r>)<\/w:p>/;

if (pattern.test(xml)) {
  console.log("✓ Found exact pattern");
  
  // The replacement: insert address field before closing </w:p>
  xml = xml.replace(
    pattern,
    '$1 Nơi thường trú: <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/></w:rPr><w:t> {ben_b_dia_chi}</w:t></w:r><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/></w:rPr><w:t>.</w:t></w:r></w:p>'
  );
  
  console.log("✓ Address field inserted");
} else {
  console.log("✗ Pattern not found, trying simpler replacement");
  
  // Simpler approach: replace ". " before next section
  xml = xml.replace(
    /({ben_b_ngay_cap}<\/w:t>.*?<\/w:p>)/,
    function(match) {
      // Insert before closing </w:p>
      return match.replace(
        '</w:p>',
        ' Nơi thường trú: <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/></w:rPr><w:t>{ben_b_dia_chi}</w:t></w:r>.</w:p>'
      );
    }
  );
  console.log("✓ Simpler pattern applied");
}

// Write back
zip.files["word/document.xml"].binary = true;
zip.file("word/document.xml", xml, { binary: true });

const newContent = zip.generate({ type: "nodebuffer" });
fs.writeFileSync(templatePath, newContent);

console.log("\n✅ ben_b_dia_chi field added!");

// Verify
const checkZip = new PizZip(newContent);
const checkXml = checkZip.files["word/document.xml"].asText();
const tags = [...new Set(checkXml.match(/{[\w_]+}/g) || [])];

console.log("\n✓ Final tags (should include ben_b_dia_chi):");
tags.sort().forEach(t => {
  if (t === '{ben_b_dia_chi}') console.log("  >>>", t);
  else if (t.includes('ben_') || t.includes('dia')) console.log(" ", t);
});

const hasBenBAddr = tags.includes('{ben_b_dia_chi}');
console.log("\n" + (hasBenBAddr ? "✓" : "✗") + " ben_b_dia_chi present");
