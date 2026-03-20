const DEFAULT_XUNG_HO = "\u00d4ng/B\u00e0";
const CAN_CUOC_LABEL = "C\u0103n c\u01b0\u1edbc s\u1ed1";
const NGAY_SINH_LABEL = "Ng\u00e0y sinh";
const NOI_THUONG_TRU_LABEL = "N\u01a1i th\u01b0\u1eddng tr\u00fa";
const CO_QUAN_CAP_CCCD = "C\u1ee5c c\u1ea3nh s\u00e1t QLHC v\u1ec1 TTXH";
const BAN_GOC_LABEL = "01(m\u1ed9t) b\u1ea3n g\u1ed1c;";
const BEN_A_LABEL = "B\u00ean A:";
const BEN_B_LABEL = "B\u00ean B:";

function withIndex(rows) {
  return rows.map((row, index) => ({
    ...row,
    stt: index + 1
  }));
}

function normalizePeople(rows) {
  return Array.isArray(rows) ? rows.filter(Boolean) : [];
}

function formatUyQuyenParty(person) {
  const xungHo = person.xung_ho || DEFAULT_XUNG_HO;
  const hoTen = person.ho_ten || "";
  const ngaySinh = person.ngay_sinh || "";
  const cccd = person.cccd || "";
  const ngayCap = person.ngay_cap || "";
  const diaChi = person.dia_chi || "";

  return [
    `${xungHo}: ${hoTen}`,
    `${NGAY_SINH_LABEL}: ${ngaySinh}`,
    `${CAN_CUOC_LABEL}: ${cccd}, do ${CO_QUAN_CAP_CCCD}, c\u1ea5p ng\u00e0y: ${ngayCap}.`,
    `${NOI_THUONG_TRU_LABEL}: ${diaChi}.`
  ].join("\n");
}

function formatChungThucEntry(label, person) {
  const prefix = label ? `${label} ` : "";
  const xungHo = person.xung_ho || DEFAULT_XUNG_HO;
  const hoTen = person.ho_ten || "";
  const cccd = person.cccd || "";

  return `${prefix}${xungHo}: ${hoTen}, ${CAN_CUOC_LABEL}: ${cccd}`;
}

function formatCapBanEntry(person) {
  const xungHo = person.xung_ho || DEFAULT_XUNG_HO;
  const hoTen = person.ho_ten || "";

  return `+ ${xungHo} ${hoTen} ${BAN_GOC_LABEL}`;
}

export function buildUyQuyenPayload(data) {
  const benA = normalizePeople(data.ds_ben_a);
  const benB = normalizePeople(data.ds_ben_b);

  const benABlock = benA.length ? benA.map(formatUyQuyenParty).join("\n\n") : formatUyQuyenParty({});
  const benBBlock = benB.length ? benB.map(formatUyQuyenParty).join("\n\n") : formatUyQuyenParty({});

  const chungThucGiaoKetLines = [
    ...benA.map((person, index) => formatChungThucEntry(index === 0 ? BEN_A_LABEL : "", person)),
    ...benB.map((person, index) => formatChungThucEntry(index === 0 ? BEN_B_LABEL : "", person))
  ];

  const chungThucCapBanLines = [...benA, ...benB].map(formatCapBanEntry);

  return {
    ...data,
    ben_a_block: benABlock,
    ben_b_block: benBBlock,
    chung_thuc_giao_ket_block: chungThucGiaoKetLines.join("\n"),
    chung_thuc_cap_ban_block: chungThucCapBanLines.join("\n")
  };
}

export function buildTemplatePayload(type, data) {
  if (type === "thua_ke") {
    const rows = Array.isArray(data.ds_nguoi_thua_ke) ? data.ds_nguoi_thua_ke : [];
    return {
      ...data,
      ds_nguoi_thua_ke: withIndex(rows)
    };
  }

  if (type === "uy_quyen") {
    return buildUyQuyenPayload(data);
  }

  return data;
}
