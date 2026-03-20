import fs from "fs";
import PizZip from "pizzip";

const templatePath = "public/templates/uy_quyen.docx";
const content = fs.readFileSync(templatePath, "binary");
const zip = new PizZip(content);
let xml = zip.files["word/document.xml"].asText();

console.log("Adding missing xung_ho and dia_chi fields to template...\n");

// Add Ben A xung_ho before ho_ten
xml = xml.replace(
  /Ông\s*:\s*{ben_a_ho_ten}/g,
  "Ông: {ben_a_xung_ho}: {ben_a_ho_ten}"
);

// Add Ben A2 xung_ho
xml = xml.replace(
  /Bà\s*:\s*{ben_a2_ho_ten}/g,
  "Bà: {ben_a2_xung_ho}: {ben_a2_ho_ten}"
);

// Add Ben A2 dia_chi if missing
if (!xml.includes("{ben_a2_dia_chi}")) {
  // Insert after ngay_cap
  xml = xml.replace(
    /({ben_a2_ngay_cap}[\s\S]*?\.)(?=\s*BÊN ĐƯỢC)/,
    "$1 Nơi thường trú: {ben_a2_dia_chi}."
  );
  console.log("✓ Added {ben_a2_dia_chi}");
}

// Add Ben B xung_ho
xml = xml.replace(
  /Bà\s*:\s*{ben_b_ho_ten}/g,
  "Bà: {ben_b_xung_ho}: {ben_b_ho_ten}"
);

console.log("✓ Added xung_ho fields");

// Write back
zip.files["word/document.xml"].binary = true;
zip.file("word/document.xml", xml, { binary: true });

const newContent = zip.generate({ type: "nodebuffer" });
fs.writeFileSync(templatePath, newContent);

console.log("✅ Template updated with xung_ho and dia_chi fields!");

// Verify
const checkZip = new PizZip(newContent);
const checkXml = checkZip.files["word/document.xml"].asText();
const tags = [...new Set(checkXml.match(/{[\w_]+}/g) || [])];
const required = [
  "{ben_a_xung_ho}", "{ben_a_ho_ten}", "{ben_a_ngay_sinh}", "{ben_a_cccd}", "{ben_a_ngay_cap}", "{ben_a_dia_chi}",
  "{ben_a2_xung_ho}", "{ben_a2_ho_ten}", "{ben_a2_ngay_sinh}", "{ben_a2_cccd}", "{ben_a2_ngay_cap}", "{ben_a2_dia_chi}",
  "{ben_b_xung_ho}", "{ben_b_ho_ten}", "{ben_b_ngay_sinh}", "{ben_b_cccd}", "{ben_b_ngay_cap}", "{ben_b_dia_chi}",
  "{to_ban_do_info}", "{dien_tich_loai_dat}"
];

const missing = required.filter(t => !tags.includes(t));
if (missing.length === 0) {
  console.log("\n✓ All required tags present!");
} else {
  console.log("\n⚠ Missing tags:");
  missing.forEach(t => console.log("  ", t));
}
