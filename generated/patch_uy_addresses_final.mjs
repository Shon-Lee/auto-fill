import fs from "fs";
import PizZip from "pizzip";

const file = "e:/Tool/public/templates/uy_quyen.docx";
const zip = new PizZip(fs.readFileSync(file));
let xml = zip.file("word/document.xml").asText();

function replaceNthRegex(name, regex, to, nth) {
  let n = 0;
  const before = xml;
  xml = xml.replace(regex, (m) => {
    n += 1;
    if (n === nth) {
      return to;
    }
    return m;
  });
  console.log(`${name}: ${before === xml ? "MISS" : "OK"}`);
}

const addressPattern = /Nơi thường trú: xã <\/w:t><\/w:r><w:r[^>]*>[\s\S]*?<w:t>X<\/w:t><\/w:r><w:r[^>]*>[\s\S]*?<w:t>, tỉnh Ninh Bình\./g;
replaceNthRegex("ben_a_dia_chi_first", addressPattern, "Nơi thường trú: {ben_a_dia_chi}.", 1);
replaceNthRegex("ben_b_dia_chi_last", addressPattern, "Nơi thường trú: {ben_b_dia_chi}.", 2);

zip.file("word/document.xml", xml);
fs.writeFileSync(file, zip.generate({ type: "nodebuffer" }));
console.log("UY_QUYEN_ADDRESS_PATCH_DONE");
