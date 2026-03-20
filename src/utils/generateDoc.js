import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";

export async function generateDoc(templatePath, data, filename) {
  const separator = templatePath.includes("?") ? "&" : "?";
  const cacheBustedPath = `${templatePath}${separator}t=${Date.now()}`;
  const response = await fetch(cacheBustedPath, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Khong tim thay template: ${templatePath}`);
  }

  const content = await response.arrayBuffer();
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    // Return empty text for missing tags instead of throwing/printing undefined.
    nullGetter() {
      return "";
    }
  });

  try {
    doc.render(data);
  } catch (error) {
    const explain =
      error?.properties?.errors?.map((e) => e?.properties?.explanation).filter(Boolean).join(" | ") ||
      error?.message ||
      "Loi render template";
    throw new Error(explain);
  }

  const output = doc.getZip().generate({
    type: "blob",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  });

  saveAs(output, filename);
}