import { templateConfigs, createEmptyState } from "../shared/templates.js";

const STORAGE_PREFIX = "land-doc-tool";
const elements = {
  templateSelect: document.querySelector("#templateSelect"),
  templateTitle: document.querySelector("#templateTitle"),
  templateDescription: document.querySelector("#templateDescription"),
  simpleSheetMount: document.querySelector("#simpleSheetMount"),
  repeatSheetMount: document.querySelector("#repeatSheetMount"),
  previewMount: document.querySelector("#previewMount"),
  saveStatus: document.querySelector("#saveStatus"),
  newDraftBtn: document.querySelector("#newDraftBtn"),
  renderBtn: document.querySelector("#renderBtn")
};

let activeTemplateId = Object.keys(templateConfigs)[0];
let activeState = loadTemplateState(activeTemplateId);
let latestRender = null;

bootstrap();

function bootstrap() {
  renderTemplateOptions();
  bindEvents();
  renderActiveTemplate();
}

function bindEvents() {
  elements.templateSelect.addEventListener("change", (event) => {
    activeTemplateId = event.target.value;
    activeState = loadTemplateState(activeTemplateId);
    latestRender = null;
    renderActiveTemplate();
  });

  elements.newDraftBtn.addEventListener("click", () => {
    activeState = createEmptyState(templateConfigs[activeTemplateId]);
    saveState(activeTemplateId, activeState);
    latestRender = null;
    setStatus("Da tao ho so moi.");
    renderActiveTemplate();
  });

  elements.renderBtn.addEventListener("click", renderTemplateFile);
}

function renderTemplateOptions() {
  elements.templateSelect.innerHTML = Object.values(templateConfigs)
    .map((config) => `<option value="${config.id}">${config.title}</option>`)
    .join("");
  elements.templateSelect.value = activeTemplateId;
}

function renderActiveTemplate() {
  const config = templateConfigs[activeTemplateId];
  elements.templateTitle.textContent = config.title;
  elements.templateDescription.textContent = config.description;
  renderSimpleSheet(config);
  renderRepeatSheets(config);
  renderPreview(config);
}

function renderSimpleSheet(config) {
  elements.simpleSheetMount.innerHTML = `
    <section class="sheet-card">
      <div class="sheet-card-header">
        <div>
          <h3>Bang field don</h3>
          <p>Paste truc tiep vao cot gia tri. Neu copy 1 cot tu Excel, paste tu o dang focus.</p>
        </div>
      </div>
      <div class="sheet-table-wrap">
        <table class="sheet-table">
          <thead>
            <tr>
              <th style="width: 260px">Truong</th>
              <th>Gia tri</th>
            </tr>
          </thead>
          <tbody>
            ${config.fields.map((field) => `
              <tr>
                <td class="sheet-meta">
                  <span class="sheet-group">${field.group}</span>
                  <span class="sheet-label">${field.label}</span>
                </td>
                <td>
                  <div class="sheet-cell" contenteditable="true" spellcheck="false" data-sheet="simple" data-key="${field.key}" data-placeholder="Nhap hoac paste gia tri">${escapeHtml(activeState.simple[field.key] || "")}</div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;

  elements.simpleSheetMount.querySelectorAll(".sheet-cell").forEach((cell) => {
    cell.addEventListener("input", () => {
      activeState.simple[cell.dataset.key] = cell.textContent.trim();
      persist();
    });
    cell.addEventListener("paste", handleSimplePaste);
  });
}

function renderRepeatSheets(config) {
  if (!config.repeatGroups.length) {
    elements.repeatSheetMount.innerHTML = "";
    return;
  }

  elements.repeatSheetMount.innerHTML = config.repeatGroups.map((group) => `
    <section class="sheet-card">
      <div class="sheet-card-header">
        <div>
          <h3>${group.title}</h3>
          <p>${group.description}</p>
        </div>
        <div class="repeat-actions">
          <button class="button button-secondary" data-action="add-row" data-group="${group.id}">Them dong</button>
          <button class="button button-secondary" data-action="remove-row" data-group="${group.id}">Xoa dong cuoi</button>
        </div>
      </div>
      <div class="sheet-table-wrap">
        <table class="sheet-table">
          <thead>
            <tr>${group.columns.map((column) => `<th>${column.label}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${activeState.repeat[group.id].map((row, rowIndex) => `
              <tr>
                ${group.columns.map((column, columnIndex) => `
                  <td>
                    <div class="sheet-cell" contenteditable="true" spellcheck="false" data-sheet="${group.id}" data-row="${rowIndex}" data-col="${columnIndex}" data-key="${column.key}" data-placeholder="Nhap">${escapeHtml(row[column.key] || "")}</div>
                  </td>
                `).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `).join("");

  elements.repeatSheetMount.querySelectorAll(".sheet-cell").forEach((cell) => {
    cell.addEventListener("input", () => {
      const { sheet, row, key } = cell.dataset;
      activeState.repeat[sheet][Number(row)][key] = cell.textContent.trim();
      persist();
    });
    cell.addEventListener("paste", handleRepeatPaste);
  });

  elements.repeatSheetMount.querySelectorAll("button[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const group = config.repeatGroups.find((item) => item.id === button.dataset.group);
      if (button.dataset.action === "add-row") {
        activeState.repeat[group.id].push(Object.fromEntries(group.columns.map((column) => [column.key, ""])));
      }
      if (button.dataset.action === "remove-row" && activeState.repeat[group.id].length > 1) {
        activeState.repeat[group.id].pop();
      }
      persist();
      renderActiveTemplate();
    });
  });
}

