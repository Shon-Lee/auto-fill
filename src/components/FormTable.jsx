import { getAddRowLabel, getArrayLabel, getFieldLabel } from "../uiLabels";

const XUNG_HO_OPTIONS = ["\u00d4ng", "B\u00e0"];

function isPrimitiveField(value) {
  return ["string", "number", "boolean"].includes(typeof value) || value == null;
}

function isMultilineField(key) {
  return key.startsWith("noi_dung_");
}

export default function FormTable({ data, setData }) {
  const keys = Object.keys(data || {});

  const updateFlatField = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const updateArrayCell = (arrayKey, rowIndex, colKey, value) => {
    setData((prev) => {
      const rows = prev[arrayKey].map((row, index) => {
        if (index !== rowIndex) {
          return row;
        }

        return {
          ...row,
          [colKey]: value
        };
      });

      return {
        ...prev,
        [arrayKey]: rows
      };
    });
  };

  const addArrayRow = (arrayKey) => {
    setData((prev) => {
      const templateRow = prev[arrayKey][0] || {};
      const emptyRow = Object.keys(templateRow).reduce((acc, key) => {
        acc[key] = "";
        return acc;
      }, {});

      return {
        ...prev,
        [arrayKey]: [...prev[arrayKey], emptyRow]
      };
    });
  };

  const deleteArrayRow = (arrayKey, rowIndex) => {
    setData((prev) => {
      const rows = prev[arrayKey] || [];
      if (rows.length <= 1) {
        return prev;
      }

      return {
        ...prev,
        [arrayKey]: rows.filter((_, index) => index !== rowIndex)
      };
    });
  };

  return (
    <div className="form-layout">
      {keys
        .filter((key) => isPrimitiveField(data[key]))
        .map((key) => (
          <label key={key} className="field-row">
            <span>{getFieldLabel(key)}</span>
            {isMultilineField(key) ? (
              <textarea
                rows={6}
                value={data[key] ?? ""}
                onChange={(event) => updateFlatField(key, event.target.value)}
              />
            ) : (
              <input
                value={data[key] ?? ""}
                onChange={(event) => updateFlatField(key, event.target.value)}
              />
            )}
          </label>
        ))}

      {keys
        .filter((key) => Array.isArray(data[key]))
        .map((arrayKey) => {
          const rows = data[arrayKey];
          const columns = rows[0] ? Object.keys(rows[0]) : [];

          return (
            <div key={arrayKey} className="array-card">
              <div className="array-header">
                <h3>{getArrayLabel(arrayKey)}</h3>
                <button type="button" onClick={() => addArrayRow(arrayKey)}>
                  {getAddRowLabel(arrayKey)}
                </button>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      {columns.map((column) => (
                        <th key={column}>{getFieldLabel(column)}</th>
                      ))}
                      <th>{"H\u00e0nh \u0111\u1ed9ng"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, rowIndex) => (
                      <tr key={`${arrayKey}-${rowIndex}`}>
                        {columns.map((column) => (
                          <td key={`${arrayKey}-${rowIndex}-${column}`}>
                            {column === "xung_ho" ? (
                              <select
                                value={row[column] ?? ""}
                                onChange={(event) =>
                                  updateArrayCell(arrayKey, rowIndex, column, event.target.value)
                                }
                              >
                                <option value="">{"Ch\u1ecdn"}</option>
                                {XUNG_HO_OPTIONS.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                value={row[column] ?? ""}
                                onChange={(event) =>
                                  updateArrayCell(arrayKey, rowIndex, column, event.target.value)
                                }
                              />
                            )}
                          </td>
                        ))}
                        <td>
                          <button
                            type="button"
                            onClick={() => deleteArrayRow(arrayKey, rowIndex)}
                            disabled={rows.length <= 1}
                          >
                            {"X\u00f3a d\u00f2ng"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
    </div>
  );
}
