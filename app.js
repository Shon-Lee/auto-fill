const templateConfigs = {
  vb_mien_giam: {
    id: "vb_mien_giam",
    title: "Van ban mien giam",
    description: "Nhap nhanh cac field do trong template mien giam thue.",
    fields: [
      { key: "dia_diem_lap_van_ban", label: "Dia diem lap van ban", group: "Thong tin chung" },
      { key: "ubnd_xa_kinh_gui", label: "UBND xa kinh gui", group: "Thong tin chung" },
      { key: "ten_nguoi_nop_thue", label: "Ten nguoi nop thue", group: "Thong tin nguoi nop thue" },
      { key: "ma_so_thue", label: "Ma so thue", group: "Thong tin nguoi nop thue" },
      { key: "phuong_xa", label: "Phuong xa", group: "Dia chi" },
      { key: "chu_ky_ho_ten", label: "Chu ky ho ten", group: "Ky ten" }
    ],
    repeatGroups: []
  },
  van_ban_thua_ke: {
    id: "van_ban_thua_ke",
    title: "Van ban thua ke",
    description: "Template co nhom danh sach nguoi thua ke de paste nhieu dong.",
    fields: [
      { key: "dia_diem_ubnd_xa", label: "Dia diem UBND xa", group: "Phan dau" },
      { key: "ten_cha_da_mat", label: "Ten cha da mat", group: "Noi dung thua ke" },
      { key: "ten_me_da_mat", label: "Ten me da mat", group: "Noi dung thua ke" },
      { key: "noi_dung_thua_ke", label: "Noi dung thua ke", group: "Noi dung thua ke" },
      { key: "xa_chung_thuc", label: "Xa chung thuc", group: "Chung thuc" },
      { key: "nguoi_thuc_hien_chung_thuc", label: "Nguoi thuc hien chung thuc", group: "Chung thuc" },
      { key: "nguoi_tiep_nhan_ho_so", label: "Nguoi tiep nhan ho so", group: "Chung thuc" },
      { key: "nguoi_duoc_cap_ban", label: "Nguoi duoc cap ban", group: "Chung thuc" },
      { key: "so_quyen_chung_thuc", label: "So quyen chung thuc", group: "Chung thuc" }
    ],
    repeatGroups: [
      {
        id: "ds_nguoi_thua_ke",
        title: "Danh sach nguoi thua ke",
        description: "Paste tu Excel theo hang. Moi cot la mot thuoc tinh.",
        columns: [
          { key: "xung_ho", label: "Xung ho" },
          { key: "ho_ten", label: "Ho ten" },
          { key: "ngay_sinh", label: "Ngay sinh" },
          { key: "so_cccd", label: "So CCCD" },
          { key: "ngay_cap", label: "Ngay cap" },
          { key: "quan_he", label: "Quan he" },
          { key: "dia_chi_thuong_tru", label: "Dia chi thuong tru" }
        ]
      }
    ]
  },
  thue_xlsx: {
    id: "thue_xlsx",
    title: "To khai thue",
    description: "Nhap cac field do cua file Excel thu tu template hien tai.",
    fields: [
      { key: "ky_tinh_thue_nam", label: "Ky tinh thue nam", group: "Thong tin chung" },
      { key: "lan_dau", label: "Lan dau", group: "Thong tin chung" },
      { key: "bo_sung_lan_thu", label: "Bo sung lan thu", group: "Thong tin chung" },
      { key: "ho_va_ten", label: "Ho va ten", group: "Thong tin nguoi nop thue" },
      { key: "ngay_sinh", label: "Ngay sinh", group: "Thong tin nguoi nop thue" },
      { key: "ma_so_thue", label: "Ma so thue", group: "Thong tin nguoi nop thue" },
      { key: "so_cmnd_cccd", label: "So CMND CCCD", group: "Thong tin nguoi nop thue" },
      { key: "ngay_cap", label: "Ngay cap", group: "Thong tin nguoi nop thue" },
      { key: "xa", label: "Xa", group: "Dia chi" },
      { key: "tinh_thanh_pho", label: "Tinh thanh pho", group: "Dia chi" },
      { key: "so_giay_chung_nhan", label: "So giay chung nhan", group: "Thong tin thua dat" },
      { key: "ngay_cap_gcn", label: "Ngay cap GCN", group: "Thong tin thua dat" },
      { key: "thua_dat_so", label: "Thua dat so", group: "Thong tin thua dat" },
      { key: "to_ban_do_so", label: "To ban do so", group: "Thong tin thua dat" },
      { key: "dien_tich", label: "Dien tich", group: "Thong tin thua dat" },
      { key: "loai_dat", label: "Loai dat", group: "Thong tin thua dat" }
    ],
    repeatGroups: []
  },
  hop_dong_uy_quyen: {
    id: "hop_dong_uy_quyen",
    title: "Hop dong uy quyen",
    description: "Mot template duy nhat gom ben A, ben B, tai san va chung thuc.",
    fields: [
      { key: "dia_diem_lap_hop_dong", label: "Dia diem lap hop dong", group: "Phan dau" },
      { key: "ben_a_nguoi_1_ho_ten", label: "Ben A nguoi 1 ho ten", group: "Ben A" },
      { key: "ben_a_nguoi_1_ngay_sinh", label: "Ben A nguoi 1 ngay sinh", group: "Ben A" },
      { key: "ben_a_nguoi_1_so_cccd", label: "Ben A nguoi 1 so CCCD", group: "Ben A" },
      { key: "ben_a_nguoi_1_ngay_cap", label: "Ben A nguoi 1 ngay cap", group: "Ben A" },
      { key: "ben_a_nguoi_1_dia_chi", label: "Ben A nguoi 1 dia chi", group: "Ben A" },
      { key: "ben_a_nguoi_2_ho_ten", label: "Ben A nguoi 2 ho ten", group: "Ben A" },
      { key: "ben_a_nguoi_2_ngay_sinh", label: "Ben A nguoi 2 ngay sinh", group: "Ben A" },
      { key: "ben_a_nguoi_2_so_cccd", label: "Ben A nguoi 2 so CCCD", group: "Ben A" },
      { key: "ben_a_nguoi_2_ngay_cap", label: "Ben A nguoi 2 ngay cap", group: "Ben A" },
      { key: "ben_a_nguoi_2_dia_chi", label: "Ben A nguoi 2 dia chi", group: "Ben A" },
      { key: "ben_b_ho_ten", label: "Ben B ho ten", group: "Ben B" },
      { key: "ben_b_ngay_sinh", label: "Ben B ngay sinh", group: "Ben B" },
      { key: "ben_b_so_cccd", label: "Ben B so CCCD", group: "Ben B" },
      { key: "ben_b_ngay_cap", label: "Ben B ngay cap", group: "Ben B" },
      { key: "ben_b_dia_chi", label: "Ben B dia chi", group: "Ben B" },
      { key: "so_giay_chung_nhan", label: "So giay chung nhan", group: "Tai san" },
      { key: "so_vao_so", label: "So vao so", group: "Tai san" },
      { key: "co_quan_cap_gcn", label: "Co quan cap GCN", group: "Tai san" },
      { key: "ngay_cap_gcn", label: "Ngay cap GCN", group: "Tai san" },
      { key: "thua_dat_so", label: "Thua dat so", group: "Tai san" },
      { key: "to_ban_do_so", label: "To ban do so", group: "Tai san" },
      { key: "xa_dia_chinh_cu", label: "Xa dia chinh cu", group: "Tai san" },
      { key: "dien_tich", label: "Dien tich", group: "Tai san" },
      { key: "loai_dat", label: "Loai dat", group: "Tai san" },
      { key: "ubnd_xa_chung_thuc", label: "UBND xa chung thuc", group: "Chung thuc" },
      { key: "xa_chung_thuc", label: "Xa chung thuc", group: "Chung thuc" },
      { key: "nguoi_tiep_nhan_ho_so", label: "Nguoi tiep nhan ho so", group: "Chung thuc" }
    ],
    repeatGroups: []
  },
  don_dang_ky_bien_dong: {
    id: "don_dang_ky_bien_dong",
    title: "Don dang ky bien dong",
    description: "Nhap cac field do cua don dang ky bien dong.",
    fields: [
      { key: "ho_ten", label: "Ho ten", group: "Nguoi su dung dat" },
      { key: "giay_to_nhan_than", label: "Giay to nhan than", group: "Nguoi su dung dat" },
      { key: "xa_dia_chi", label: "Xa dia chi", group: "Nguoi su dung dat" },
      { key: "noi_dung_bien_dong", label: "Noi dung bien dong", group: "Noi dung bien dong" },
      { key: "thua_dat_so", label: "Thua dat so", group: "Thua dat" },
      { key: "to_ban_do_so", label: "To ban do so", group: "Thua dat" },
      { key: "dien_tich", label: "Dien tich", group: "Thua dat" },
      { key: "loai_dat", label: "Loai dat", group: "Thua dat" },
      { key: "xa_thua_dat", label: "Xa thua dat", group: "Thua dat" },
      { key: "noi_dung_cap_moi_gcn", label: "Noi dung cap moi GCN", group: "Thong tin them" },
      { key: "chu_ky_ho_ten", label: "Chu ky ho ten", group: "Ky ten" }
    ],
    repeatGroups: []
  }
};

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
  exportBtn: document.querySelector("#exportBtn")
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

  elements.exportBtn.addEventListener("click", renderTemplateFile);
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
  const rows = config.fields.map((field) => `
    <tr>
      <td class="sheet-meta">
        <span class="sheet-group">${field.group}</span>
        <span class="sheet-label">${field.label}</span>
      </td>
      <td>
        <div class="sheet-cell" contenteditable="true" spellcheck="false" data-sheet="simple" data-key="${field.key}" data-placeholder="Nhap hoac paste gia tri">${escapeHtml(activeState.simple[field.key] || "")}</div>
      </td>
    </tr>
  `).join("");

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
          <tbody>${rows}</tbody>
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

  elements.repeatSheetMount.innerHTML = config.repeatGroups.map((group) => {
    const header = group.columns.map((column) => `<th>${column.label}</th>`).join("");
    const body = activeState.repeat[group.id].map((row, rowIndex) => `
      <tr>
        ${group.columns.map((column, columnIndex) => `
          <td>
            <div class="sheet-cell" contenteditable="true" spellcheck="false" data-sheet="${group.id}" data-row="${rowIndex}" data-col="${columnIndex}" data-key="${column.key}" data-placeholder="Nhap">${escapeHtml(row[column.key] || "")}</div>
          </td>
        `).join("")}
      </tr>
    `).join("");

    return `
      <section class="sheet-card" data-repeat-group="${group.id}">
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
            <thead><tr>${header}</tr></thead>
            <tbody>${body}</tbody>
          </table>
        </div>
      </section>
    `;
  }).join("");

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
      const groupId = button.dataset.group;
      const group = config.repeatGroups.find((item) => item.id === groupId);
      if (button.dataset.action === "add-row") {
        activeState.repeat[groupId].push(createEmptyRepeatRow(group.columns));
      }
      if (button.dataset.action === "remove-row" && activeState.repeat[groupId].length > 1) {
        activeState.repeat[groupId].pop();
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
  const startRow = Number(row);
  const startCol = Number(col);
  const group = templateConfigs[activeTemplateId].repeatGroups.find((item) => item.id === sheet);
  const rows = activeState.repeat[sheet];

  while (rows.length < startRow + grid.length) {
    rows.push(createEmptyRepeatRow(group.columns));
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
  const renderCard = latestRender ? `
    <section class="preview-card">
      <h3>File da render</h3>
      <div class="preview-item">
        <strong>File goc</strong>
        <div>${escapeHtml(latestRender.outputPath)}</div>
      </div>
      <div class="preview-item">
        <strong>PDF</strong>
        <div>${escapeHtml(latestRender.pdfPath)}</div>
      </div>
      <iframe class="pdf-frame" src="${escapeHtml(latestRender.pdfUrl)}"></iframe>
    </section>
  ` : `
    <section class="preview-card">
      <h3>File da render</h3>
      <p class="muted">Chua co preview file. Bam "Xuat file + PDF" de tao file that.</p>
    </section>
  `;

  const simpleItems = config.fields.map((field) => {
    const value = activeState.simple[field.key]?.trim();
    return value ? `<div class="preview-item"><strong>${field.label}</strong><div>${escapeHtml(value)}</div></div>` : "";
  }).filter(Boolean).join("");

  const repeatCards = config.repeatGroups.map((group) => {
    const rows = activeState.repeat[group.id].filter((row) => Object.values(row).some((value) => String(value || "").trim()));
    if (!rows.length) {
      return "";
    }
    return `
      <section class="preview-card">
        <h3>${group.title}</h3>
        <table class="repeat-preview-table">
          <thead><tr>${group.columns.map((column) => `<th>${column.label}</th>`).join("")}</tr></thead>
          <tbody>
            ${rows.map((row) => `<tr>${group.columns.map((column) => `<td>${escapeHtml(row[column.key] || "")}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      </section>
    `;
  }).join("");

  elements.previewMount.innerHTML = `
    ${renderCard}
    <section class="preview-card">
      <h3>Du lieu nhap</h3>
      <div class="preview-grid">${simpleItems || '<p class="muted">Chua co du lieu.</p>'}</div>
    </section>
    ${repeatCards}
  `;
}

function createEmptyState(config) {
  return {
    simple: Object.fromEntries(config.fields.map((field) => [field.key, ""])),
    repeat: Object.fromEntries(config.repeatGroups.map((group) => [group.id, [createEmptyRepeatRow(group.columns)]]))
  };
}

function createEmptyRepeatRow(columns) {
  return Object.fromEntries(columns.map((column) => [column.key, ""]));
}

function loadTemplateState(templateId) {
  const config = templateConfigs[templateId];
  const raw = window.localStorage.getItem(`${STORAGE_PREFIX}:${templateId}`);
  if (!raw) {
    return createEmptyState(config);
  }
  try {
    return hydrateState(config, JSON.parse(raw));
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
    next.repeat[group.id] = sourceRows.length ? sourceRows.map((row) => {
      const clean = createEmptyRepeatRow(group.columns);
      group.columns.forEach((column) => {
        clean[column.key] = typeof row?.[column.key] === "string" ? row[column.key] : "";
      });
      return clean;
    }) : [createEmptyRepeatRow(group.columns)];
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
