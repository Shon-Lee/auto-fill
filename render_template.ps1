param(
  [Parameter(Mandatory = $true)][string]$RootDir,
  [Parameter(Mandatory = $true)][string]$TemplateId,
  [Parameter(Mandatory = $true)][string]$PayloadPath,
  [Parameter(Mandatory = $true)][string]$OutputDir
)

$ErrorActionPreference = "Stop"

function Read-JsonFile {
  param([string]$Path)
  Get-Content -LiteralPath $Path -Raw | ConvertFrom-Json
}

function Resolve-TemplateDir {
  $dir = Get-ChildItem -LiteralPath $RootDir -Directory | Where-Object {
    (Get-ChildItem -LiteralPath $_.FullName -File | Where-Object { $_.Extension -match '\.(doc|docx|xlsx)$' }).Count -gt 0
  } | Select-Object -First 1

  if (-not $dir) { throw "Khong tim thay thu muc template." }
  return $dir.FullName
}

function Resolve-TemplateFile {
  param(
    [string]$TemplateDir,
    [scriptblock]$Predicate
  )
  $hit = Get-ChildItem -LiteralPath $TemplateDir -File | Where-Object $Predicate | Select-Object -First 1
  if (-not $hit) { throw "Khong tim thay file template phu hop." }
  return $hit.FullName
}

function To-Hashtable {
  param($Object)
  $hash = @{}
  if ($null -eq $Object) { return $hash }
  $Object.PSObject.Properties | ForEach-Object { $hash[$_.Name] = [string]$_.Value }
  return $hash
}

function Replace-AllInWord {
  param($Document, [hashtable]$Map)
  foreach ($findText in $Map.Keys) {
    if ([string]::IsNullOrWhiteSpace($findText)) { continue }
    $replaceText = [string]$Map[$findText]
    $range = $Document.Content
    $range.Find.ClearFormatting() | Out-Null
    $range.Find.Replacement.ClearFormatting() | Out-Null
    $wdReplaceAll = 2
    $wdFindContinue = 1
    $range.Find.Execute($findText, $false, $false, $false, $false, $false, $true, $wdFindContinue, $false, $replaceText, $wdReplaceAll) | Out-Null
  }
}

function Replace-AllInExcel {
  param($Workbook, [hashtable]$Map)
  foreach ($sheet in $Workbook.Worksheets) {
    foreach ($findText in $Map.Keys) {
      if ([string]::IsNullOrWhiteSpace($findText)) { continue }
      $sheet.Cells.Replace($findText, [string]$Map[$findText]) | Out-Null
    }
  }
}

function Render-WordFile {
  param([string]$TemplatePath, [string]$OutputBaseName, [hashtable]$Map)
  $word = New-Object -ComObject Word.Application
  $word.Visible = $false
  $doc = $null
  try {
    $doc = $word.Documents.Open($TemplatePath)
    Replace-AllInWord -Document $doc -Map $Map
    $docxPath = Join-Path $OutputDir ($OutputBaseName + ".docx")
    $pdfPath = Join-Path $OutputDir ($OutputBaseName + ".pdf")
    $wdFormatDocumentDefault = 16
    $wdExportFormatPDF = 17
    $doc.SaveAs2($docxPath, $wdFormatDocumentDefault)
    $doc.ExportAsFixedFormat($pdfPath, $wdExportFormatPDF)
    return @{ outputPath = $docxPath; pdfPath = $pdfPath }
  }
  finally {
    if ($doc) { $doc.Close($false) }
    $word.Quit()
  }
}

function Render-ExcelFile {
  param([string]$TemplatePath, [string]$OutputBaseName, [hashtable]$Map)
  $excel = New-Object -ComObject Excel.Application
  $excel.Visible = $false
  $excel.DisplayAlerts = $false
  $workbook = $null
  try {
    $workbook = $excel.Workbooks.Open($TemplatePath)
    Replace-AllInExcel -Workbook $workbook -Map $Map
    $xlsxPath = Join-Path $OutputDir ($OutputBaseName + ".xlsx")
    $pdfPath = Join-Path $OutputDir ($OutputBaseName + ".pdf")
    $xlOpenXMLWorkbook = 51
    $xlTypePDF = 0
    $workbook.SaveAs($xlsxPath, $xlOpenXMLWorkbook)
    $workbook.ExportAsFixedFormat($xlTypePDF, $pdfPath)
    return @{ outputPath = $xlsxPath; pdfPath = $pdfPath }
  }
  finally {
    if ($workbook) { $workbook.Close($false) }
    $excel.Quit()
  }
}

$payload = Read-JsonFile -Path $PayloadPath
$simple = To-Hashtable -Object $payload.data.simple
$templateDir = Resolve-TemplateDir
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$result = $null

