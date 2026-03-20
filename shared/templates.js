export const templateConfigs = {
  vb_mien_giam: {
    id: "vb_mien_giam",
    title: "Van ban mien giam",
    description: "Nhap nhanh cac field do trong template mien giam thue.",
    sourceFileType: "word",
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
    sourceFileType: "word",
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
    sourceFileType: "excel",
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
    sourceFileType: "word",
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
    sourceFileType: "word",
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

export function createEmptyState(config) {
  return {
    simple: Object.fromEntries(config.fields.map((field) => [field.key, ""])),
    repeat: Object.fromEntries(
      config.repeatGroups.map((group) => [
        group.id,
        [Object.fromEntries(group.columns.map((column) => [column.key, ""]))]
      ])
    )
  };
}