function handleSimplePaste(event) {
  const text = event.clipboardData.getData("text/plain");
  if (!text.includes("\n")) {
    return;
  }

  event.preventDefault();
  const values = parseClipboardGrid(text).flat();
  const cells = Array.from(elements.simpleSheetMount.querySelectorAll(".sheet-cell"));
  const startIndex = cells.indexOf(event.currentTarget);
  values.forEach((value, offset) => {
    const target = cells[startIndex + offset];
    if (!target) {
      return;
    }
    target.textContent = value;
    activeState.simple[target.dataset.key] = value;
  });
  persist();
}

function handleRepeatPaste(event) {
  const grid = parseClipboardGrid(event.clipboardData.getData("text/plain"));
  if (!grid.length) {
    return;
  }

  event.preventDefault();
  const { sheet, row, col } = event.currentTarget.dataset;
  const group = templateConfigs[activeTemplateId].repeatGroups.find((item) => item.id === sheet);
  const rows = activeState.repeat[sheet];
  const startRow = Number(row);
  const startCol = Number(col);

  while (rows.length < startRow + grid.length) {
    rows.push(Object.fromEntries(group.columns.map((column) => [column.key, ""])));
  }

  grid.forEach((gridRow, rowOffset) => {
    gridRow.forEach((value, colOffset) => {
      const column = group.columns[startCol + colOffset];
      if (column) {
        rows[startRow + rowOffset][column.key] = value;
      }
    });
  });

  persist();
  renderActiveTemplate();
}

function renderPreview(config) {
  const renderCard = latestRender
    ? `
      <section class="preview-card">
        <h3>File da render</h3>
        <div class="preview-item">
          <strong>File goc</strong>
          <div><a href="${escapeHtml(latestRender.outputUrl)}" target="_blank" rel="noreferrer">${escapeHtml(latestRender.outputPath)}</a></div>
        </div>
        <div class="preview-item">
          <strong>PDF</strong>
          <div><a href="${escapeHtml(latestRender.pdfUrl)}" target="_blank" rel="noreferrer">${escapeHtml(latestRender.pdfPath)}</a></div>
        </div>
        <iframe class="pdf-frame" src="${escapeHtml(latestRender.pdfUrl)}"></iframe>
      </section>
    `
    : `
      <section class="preview-card">
        <h3>File da render</h3>
        <p class="muted">Chua co preview file. Bam "Xuat file + PDF" de tao file that.</p>
      </section>
    `;

  const simpleCard = `
    <section class="preview-card">
      <h3>Du lieu nhap</h3>
      <div class="preview-grid">
        ${config.fields.map((field) => {
          const value = activeState.simple[field.key]?.trim();
          if (!value) {
            return "";
          }
          return `<div class="preview-item"><strong>${field.label}</strong><div>${escapeHtml(value)}</div></div>`;
        }).filter(Boolean).join("") || '<p class="muted">Chua co du lieu.</p>'}
      </div>
    </section>
  `;

  const repeatCards = config.repeatGroups.map((group) => {
    const rows = activeState.repeat[group.id].filter((row) => Object.values(row).some((value) => String(value || "").trim()));
    if (!rows.length) {
      return "";
    }
    return `
      <section class="preview-card">
        <h3>${group.title}</h3>
        <table class="repeat-preview-table">
          <thead>
            <tr>${group.columns.map((column) => `<th>${column.label}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${rows.map((row) => `
              <tr>${group.columns.map((column) => `<td>${escapeHtml(row[column.key] || "")}</td>`).join("")}</tr>
            `).join("")}
          </tbody>
        </table>
      </section>
    `;
  }).join("");

  elements.previewMount.innerHTML = `${renderCard}${simpleCard}${repeatCards}`;
}

function loadTemplateState(templateId) {
  const config = templateConfigs[templateId];
  const raw = window.localStorage.getItem(`${STORAGE_PREFIX}:${templateId}`);
  if (!raw) {
    return createEmptyState(config);
  }
  try {
    const parsed = JSON.parse(raw);
    return hydrateState(config, parsed);
  } catch {
    return createEmptyState(config);
  }
}

function hydrateState(config, state) {
  const next = createEmptyState(config);
  config.fields.forEach((field) => {
    if (typeof state?.simple?.[field.key] === "string") {
      next.simple[field.key] = state.simple[field.key];
    }
  });
  config.repeatGroups.forEach((group) => {
    const sourceRows = Array.isArray(state?.repeat?.[group.id]) ? state.repeat[group.id] : [];
    next.repeat[group.id] = sourceRows.length
      ? sourceRows.map((row) => Object.fromEntries(group.columns.map((column) => [column.key, typeof row?.[column.key] === "string" ? row[column.key] : ""])))
      : next.repeat[group.id];
  });
  return next;
}

function saveState(templateId, state) {
  window.localStorage.setItem(`${STORAGE_PREFIX}:${templateId}`, JSON.stringify(state));
}

function persist() {
  saveState(activeTemplateId, activeState);
  setStatus(`Da luu luc ${new Date().toLocaleTimeString("vi-VN")}.`);
  renderPreview(templateConfigs[activeTemplateId]);
}

async function renderTemplateFile() {
  setStatus("Dang tao file va PDF...");
  try {
    const response = await fetch("/api/render", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        templateId: activeTemplateId,
        data: activeState
      })
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || "Khong tao duoc file.");
    }
    latestRender = payload;
    setStatus("Da tao file va PDF.");
    renderPreview(templateConfigs[activeTemplateId]);
  } catch (error) {
    setStatus(error.message || "Co loi khi tao file.");
  }
}

function setStatus(message) {
  elements.saveStatus.textContent = message;
}

function parseClipboardGrid(text) {
  return text.replace(/\r/g, "").split("\n").filter(Boolean).map((row) => row.split("\t").map((cell) => cell.trim()));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