switch ($TemplateId) {
  "vb_mien_giam" {
    $template = Resolve-TemplateFile -TemplateDir $templateDir -Predicate { $_.Extension -eq ".docx" -and $_.BaseName -like "vb*" }
    $map = @{
      "HOÀNG VĂN C" = $simple.ten_nguoi_nop_thue
      "036068011111" = $simple.ma_so_thue
      "Hoàng Văn C" = $simple.chu_ky_ho_ten
      "Kính gửi:- UBND xã X" = ("Kính gửi:- UBND xã " + $simple.ubnd_xa_kinh_gui)
      "X, ngày" = ($simple.dia_diem_lap_van_ban + ", ngày")
      "Phường/xã: X" = ("Phường/xã: " + $simple.phuong_xa)
    }
    $result = Render-WordFile -TemplatePath $template -OutputBaseName "$TemplateId-$stamp" -Map $map
  }
  "don_dang_ky_bien_dong" {
    $template = Resolve-TemplateFile -TemplateDir $templateDir -Predicate { $_.Extension -eq ".docx" -and $_.BaseName -notlike "vb*" -and $_.BaseName -notlike "v*" }
    $map = @{
      "HOÀNG VĂN C" = $simple.ho_ten
      "03606801 111" = $simple.giay_to_nhan_than
      "Nhận thừa kế QSDĐ" = $simple.noi_dung_bien_dong
      "37" = $simple.thua_dat_so
      "63" = $simple.to_ban_do_so
      "270,0" = $simple.dien_tich
      "(ONT)" = $simple.loai_dat
      "xã Xuân" = ("xã " + $simple.xa_thua_dat)
      "Không có nhu cầu cấp mới Giấy chứng nhận" = $simple.noi_dung_cap_moi_gcn
      "Hoàng Văn C" = $simple.chu_ky_ho_ten
    }
    $result = Render-WordFile -TemplatePath $template -OutputBaseName "$TemplateId-$stamp" -Map $map
  }
  "hop_dong_uy_quyen" {
    $template = Resolve-TemplateFile -TemplateDir $templateDir -Predicate { $_.Extension -eq ".doc" }
    $map = @{
      "Xuân Trường" = $simple.dia_diem_lap_hop_dong
      "HOÀNG VĂN C" = $simple.ben_a_nguoi_1_ho_ten
      "01/01/1968" = $simple.ben_a_nguoi_1_ngay_sinh
      "036068011111" = $simple.ben_a_nguoi_1_so_cccd
      "26/11/2025" = $simple.ben_a_nguoi_1_ngay_cap
      "VŨ THỊ L" = $simple.ben_a_nguoi_2_ho_ten
      "11/3/1973" = $simple.ben_a_nguoi_2_ngay_sinh
      "036173002988" = $simple.ben_a_nguoi_2_so_cccd
      "02/07/2021" = $simple.ben_a_nguoi_2_ngay_cap
      "BÙI THU Q" = $simple.ben_b_ho_ten
      "12/11/1996" = $simple.ben_b_ngay_sinh
      "036196019000" = $simple.ben_b_so_cccd
      "20/6/2023" = $simple.ben_b_ngay_cap
      "O 413742" = $simple.so_giay_chung_nhan
      "20/11/1998" = $simple.ngay_cap_gcn
      "37" = $simple.thua_dat_so
      "63" = $simple.to_ban_do_so
      "270 m2" = $simple.dien_tich
      "ONT" = $simple.loai_dat
      "UBND xã X" = $simple.ubnd_xa_chung_thuc
      "xã X" = $simple.xa_chung_thuc
      "Đỗ Hùng Hoài" = $simple.nguoi_tiep_nhan_ho_so
    }
    if ($simple.so_vao_so) {
      $map["…QSDĐ/932/QĐUB"] = $simple.so_vao_so
    }
    if ($simple.co_quan_cap_gcn) {
      $map["Ủy ban nhân dân huyện X, tỉnh Nam Định"] = $simple.co_quan_cap_gcn
    }
    if ($simple.xa_dia_chinh_cu) {
      $map["Xuân P cũ"] = $simple.xa_dia_chinh_cu
    }
    $result = Render-WordFile -TemplatePath $template -OutputBaseName "$TemplateId-$stamp" -Map $map
  }
  "thue_xlsx" {
    $template = Resolve-TemplateFile -TemplateDir $templateDir -Predicate { $_.Extension -eq ".xlsx" }
    $map = @{
      "Hoàng Văn C" = $simple.ho_va_ten
      "01/01/1968" = $simple.ngay_sinh
      "036068011111" = $simple.so_cmnd_cccd
      "26/11/2025" = $simple.ngay_cap
      "X" = $simple.xa
      "Ninh Bình" = $simple.tinh_thanh_pho
      "O 413742" = $simple.so_giay_chung_nhan
      "20/11/1998" = $simple.ngay_cap_gcn
      "37" = $simple.thua_dat_so
      "63" = $simple.to_ban_do_so
      "270,0" = $simple.dien_tich
      "ONT" = $simple.loai_dat
    }
    $result = Render-ExcelFile -TemplatePath $template -OutputBaseName "$TemplateId-$stamp" -Map $map
  }
  "van_ban_thua_ke" {
    $template = Resolve-TemplateFile -TemplateDir $templateDir -Predicate { $_.Extension -eq ".docx" -and $_.BaseName -like "v*" -and $_.BaseName -notlike "vb*" }
    $map = @{
      "Ủy ban nhân dân xã X" = $simple.dia_diem_ubnd_xa
      "Hoàng Văn Huống" = $simple.ten_cha_da_mat
      "Trần Thị Vải" = $simple.ten_me_da_mat
      "xã X" = $simple.xa_chung_thuc
      "Đỗ Hùng Hoài" = $simple.nguoi_tiep_nhan_ho_so
      "Hoàng Văn Chính" = $simple.nguoi_duoc_cap_ban
      "01/2026 -SCT/GD" = $simple.so_quyen_chung_thuc
    }
    if ($simple.noi_dung_thua_ke) {
      $map["Di sản của cha, mẹ chúng tôi là ông Hoàng Văn Huống và bà Trần Thị Vải"] = $simple.noi_dung_thua_ke
    }
    $result = Render-WordFile -TemplatePath $template -OutputBaseName "$TemplateId-$stamp" -Map $map
  }
  default {
    throw "Template khong duoc ho tro: $TemplateId"
  }
}

$meta = @{
  templateId = $TemplateId
  outputPath = $result.outputPath
  pdfPath = $result.pdfPath
}

$meta | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $OutputDir ($TemplateId + ".meta.json")) -Encoding UTF8
