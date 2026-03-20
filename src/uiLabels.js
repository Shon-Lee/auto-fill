export const TEMPLATE_LABELS = {
  mien_giam: "V\u0103n b\u1ea3n mi\u1ec5n gi\u1ea3m thu\u1ebf TNCN",
  thua_ke: "V\u0103n b\u1ea3n th\u1ecfa thu\u1eadn ph\u00e2n chia di s\u1ea3n th\u1eeba k\u1ebf",
  uy_quyen: "H\u1ee3p \u0111\u1ed3ng \u1ee7y quy\u1ec1n",
  bien_dong: "\u0110\u01a1n \u0111\u0103ng k\u00fd bi\u1ebfn \u0111\u1ed9ng \u0111\u1ea5t \u0111ai"
};

export const FIELD_LABELS = {
  ten_nguoi_nop_thue: "T\u00ean ng\u01b0\u1eddi n\u1ed9p thu\u1ebf",
  ma_so_thue: "M\u00e3 s\u1ed1 thu\u1ebf",
  phuong_xa: "Ph\u01b0\u1eddng/x\u00e3",
  quan_huyen: "Qu\u1eadn/huy\u1ec7n",
  tinh_thanh: "T\u1ec9nh/th\u00e0nh ph\u1ed1",
  dien_thoai: "\u0110i\u1ec7n tho\u1ea1i",

  dia_diem_ubnd_xa: "\u0110\u1ecba \u0111i\u1ec3m UBND x\u00e3",
  ten_cha_da_mat: "T\u00ean cha \u0111\u00e3 m\u1ea5t",
  ten_me_da_mat: "T\u00ean m\u1eb9 \u0111\u00e3 m\u1ea5t",
  noi_dung_thua_ke: "N\u1ed9i dung th\u1eeba k\u1ebf",
  xa_chung_thuc: "X\u00e3 ch\u1ee9ng th\u1ef1c",
  nguoi_thuc_hien_chung_thuc: "Ng\u01b0\u1eddi th\u1ef1c hi\u1ec7n ch\u1ee9ng th\u1ef1c",
  nguoi_tiep_nhan_ho_so: "Ng\u01b0\u1eddi ti\u1ebfp nh\u1eadn h\u1ed3 s\u01a1",
  nguoi_duoc_cap_ban: "Ng\u01b0\u1eddi \u0111\u01b0\u1ee3c c\u1ea5p b\u1ea3n",
  so_quyen_chung_thuc: "S\u1ed1 quy\u1ec3n ch\u1ee9ng th\u1ef1c",

  xung_ho: "X\u01b0ng h\u00f4",
  ho_ten: "H\u1ecd t\u00ean",
  ngay_sinh: "Ng\u00e0y sinh",
  so_cccd: "S\u1ed1 CCCD",
  ngay_cap: "Ng\u00e0y c\u1ea5p",
  quan_he: "Quan h\u1ec7",
  dia_chi_thuong_tru: "\u0110\u1ecba ch\u1ec9 th\u01b0\u1eddng tr\u00fa",

  dia_diem_lap_hop_dong: "\u0110\u1ecba \u0111i\u1ec3m l\u1eadp h\u1ee3p \u0111\u1ed3ng",
  cccd: "S\u1ed1 CCCD",
  dia_chi: "\u0110\u1ecba ch\u1ec9",
  so_giay_chung_nhan: "S\u1ed1 gi\u1ea5y ch\u1ee9ng nh\u1eadn",
  so_vao_so: "S\u1ed1 v\u00e0o s\u1ed5",
  co_quan_cap_gcn: "C\u01a1 quan c\u1ea5p GCN",
  ngay_cap_gcn: "Ng\u00e0y c\u1ea5p GCN",
  thua_dat_so: "Th\u1eeda \u0111\u1ea5t s\u1ed1",
  to_ban_do_info: "T\u1edd b\u1ea3n \u0111\u1ed3",
  dien_tich_loai_dat: "Di\u1ec7n t\u00edch v\u00e0 lo\u1ea1i \u0111\u1ea5t",
  noi_dung_uy_quyen: "N\u1ed9i dung \u1ee7y quy\u1ec1n",
  ubnd_xa_chung_thuc: "UBND x\u00e3 ch\u1ee9ng th\u1ef1c",

  giay_to_nhan_than: "Gi\u1ea5y t\u1edd nh\u00e2n th\u00e2n",
  to_ban_do_so: "T\u1edd b\u1ea3n \u0111\u1ed3 s\u1ed1",
  dien_tich: "Di\u1ec7n t\u00edch"
};

export const ARRAY_LABELS = {
  ds_nguoi_thua_ke: "Danh s\u00e1ch ng\u01b0\u1eddi th\u1eeba k\u1ebf",
  ds_ben_a: "Danh s\u00e1ch b\u00ean \u1ee7y quy\u1ec1n",
  ds_ben_b: "Danh s\u00e1ch b\u00ean \u0111\u01b0\u1ee3c \u1ee7y quy\u1ec1n"
};

export const ARRAY_ACTION_LABELS = {
  ds_nguoi_thua_ke: "Th\u00eam ng\u01b0\u1eddi",
  ds_ben_a: "Th\u00eam ng\u01b0\u1eddi",
  ds_ben_b: "Th\u00eam ng\u01b0\u1eddi"
};

function prettifyKey(key) {
  return String(key)
    .split("_")
    .filter(Boolean)
    .join(" ");
}

export function getTemplateLabel(key) {
  return TEMPLATE_LABELS[key] || prettifyKey(key);
}

export function getFieldLabel(key) {
  return FIELD_LABELS[key] || prettifyKey(key);
}

export function getArrayLabel(key) {
  return ARRAY_LABELS[key] || getFieldLabel(key);
}

export function getAddRowLabel(key) {
  return ARRAY_ACTION_LABELS[key] || "Th\u00eam d\u00f2ng";
}
