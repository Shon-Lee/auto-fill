import * as XLSX from "xlsx";

function cloneSchema(schema) {
  return structuredClone(schema);
}

export async function importExcelRows(file, schema) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheet = workbook.SheetNames[0];

  if (!firstSheet) {
    throw new Error("File Excel khong co sheet nao");
  }

  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], {
    defval: ""
  });

  const data = cloneSchema(schema);
  if (!rows.length) {
    return data;
  }

  const firstRow = rows[0];
  Object.keys(data).forEach((key) => {
    if (Array.isArray(data[key])) {
      data[key] = rows.map((row) => {
        const sample = data[key][0] || {};
        return Object.keys(sample).reduce((acc, field) => {
          acc[field] = row[field] ?? "";
          return acc;
        }, {});
      });
      return;
    }

    data[key] = firstRow[key] ?? data[key];
  });

  return data;
}