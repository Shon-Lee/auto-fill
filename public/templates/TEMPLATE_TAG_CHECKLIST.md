# TEMPLATE TAG CHECKLIST

Lam theo checklist nay de file docx dat chuan voi app.

## 1) Dat ten file dung chuan trong folder public/templates

- mien_giam.docx
- thua_ke.docx
- uy_quyen.docx
- bien_dong.docx
- thue.xlsx (neu dung)

## 2) Placeholder cho tung file

### mien_giam.docx

Dat cac tag sau o vi tri can hien thi:

- {ten_nguoi_nop_thue}
- {ma_so_thue}
- {phuong_xa} (dung chung cho vi tri X o dau van ban, dong Kinh gui va [03a])
- {quan_huyen}
- {tinh_thanh}
- {dien_thoai}

### thua_ke.docx

Template nay gom field don + block lap ds_nguoi_thua_ke.

Field don:

- {dia_diem_ubnd_xa}
- {ten_cha_da_mat}
- {ten_me_da_mat}
- {noi_dung_thua_ke}
- {xa_chung_thuc}
- {nguoi_thuc_hien_chung_thuc}
- {nguoi_tiep_nhan_ho_so}
- {nguoi_duoc_cap_ban}
- {so_quyen_chung_thuc}

Block lap:

- Mo loop: {#ds_nguoi_thua_ke}
- Dong loop: {/ds_nguoi_thua_ke}

Trong khoi loop dat cac cot:

- {xung_ho}
- {ho_ten}
- {ngay_sinh}
- {so_cccd}
- {ngay_cap}
- {quan_he}
- {dia_chi_thuong_tru}

Ghi chu: stt la so thu tu tang tu dong tu phan mem, khong can tao field rieng.

Vi du:

{#ds_nguoi_thua_ke}
{xung_ho}: {ho_ten}, ngay sinh {ngay_sinh}, CCCD so {so_cccd}, cap ngay {ngay_cap}, la {quan_he}.

- Thuong tru tai: {dia_chi_thuong_tru}.
  {/ds_nguoi_thua_ke}

### uy_quyen.docx

Dat cac tag sau:

Khoi render dong:

- {ben_a_block}
- {ben_b_block}
- {chung_thuc_giao_ket_block}
- {chung_thuc_cap_ban_block}

Noi dung cua 2 khoi ben A/ben B duoc render dong tu form `ds_ben_a`, `ds_ben_b`.
Khong dung lai cac tag cu kieu:

- {ben_a_ho_ten}
- {ben_a_cccd}
- {ben_a2_ho_ten}
- {ben_a2_cccd}
- {ben_b_ho_ten}
- {ben_b_cccd}
- {ben_chung_thuc_bo_sung}

Thong tin san pham:

- {dia_diem_lap_hop_dong}
- {so_giay_chung_nhan}
- {so_vao_so}
- {co_quan_cap_gcn}
- {ngay_cap_gcn}
- {thua_dat_so}
- {to_ban_do_info}
- {dien_tich_loai_dat}
- {noi_dung_uy_quyen}
- {ubnd_xa_chung_thuc}
- {nguoi_thuc_hien_chung_thuc}
- {nguoi_tiep_nhan_ho_so}

Ghi chu: Template nay da dung block dong. Khi tang/giam so nguoi, chi can them bot dong trong form, khong sua tag Word theo index.

### bien_dong.docx

Dat cac tag sau:

- {ho_ten}
- {giay_to_nhan_than}
- {dia_chi}
- {thua_dat_so}
- {to_ban_do_so}
- {dien_tich}

## 3) Luu y quan trong

- Chi dung file .docx, khong dung .doc.
- Khong dung file tam bat dau bang ~$.
- Giu nguyen ten key, khong them dau, khong viet hoa khac.
- Nen dung 1 kieu delimiter dong nhat: {key}.

## 4) Truong hop file uy_quyen hien la .doc

Neu ban chi co file .doc, mo bang Word va Save As thanh uy_quyen.docx, sau do copy vao public/templates.
