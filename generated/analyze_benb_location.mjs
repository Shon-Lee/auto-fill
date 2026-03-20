import fs from "fs";
import PizZip from "pizzip";

const templatePath = "public/templates/uy_quyen.docx";
const content = fs.readFileSync(templatePath, "binary");
const zip = new PizZip(content);
let xml = zip.files["word/document.xml"].asText();

console.log("Adding ben_b_dia_chi address field...\n");

// Find context around ben_b_ngay_cap
const benBIdx = xml.indexOf("ben_b_ngay_cap");
if (benBIdx >= 0) {
  const start = Math.max(0, benBIdx - 200);
  const end = Math.min(xml.length, benBIdx + 400);
  const context = xml.substring(start, end);
  
  console.log("Context around ben_b_ngay_cap:");
  console.log(context);
  console.log("\n");
  
  // Look for the closing of this field
  const afterCapIdx = xml.indexOf("}", benBIdx);
  const nextTextIdx = xml.indexOf("<w:t", afterCapIdx);
  
  if (nextTextIdx >= 0) {
    const nextTextEnd = xml.indexOf("</w:t>", nextTextIdx);
    const nextText = xml.substring(nextTextIdx, nextTextEnd + 6);
    console.log("Next text run after ben_b_ngay_cap:");
    console.log(nextText);
  }
}

// Try a simpler approach: look for pattern ". Nơi thường trú: " or similar
// and if it comes after ben_b, insert the field there

// First, let's find where Ben B section ends
const benBCapIdx = xml.indexOf("{ben_b_ngay_cap}");
const benBCapClose = xml.indexOf("</w:t>", benBCapIdx) + 6;

// Look for next text node after that
const afterBenB = xml.substring(benBCapClose, benBCapClose + 500);
console.log("\n300 chars after ben_b_ngay_cap closing tag:");
console.log(afterBenB);

// Now find the Bên A section (next major section) that follows Ben B
const benAIdx = xml.indexOf("Bên A uỷ quyền", benBCapClose);
if (benAIdx >= 0) {
  console.log("\n✓ Found 'Bên A uỷ quyền' after Ben B");
  
  // Insert address field before this
  const insertPos = benAIdx - 50; // Back up a bit to find good insertion point
  let insertText = ". Nơi thường trú: {ben_b_dia_chi}.";
  
  // Find a good <w:t> boundary
  const beforeBenA = xml.substring(Math.max(0, benAIdx - 200), benAIdx);
  console.log("Before 'Bên A uỷ quyền':");
  console.log(beforeBenA);
}
