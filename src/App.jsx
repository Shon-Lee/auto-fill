import { useEffect, useState } from "react";
import TemplateSelector from "./components/TemplateSelector";
import FormTable from "./components/FormTable";
import DocumentPreview from "./components/DocumentPreview";
import { generateDoc } from "./utils/generateDoc";
import { loadDraft, saveDraft } from "./utils/storage";
import { buildTemplatePayload } from "./utils/buildTemplatePayload";
import { getTemplateLabel } from "./uiLabels";
import mienGiam from "./schemas/mien_giam";
import thuaKe from "./schemas/thua_ke";
import uyQuyen from "./schemas/uy_quyen";
import bienDong from "./schemas/bien_dong";

const UI_TEXT = {
  initialStatus: "Ch\u01b0a ch\u1ecdn h\u1ed3 s\u01a1.",
  loadedDraft: "\u0110\u00e3 t\u1ea3i d\u1eef li\u1ec7u t\u1ef1 \u0111\u1ed9ng.",
  newDraft: "Kh\u1edfi t\u1ea1o d\u1eef li\u1ec7u m\u1edbi.",
  exportSuccess: "Xu\u1ea5t Word th\u00e0nh c\u00f4ng.",
  resetSuccess: "\u0110\u00e3 \u0111\u1eb7t l\u1ea1i v\u1ec1 d\u1eef li\u1ec7u m\u1eb7c \u0111\u1ecbnh.",
  heroKicker: "H\u1ed3 s\u01a1 \u0111\u1ea5t \u0111ai",
  heroTitle: "Nh\u1eadp th\u00f4ng tin v\u00e0 xu\u1ea5t file Word theo m\u1eabu c\u00f3 s\u1eb5n",
  heroBody:
    "Ch\u1ecdn lo\u1ea1i h\u1ed3 s\u01a1, nh\u1eadp th\u00f4ng tin, xem tr\u01b0\u1edbc v\u0103n b\u1ea3n v\u00e0 xu\u1ea5t file Word theo m\u1eabu.",
  resetButton: "T\u1ea1o trang m\u1edbi",
  exportButton: "Xu\u1ea5t Word",
  chooseType: "H\u00e3y ch\u1ecdn lo\u1ea1i h\u1ed3 s\u01a1 \u0111\u1ec3 b\u1eaft \u0111\u1ea7u.",
  currentTemplate: "M\u1eabu \u0111ang s\u1eed d\u1ee5ng",
  statusLabel: "Tr\u1ea1ng th\u00e1i"
};

const schemas = {
  mien_giam: mienGiam,
  thua_ke: thuaKe,
  uy_quyen: uyQuyen,
  bien_dong: bienDong
};

function mergeWithSchemaDefaults(schema, saved) {
  if (saved == null) {
    return structuredClone(schema);
  }

  if (Array.isArray(schema)) {
    if (!Array.isArray(saved)) {
      return structuredClone(schema);
    }

    if (!schema.length) {
      return structuredClone(saved);
    }

    return saved.map((item) => mergeWithSchemaDefaults(schema[0], item));
  }

  if (typeof schema === "object" && schema !== null) {
    const merged = {};
    const safeSaved = typeof saved === "object" && saved !== null ? saved : {};

    Object.keys(schema).forEach((key) => {
      merged[key] = mergeWithSchemaDefaults(schema[key], safeSaved[key]);
    });

    return merged;
  }

  return saved ?? schema;
}

export default function App() {
  const [type, setType] = useState("");
  const [data, setData] = useState({});
  const [status, setStatus] = useState(UI_TEXT.initialStatus);

  useEffect(() => {
    if (!type) {
      setData({});
      return;
    }

    const saved = loadDraft(type);
    setData(mergeWithSchemaDefaults(schemas[type], saved));
    setStatus(saved ? UI_TEXT.loadedDraft : UI_TEXT.newDraft);
  }, [type]);

  useEffect(() => {
    if (!type) {
      return;
    }

    saveDraft(type, data);
  }, [type, data]);

  const handleGenerate = async () => {
    if (!type) {
      return;
    }

    try {
      const payload = buildTemplatePayload(type, data);
      await generateDoc(`/templates/${type}.docx`, payload, `${type}.docx`);
      setStatus(UI_TEXT.exportSuccess);
    } catch (error) {
      setStatus(`Xu\u1ea5t Word th\u1ea5t b\u1ea1i: ${error.message}`);
    }
  };

  const handleReset = () => {
    if (!type) {
      return;
    }

    setData(structuredClone(schemas[type]));
    setStatus(UI_TEXT.resetSuccess);
  };

  return (
    <div className="page">
      <header className="hero">
        <p className="kicker">{UI_TEXT.heroKicker}</p>
        <h1>{UI_TEXT.heroTitle}</h1>
        <p>{UI_TEXT.heroBody}</p>
      </header>

      <section className="panel">
        <div className="toolbar">
          <TemplateSelector value={type} onChange={setType} />
          <button type="button" onClick={handleReset} disabled={!type}>
            {UI_TEXT.resetButton}
          </button>
          <button type="button" className="primary" onClick={handleGenerate} disabled={!type}>
            {UI_TEXT.exportButton}
          </button>
        </div>

        {!type && <p className="placeholder">{UI_TEXT.chooseType}</p>}

        {type && (
          <div className="workspace">
            <div className="editor-panel">
              <div className="tips">
                <h2>{UI_TEXT.currentTemplate}</h2>
                <p>{getTemplateLabel(type)}</p>
              </div>
              <FormTable data={data} setData={setData} />
            </div>
            <DocumentPreview type={type} data={data} />
          </div>
        )}

        <p className="status">
          {UI_TEXT.statusLabel}: {status}
        </p>
      </section>
    </div>
  );
}
