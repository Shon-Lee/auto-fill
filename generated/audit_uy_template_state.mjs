import fs from "fs";
import PizZip from "pizzip";

function extractText(docxPath) {
  const zip = new PizZip(fs.readFileSync(docxPath, "binary"));
  const xml = zip.files["word/document.xml"].asText();
  const texts = (xml.match(/<w:t[^>]*>[^<]*<\/w:t>/g) || [])
    .map((t) => t.replace(/<[^>]+>/g, ""))
    .filter((t) => t.trim().length > 0);
  const tags = [...new Set(xml.match(/{[\w_#/]+}/g) || [])].sort();
  return { xml, texts, tags };
}

const tpl = extractText("public/templates/uy_quyen.docx");
console.log("TEMPLATE TAG COUNT:", tpl.tags.length);
console.log("TEMPLATE TAGS:", tpl.tags.join(", "));
console.log("\nTEMPLATE SAMPLE TEXT:");
console.log(tpl.texts.slice(0, 45).join("\n"));

const outPath = "generated/uy_quyen_final_test.docx";
if (fs.existsSync(outPath)) {
  const out = extractText(outPath);
  const whole = out.texts.join(" ");
  console.log("\nRENDERED CHECK:");
  console.log("Contains 'Nguyen Van A':", whole.includes("Nguyen Van A"));
  console.log("Contains 'Le Van C':", whole.includes("Le Van C"));
  console.log("Contains '{':", whole.includes("{"));
  console.log("Contains 'aaaa':", /aaaa/i.test(whole));
}
