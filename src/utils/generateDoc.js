import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";

export async function generateDoc(templatePath, data, filename) {
  const baseUrl = import.meta.env.BASE_URL || "/";
  const normalizedPath = templatePath.startsWith("/")
    ? `${baseUrl.replace(/\/$/, "")}${templatePath}`
    : `${baseUrl}${templatePath}`.replace(/([^:]\/)\/+/g, "$1");
  const separator = templatePath.includes("?") ? "&" : "?";
  const cacheBustedPath = `${normalizedPath}${separator}t=${Date.now()}`;
  const response = await fetch(cacheBustedPath, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Không tìm thấy template: ${normalizedPath}`);
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
