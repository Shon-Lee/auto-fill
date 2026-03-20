import fs from "fs";
import PizZip from "pizzip";

const xml = new PizZip(fs.readFileSync("public/templates/uy_quyen.docx", "binary")).files["word/document.xml"].asText();
const texts = (xml.match(/<w:t[^>]*>[^<]*<\/w:t>/g) || []).map((t) => t.replace(/<[^>]+>/g, ""));
const idx = texts.findIndex((t) => t.includes("{to_ban_do_info}"));
console.log("idx", idx);
console.log(texts.slice(Math.max(0, idx - 8), idx + 16).map((t, i) => `${Math.max(0, idx - 8) + i}: ${t}`).join("\n"));

const idxAddr = texts.findIndex((t) => t === "Nơi thường trú: ");
console.log("\naddr idx", idxAddr);
console.log(texts.slice(Math.max(0, idxAddr - 3), idxAddr + 10).map((t, i) => `${Math.max(0, idxAddr - 3) + i}: ${t}`).join("\n"));
