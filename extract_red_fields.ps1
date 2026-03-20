Add-Type -AssemblyName System.IO.Compression.FileSystem

function Get-ZipXml {
  param(
    [Parameter(Mandatory = $true)][System.IO.Compression.ZipArchive]$Zip,
    [Parameter(Mandatory = $true)][string]$EntryName
  )

  $entry = $Zip.GetEntry($EntryName)
  if (-not $entry) {
    return $null
  }

  $reader = [System.IO.StreamReader]::new($entry.Open())
  try {
    return [xml]$reader.ReadToEnd()
  }
  finally {
    $reader.Close()
  }
}

function Get-XmlAttrValue {
  param(
    [Parameter(Mandatory = $true)]$Node,
    [Parameter(Mandatory = $true)][string[]]$Names
  )

  foreach ($name in $Names) {
    $attr = $Node.Attributes[$name]
    if ($attr -and $attr.Value) {
      return $attr.Value
    }
  }

  foreach ($attr in $Node.Attributes) {
    foreach ($name in $Names) {
      if ($attr.Name -eq $name -or $attr.LocalName -eq $name) {
        return $attr.Value
      }
    }
  }

  return $null
}

function Test-IsRedColor {
  param([string]$Color)

  if (-not $Color) {
    return $false
  }

  $normalized = $Color.Trim().ToUpper()
  return @('FF0000', 'FFFF0000', 'RED') -contains $normalized
}

function Get-DocxStyleMap {
  param([xml]$StylesXml)

  $map = @{}
  if (-not $StylesXml) {
    return $map
  }

  $ns = [System.Xml.XmlNamespaceManager]::new($StylesXml.NameTable)
  $ns.AddNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')

  foreach ($style in $StylesXml.SelectNodes('//w:style', $ns)) {
    $styleId = Get-XmlAttrValue $style @('w:styleId', 'styleId')
    if (-not $styleId) {
      continue
    }

    $colorNode = $style.SelectSingleNode('w:rPr/w:color', $ns)
    if ($colorNode) {
      $color = Get-XmlAttrValue $colorNode @('w:val', 'val')
      if (Test-IsRedColor $color) {
        $map[$styleId] = $true
      }
    }
  }

  return $map
}

function Get-DocxRedSegmentsFromPart {
  param(
    [xml]$PartXml,
    [hashtable]$RedStyleIds,
    [string]$PartName
  )

  $segments = @()
  if (-not $PartXml) {
    return $segments
  }

  $ns = [System.Xml.XmlNamespaceManager]::new($PartXml.NameTable)
  $ns.AddNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')

  foreach ($paragraph in $PartXml.SelectNodes('//w:p', $ns)) {
    $buffer = ''
    foreach ($run in $paragraph.SelectNodes('./w:r', $ns)) {
      $isRed = $false

      $colorNode = $run.SelectSingleNode('./w:rPr/w:color', $ns)
      if ($colorNode) {
        $color = Get-XmlAttrValue $colorNode @('w:val', 'val')
        if (Test-IsRedColor $color) {
          $isRed = $true
        }
      }

      if (-not $isRed) {
        $styleNode = $run.SelectSingleNode('./w:rPr/w:rStyle', $ns)
        if ($styleNode) {
          $styleId = Get-XmlAttrValue $styleNode @('w:val', 'val')
          if ($styleId -and $RedStyleIds.ContainsKey($styleId)) {
            $isRed = $true
          }
        }
      }

      $text = ''
      foreach ($tabNode in $run.SelectNodes('./w:tab', $ns)) {
        $text += "`t"
      }
      foreach ($textNode in $run.SelectNodes('./w:t', $ns)) {
        $text += $textNode.InnerText
      }

      if ($isRed -and $text) {
        $buffer += $text
      }
      else {
        if ($buffer.Trim()) {
          $segments += [pscustomobject]@{
            Part = $PartName
            Text = $buffer.Trim()
          }
        }
        $buffer = ''
      }
    }

    if ($buffer.Trim()) {
      $segments += [pscustomobject]@{
        Part = $PartName
        Text = $buffer.Trim()
      }
    }
  }

  return $segments
}

function Get-DocxRedSegments {
  param([string]$Path)

  $zip = [System.IO.Compression.ZipFile]::OpenRead($Path)
  try {
    $stylesXml = Get-ZipXml -Zip $zip -EntryName 'word/styles.xml'
    $redStyleIds = Get-DocxStyleMap -StylesXml $stylesXml
    $parts = @('word/document.xml')
    $parts += $zip.Entries |
      Where-Object { $_.FullName -match '^word/(header|footer)\d+\.xml$' } |
      Select-Object -ExpandProperty FullName

    $segments = @()
    foreach ($part in $parts) {
      $partXml = Get-ZipXml -Zip $zip -EntryName $part
      $segments += Get-DocxRedSegmentsFromPart -PartXml $partXml -RedStyleIds $redStyleIds -PartName $part
    }

    return $segments
  }
  finally {
    $zip.Dispose()
  }
}

