import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

const root = "e:/Tool/thừa kế";
const files = fs.readdirSync(root).filter((f) => f.toLowerCase().endsWith('.docx') && !f.startsWith('~$'));
for (const file of files) {
  const p = path.join(root, file);
  const content = fs.readFileSync(p);
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
  const text = doc.getFullText() || "";
  const braceChunks = (text.match(/\{[^\}]*\}/g) || []).slice(0, 15);
  console.log(`FILE: ${file}`);
  console.log(`TEXT_LEN: ${text.length}`);
  console.log(`BRACE_MATCHES: ${braceChunks.length}`);
  if (braceChunks.length) {
    console.log(`SAMPLE: ${braceChunks.join(' | ')}`);
  }
  console.log('---');
}
