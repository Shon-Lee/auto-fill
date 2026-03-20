$ErrorActionPreference = 'Stop'

$file = 'e:\Tool\public\templates\uy_quyen.docx'
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

function Replace-AllText {
  param(
    [Parameter(Mandatory = $true)][object]$Document,
    [Parameter(Mandatory = $true)][string]$FindText,
    [Parameter(Mandatory = $true)][string]$ReplaceWith
  )

  if (-not $Document.Content.Text.Contains($FindText)) {
    Write-Host "MISS: $FindText"
    return
  }

  $null = $Document.Content.Find.Execute(
    $FindText,
    $false,
    $false,
    $false,
    $false,
    $false,
    $true,
    1,
    $false,
    $ReplaceWith,
    2
  )

  Write-Host "OK: $FindText -> $ReplaceWith"
}

try {
  $doc = $word.Documents.Open($file)

  Replace-AllText -Document $doc -FindText 'tại UBND Xã Xuân Trường, tỉnh Ninh Bình.' -ReplaceWith 'tại UBND Xã {dia_diem_lap_hop_dong}, tỉnh Ninh Bình.'
  Replace-AllText -Document $doc -FindText 'Ngày sinh: 01/01/1968' -ReplaceWith 'Ngày sinh: {ben_a_ngay_sinh}'
  Replace-AllText -Document $doc -FindText 'cấp ngày: 26/11/2025.' -ReplaceWith 'cấp ngày: {ben_a_ngay_cap}.'
  Replace-AllText -Document $doc -FindText 'Bà: VŨ THỊ L' -ReplaceWith 'Bà: {ben_a2_ho_ten}'
  Replace-AllText -Document $doc -FindText 'Ngày sinh: 11/3/1973' -ReplaceWith 'Ngày sinh: {ben_a2_ngay_sinh}'
  Replace-AllText -Document $doc -FindText 'CCCD số: 036173002988' -ReplaceWith 'CCCD số: {ben_a2_cccd}'
  Replace-AllText -Document $doc -FindText 'cấp ngày: 02/07/2021.' -ReplaceWith 'cấp ngày: {ben_a2_ngay_cap}.'
  Replace-AllText -Document $doc -FindText 'Nơi thường trú: xã X, tỉnh Ninh Bình.' -ReplaceWith 'Nơi thường trú: {ben_a2_dia_chi}.'
  Replace-AllText -Document $doc -FindText 'Ngày sinh: 12/11/1996' -ReplaceWith 'Ngày sinh: {ben_b_ngay_sinh}'
  Replace-AllText -Document $doc -FindText 'cấp ngày: 20/6/2023.' -ReplaceWith 'cấp ngày: {ben_b_ngay_cap}.'

  Replace-AllText -Document $doc -FindText 'QSDĐ/932/QĐUB' -ReplaceWith '{so_vao_so}'
  Replace-AllText -Document $doc -FindText 'huyện X, tỉnh Nam Định' -ReplaceWith '{co_quan_cap_gcn}'
  Replace-AllText -Document $doc -FindText 'cấp ngày 20/11/1998;' -ReplaceWith 'cấp ngày {ngay_cap_gcn};'
  Replace-AllText -Document $doc -FindText 'thửa đất số 37;' -ReplaceWith 'thửa đất số {thua_dat_so};'
  Replace-AllText -Document $doc -FindText 'tờ bản đồ số 63' -ReplaceWith 'tờ bản đồ số {to_ban_do_so}'

  Replace-AllText -Document $doc -FindText 'tại UBND xã X' -ReplaceWith 'tại {ubnd_xa_chung_thuc}'
  Replace-AllText -Document $doc -FindText 'Tại: UBND xã X, tỉnh Ninh Bình.' -ReplaceWith 'Tại: {dia_diem_chung_thuc}.'
  Replace-AllText -Document $doc -FindText 'Tôi: Phạm Ngọc Vinh - PCT UBND xã X, tỉnh Ninh Bình.' -ReplaceWith 'Tôi: {nguoi_thuc_hien_chung_thuc}.'
  Replace-AllText -Document $doc -FindText 'bà Đỗ Hùng Hoài là người tiếp nhận hồ sơ.' -ReplaceWith 'bà {nguoi_tiep_nhan_ho_so} là người tiếp nhận hồ sơ.'
  Replace-AllText -Document $doc -FindText 'Số chứng thực ……quyền số 01/2026 -SCT/GD/.' -ReplaceWith 'Số chứng thực ……quyền số {so_quyen_chung_thuc}.'

  Replace-AllText -Document $doc -FindText 'Hoàng Văn C' -ReplaceWith '{ben_a_ho_ten}'
  Replace-AllText -Document $doc -FindText 'Bùi Thu Q' -ReplaceWith '{ben_b_ho_ten}'
  Replace-AllText -Document $doc -FindText 'Bui Thu Q' -ReplaceWith '{ben_b_ho_ten}'
  Replace-AllText -Document $doc -FindText 'O 413742' -ReplaceWith '{so_giay_chung_nhan}'

  $doc.Save()
  $doc.Close()

  Write-Host 'UY_QUYEN_DYNAMIC_PATCH_DONE'
}
finally {
  $word.Quit()
}