function Get-XlsxSharedStrings {
  param([System.IO.Compression.ZipArchive]$Zip)

  $sharedXml = Get-ZipXml -Zip $Zip -EntryName 'xl/sharedStrings.xml'
  if (-not $sharedXml) {
    return @()
  }

  $values = @()
  foreach ($si in $sharedXml.sst.si) {
    $fullText = $si.InnerText
    $redParts = @()
    foreach ($run in $si.r) {
      $colorNode = $run.rPr.color
      if ($colorNode) {
        $color = Get-XmlAttrValue $colorNode @('rgb', 'indexed', 'theme')
        if (Test-IsRedColor $color) {
          $runText = $run.t.InnerText
          if ($runText) {
            $redParts += $runText
          }
        }
      }
    }

    $values += [pscustomobject]@{
      FullText = $fullText
      RedText = ($redParts -join '')
    }
  }

  return $values
}

function Get-XlsxStyleColorMap {
  param([xml]$StylesXml)

  $fontColors = @()
  foreach ($font in $StylesXml.styleSheet.fonts.font) {
    $colorNode = $font.color
    if ($colorNode) {
      $fontColors += (Get-XmlAttrValue $colorNode @('rgb', 'indexed', 'theme'))
    }
    else {
      $fontColors += $null
    }
  }

  $styleColors = @()
  foreach ($xf in $StylesXml.styleSheet.cellXfs.xf) {
    $fontId = Get-XmlAttrValue $xf @('fontId')
    if ($null -ne $fontId -and [int]$fontId -lt $fontColors.Count) {
      $styleColors += $fontColors[[int]$fontId]
    }
    else {
      $styleColors += $null
    }
  }

  return $styleColors
}

function Get-XlsxRedSegments {
  param([string]$Path)

  $zip = [System.IO.Compression.ZipFile]::OpenRead($Path)
  try {
    $sharedStrings = Get-XlsxSharedStrings -Zip $zip
    $stylesXml = Get-ZipXml -Zip $zip -EntryName 'xl/styles.xml'
    $styleColors = @()
    if ($stylesXml) {
      $styleColors = Get-XlsxStyleColorMap -StylesXml $stylesXml
    }

    $results = @()
    foreach ($sheetEntry in $zip.Entries | Where-Object { $_.FullName -match '^xl/worksheets/sheet\d+\.xml$' }) {
      $sheetXml = Get-ZipXml -Zip $zip -EntryName $sheetEntry.FullName
      if (-not $sheetXml) {
        continue
      }

      foreach ($row in $sheetXml.worksheet.sheetData.row) {
        foreach ($cell in $row.c) {
          $cellRef = $cell.r
          $styleIndexRaw = Get-XmlAttrValue $cell @('s')
          $styleColor = $null
          if ($styleIndexRaw -and [int]$styleIndexRaw -lt $styleColors.Count) {
            $styleColor = $styleColors[[int]$styleIndexRaw]
          }

          $rawText = ''
          $redText = ''
          if ($cell.t -eq 's') {
            $sharedIndex = [int]$cell.InnerText
            if ($sharedIndex -lt $sharedStrings.Count) {
              $rawText = $sharedStrings[$sharedIndex].FullText
              $redText = $sharedStrings[$sharedIndex].RedText
            }
          }
          elseif ($cell.t -eq 'inlineStr') {
            $rawText = $cell.is.InnerText
          }
          else {
            $rawText = $cell.InnerText
          }

          $rawText = $rawText.Trim()
          $redText = $redText.Trim()

          if ((Test-IsRedColor $styleColor) -and $rawText) {
            $results += [pscustomobject]@{
              Sheet = $sheetEntry.FullName
              Cell = $cellRef
              Text = $rawText
              Source = 'cell-style'
            }
          }
          elseif ($redText) {
            $results += [pscustomobject]@{
              Sheet = $sheetEntry.FullName
              Cell = $cellRef
              Text = $redText
              Source = 'shared-string-rich-text'
            }
          }
        }
      }
    }

    return $results
  }
  finally {
    $zip.Dispose()
  }
}

$root = 'e:\Tool'
$folder = Get-ChildItem $root -Directory | Select-Object -First 1 -ExpandProperty FullName

if (-not $folder) {
  throw "No template folder found under $root"
}

foreach ($file in Get-ChildItem $folder -Filter *.docx | Sort-Object Name) {
  "==== $($file.Name) ===="
  $segments = Get-DocxRedSegments -Path $file.FullName | Select-Object -ExpandProperty Text
  if (-not $segments) {
    '(no red text found)'
  }
  else {
    $segments |
      Where-Object { $_.Trim() } |
      Sort-Object -Unique |
      ForEach-Object { "- $_" }
  }
  ''
}

foreach ($file in Get-ChildItem $folder -Filter *.xlsx | Sort-Object Name) {
  "==== $($file.Name) ===="
  $segments = Get-XlsxRedSegments -Path $file.FullName
  if (-not $segments) {
    '(no red text found)'
  }
  else {
    $segments |
      Sort-Object Sheet, Cell, Text |
      ForEach-Object { "- [$($_.Cell)] $($_.Text) ($($_.Source))" }
  }
  ''
}
