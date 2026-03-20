# van_ban_thua_ke Template Spec

- Template name: van_ban_thua_ke
- File type: docx
- Purpose: generate Van ban thoa thuan phan chia di san thua ke

## Rendering Rules

- Keep the original source layout unchanged.
- Replace only dynamic content regions.
- Data has two groups:
  - primitive fields
  - repeating block for heirs list
- Do not link data with other templates.

## 1) Header section

Location: below title "VAN BAN THOA THUAN PHAN CHIA DI SAN THUA KE"

Fields:

- dia_diem_ubnd_xa

## 2) Heirs repeating block

Location: below line "Chung toi gom co:"

Array field: ds_nguoi_thua_ke[]

Item fields:

- xung_ho
- ho_ten
- ngay_sinh
- so_cccd
- ngay_cap
- quan_he
- dia_chi_thuong_tru

Render pattern per item:

{stt}. {xung_ho}: {ho_ten}, ngay sinh {ngay_sinh}, CCCD so {so_cccd}, cap ngay {ngay_cap}, la {quan_he}.

- Thuong tru tai: {dia_chi_thuong_tru}.

Notes:

- stt auto-increments from 1.
- Number of rows is dynamic.

## 3) Deceased parents names

Fields:

- ten_cha_da_mat
- ten_me_da_mat

Notes:

- Can appear multiple times in the document.
- Must be replaced consistently in all occurrences.

## 4) Main inheritance body

Field:

- noi_dung_thua_ke

Type:

- long textarea

Behavior:

- Insert as one full block in the main body location.
- Do not split this block into multiple tiny fields in version 1.

## 5) Commitment section

- Reuse existing fields if only parents names are repeated.
- Do not create redundant new fields.

## 6) Certification section

Fields:

- xa_chung_thuc
- nguoi_thuc_hien_chung_thuc
- nguoi_tiep_nhan_ho_so
- nguoi_duoc_cap_ban
- so_quyen_chung_thuc

## 7) Full field map

```json
{
  "dia_diem_ubnd_xa": "text",
  "ds_nguoi_thua_ke": [
    {
      "xung_ho": "text",
      "ho_ten": "text",
      "ngay_sinh": "text",
      "so_cccd": "text",
      "ngay_cap": "text",
      "quan_he": "text",
      "dia_chi_thuong_tru": "text"
    }
  ],
  "ten_cha_da_mat": "text",
  "ten_me_da_mat": "text",
  "noi_dung_thua_ke": "textarea",
  "xa_chung_thuc": "text",
  "nguoi_thuc_hien_chung_thuc": "text",
  "nguoi_tiep_nhan_ho_so": "text",
  "nguoi_duoc_cap_ban": "text",
  "so_quyen_chung_thuc": "text"
}
```

## 8) UI guidance

- Render two input groups:
  - primitive fields
  - heirs table
- Heirs table columns:
  - xung_ho
  - ho_ten
  - ngay_sinh
  - so_cccd
  - ngay_cap
  - quan_he
  - dia_chi_thuong_tru
- Must support multi-row paste from Excel.
- noi_dung_thua_ke should be a large textarea.
